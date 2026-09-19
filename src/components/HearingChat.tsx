"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import {
  CLOSING_MESSAGE,
  EXPECTATION_NOTICE,
  INTRO_MESSAGE,
  MAX_FREE_TEXT_LENGTH,
  PRIVACY_NOTICE,
  STAGE_QUESTION,
  TOTAL_QUESTIONS,
  classifyStage,
  getQuestion,
  multiChoiceAck,
  FALLBACK_ACK,
  type BusinessStage,
  type Category,
} from "@/lib/hearing-chat";
import styles from "./HearingChat.module.css";

type DisplayMessage = { id: string; role: "user" | "assistant"; content: string };

type AnswerRecord = {
  question: string;
  label: string | null;
  freeText: string | null;
  categories?: Category[];
};

const PENDING_KEY = "hearing-chat-pending-notify";
const PROGRESS_KEY = "hearing-chat-progress";
const RESUME_PROMPT = "前回の続きから再開しますか?";

// Bump when the question flow changes shape so stale saves aren't resumed.
const PROGRESS_VERSION = 2;

type SavedProgress = {
  version: number;
  step: number;
  businessStage: BusinessStage | null;
  messages: DisplayMessage[];
  answers: AnswerRecord[];
  userTurnCount: number;
  followupUsed: boolean;
};

function makeId() {
  return Math.random().toString(36).slice(2);
}

function initialMessages(): DisplayMessage[] {
  return [
    { id: makeId(), role: "assistant", content: INTRO_MESSAGE },
    { id: makeId(), role: "assistant", content: STAGE_QUESTION.text },
  ];
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const stageOk = p.businessStage === null || p.businessStage === "existing" || p.businessStage === "starting";
    const valid =
      p.version === PROGRESS_VERSION &&
      stageOk &&
      typeof p.step === "number" &&
      p.step >= 1 &&
      p.step <= TOTAL_QUESTIONS &&
      Array.isArray(p.messages) &&
      Array.isArray(p.answers) &&
      typeof p.userTurnCount === "number";
    return valid ? { ...p, followupUsed: Boolean(p.followupUsed) } : null;
  } catch {
    return null;
  }
}

function saveProgress(progress: SavedProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore — resume is a convenience, not a requirement
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
}

async function sendNotify(payload: { answers: AnswerRecord[]; transcript: string }): Promise<boolean> {
  try {
    const res = await fetch("/api/hearing-chat", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

function retryPendingNotify() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    sendNotify(payload).then((ok) => {
      if (ok) localStorage.removeItem(PENDING_KEY);
    });
  } catch {
    // ignore — best effort only
  }
}

export default function HearingChatLauncher() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<SavedProgress | null>(null);

  useEffect(() => {
    retryPendingNotify();
  }, []);

  function handleOpen() {
    setSaved(loadProgress());
    setOpen(true);
    trackEvent("hearing_chat_open");
  }

  return (
    <>
      <button type="button" className="btn-primary" onClick={handleOpen}>
        <span className={styles.launcherDot} aria-hidden="true" />
        チャットで相談する<span className="btn-arrow">→</span>
      </button>
      {open && <HearingChatModal saved={saved} onClose={() => setOpen(false)} />}
    </>
  );
}

function HearingChatModal({ saved, onClose }: { saved: SavedProgress | null; onClose: () => void }) {
  const [messages, setMessages] = useState<DisplayMessage[]>(() =>
    saved ? [{ id: makeId(), role: "assistant", content: RESUME_PROMPT }] : initialMessages()
  );
  const [askResume, setAskResume] = useState(saved !== null);
  const [step, setStep] = useState(1);
  const [businessStage, setBusinessStage] = useState<BusinessStage | null>(null);
  const [followupUsed, setFollowupUsed] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifyFailed, setNotifyFailed] = useState(false);
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const answersRef = useRef<AnswerRecord[]>([]);
  const userTurnCountRef = useRef(0);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const latestRef = useRef({ messages, step, businessStage, followupUsed, done, askResume });
  useEffect(() => {
    latestRef.current = { messages, step, businessStage, followupUsed, done, askResume };
  });

  const handleClose = useCallback(() => {
    const latest = latestRef.current;
    if (latest.done) {
      clearProgress();
    } else if (!latest.askResume) {
      // Drop an unanswered trailing user message (request still in flight) so
      // the resumed chat doesn't show a question the AI never replied to.
      const kept = [...latest.messages];
      let turns = userTurnCountRef.current;
      while (kept.length > 0 && kept[kept.length - 1].role === "user") {
        kept.pop();
        turns -= 1;
      }
      if (turns > 0 || answersRef.current.length > 0) {
        saveProgress({
          version: PROGRESS_VERSION,
          step: latest.step,
          businessStage: latest.businessStage,
          messages: kept,
          answers: answersRef.current,
          userTurnCount: Math.max(turns, 0),
          followupUsed: latest.followupUsed,
        });
      }
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  function handleResume() {
    if (!saved) return;
    setMessages(saved.messages);
    setStep(saved.step);
    setBusinessStage(saved.businessStage);
    setFollowupUsed(saved.followupUsed);
    answersRef.current = saved.answers;
    userTurnCountRef.current = saved.userTurnCount;
    setAskResume(false);
    trackEvent("hearing_chat_resume");
  }

  function handleRestart() {
    clearProgress();
    setMessages(initialMessages());
    setAskResume(false);
  }

  function pushMessage(role: "user" | "assistant", content: string) {
    setMessages((prev) => [...prev, { id: makeId(), role, content }]);
  }

  async function finishSession(lastAck: string) {
    const transcript = [...messages, { role: "assistant" as const, content: lastAck + "\n\n" + CLOSING_MESSAGE }]
      .map((m) => `${m.role === "user" ? "来訪者" : "AI"}: ${m.content}`)
      .join("\n");

    pushMessage("assistant", lastAck + "\n\n" + CLOSING_MESSAGE);
    setDone(true);
    clearProgress();
    trackEvent("hearing_chat_complete");

    const payload = { answers: answersRef.current, transcript };
    const ok = await sendNotify(payload);
    if (!ok) {
      setNotifyFailed(true);
      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
      } catch {
        // ignore — retry button still works within this session
      }
    }
  }

  // stageOverride is for step 1, where the stage was only just decided and the
  // businessStage state hasn't re-rendered yet.
  function advanceAfter(ack: string, record: AnswerRecord, stageOverride?: BusinessStage) {
    answersRef.current = [...answersRef.current, record];
    trackEvent("hearing_chat_step", { step });

    const isLast = step >= TOTAL_QUESTIONS;
    if (isLast) {
      finishSession(ack);
      return;
    }

    pushMessage("assistant", ack + "\n\n" + getQuestion(step + 1, stageOverride ?? businessStage).text);
    setStep((s) => s + 1);
    setFollowupUsed(false);
    setMultiSelected(new Set());
  }

  function submitSingleChoice(choice: { label: string; ack: string; category?: Category; stage?: BusinessStage }) {
    if (done || busy) return;
    pushMessage("user", choice.label);
    userTurnCountRef.current += 1;
    const question = getQuestion(step, businessStage);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (choice.stage) setBusinessStage(choice.stage);
      advanceAfter(
        choice.ack,
        {
          question: question.text,
          label: choice.label,
          freeText: null,
          categories: choice.category ? [choice.category] : undefined,
        },
        choice.stage
      );
    }, 600);
  }

  function toggleMultiSelect(label: string) {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function submitMultiSelect() {
    if (done || busy || multiSelected.size === 0) return;
    const question = getQuestion(step, businessStage);
    const chosen = question.choices.filter((c) => multiSelected.has(c.label));
    const labels = chosen.map((c) => c.label);
    const categories = chosen.map((c) => c.category).filter((c): c is Category => Boolean(c));

    pushMessage("user", labels.join("、"));
    userTurnCountRef.current += 1;
    setBusy(true);
    const ack = chosen.length === 1 ? chosen[0].ack : multiChoiceAck(categories);

    setTimeout(() => {
      setBusy(false);
      advanceAfter(ack, {
        question: question.text,
        label: labels.join("、"),
        freeText: null,
        categories: categories.length > 0 ? categories : undefined,
      });
    }, 600);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy || done) return;
    if (text.length > MAX_FREE_TEXT_LENGTH) {
      setError(`回答は${MAX_FREE_TEXT_LENGTH}文字以内でお願いします。`);
      return;
    }

    pushMessage("user", text);
    userTurnCountRef.current += 1;
    setInput("");
    setBusy(true);
    setThinking(true);
    setError(null);

    const question = getQuestion(step, businessStage);

    // Step 1 only routes to the right wording — no model call needed.
    if (step === 1) {
      const stage = classifyStage(text);
      setTimeout(() => {
        setBusy(false);
        setThinking(false);
        setBusinessStage(stage);
        advanceAfter(FALLBACK_ACK, { question: question.text, label: null, freeText: text }, stage);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/hearing-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step,
          userAnswer: text,
          alreadyFollowedUp: followupUsed,
          userTurnCount: userTurnCountRef.current,
          businessStage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました。");
        return;
      }

      if (data.needs_followup && data.followup_question) {
        pushMessage("assistant", data.reflection + "\n\n" + data.followup_question);
        setFollowupUsed(true);
      } else {
        advanceAfter(data.reflection, { question: question.text, label: null, freeText: text });
      }
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
      setThinking(false);
    }
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  async function handleRetryNotify() {
    const ok = await sendNotify({ answers: answersRef.current, transcript: messages.map((m) => `${m.role === "user" ? "来訪者" : "AI"}: ${m.content}`).join("\n") });
    if (ok) {
      setNotifyFailed(false);
      try {
        localStorage.removeItem(PENDING_KEY);
      } catch {
        // ignore
      }
    }
  }

  const currentQuestion = !done ? getQuestion(step, businessStage) : null;
  const showChips = currentQuestion && !followupUsed && !busy && !askResume;
  const overLimit = input.length > MAX_FREE_TEXT_LENGTH;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="AIヒアリングチャット">
      <button type="button" className={styles.backdrop} aria-label="閉じる" onClick={handleClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <span className={`en ${styles.headerLabel}`}>AI HEARING</span>
            <span className={styles.headerTitle}>AIヒアリング</span>
          </div>
          <button type="button" className={styles.close} onClick={handleClose} aria-label="閉じる">
            ✕
          </button>
        </div>

        <p className={styles.notice}>{EXPECTATION_NOTICE}</p>

        <div className={styles.progress} aria-hidden="true">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <span key={i} className={`${styles.progressDot} ${i < step - 1 || done ? styles.progressDotActive : ""}`} />
          ))}
        </div>

        <p className={styles.privacy}>{PRIVACY_NOTICE}</p>

        <div className={styles.list} ref={listRef}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.bubble} ${m.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}>
              {m.content}
            </div>
          ))}
          {busy && (
            <div className={`${styles.bubble} ${styles.bubbleAi} ${styles.typing}`} aria-hidden="true">
              {thinking && <span className={styles.typingLabel}>考えています…</span>}
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        {showChips && currentQuestion && (
          <div className={styles.chips}>
            {currentQuestion.choices.map((choice) =>
              currentQuestion.multiSelect ? (
                <button
                  key={choice.label}
                  type="button"
                  className={`${styles.chip} ${multiSelected.has(choice.label) ? styles.chipSelected : ""}`}
                  onClick={() => toggleMultiSelect(choice.label)}
                >
                  {choice.label}
                </button>
              ) : (
                <button
                  key={choice.label}
                  type="button"
                  className={styles.chip}
                  onClick={() => submitSingleChoice(choice)}
                >
                  {choice.label}
                </button>
              )
            )}
            <button type="button" className={`${styles.chip} ${styles.chipOther}`} onClick={() => formRef.current?.querySelector("textarea")?.focus()}>
              その他(自由に書く)
            </button>
            {currentQuestion.multiSelect && (
              <button type="button" className={styles.chipConfirm} disabled={multiSelected.size === 0} onClick={submitMultiSelect}>
                この内容で次へ
              </button>
            )}
          </div>
        )}

        {askResume && (
          <div className={styles.chips}>
            <button type="button" className={styles.chipConfirm} onClick={handleResume}>
              続きから
            </button>
            <button type="button" className={styles.chip} onClick={handleRestart}>
              最初からやり直す
            </button>
          </div>
        )}

        {error && (
          <p className={styles.error} role="status">
            {error}
          </p>
        )}

        {askResume ? null : done ? (
          <div className={styles.doneRow}>
            {notifyFailed ? (
              <div className={styles.notifyFailed}>
                <p>送信の確認が取れませんでした。お手数ですがもう一度お試しください。</p>
                <button type="button" className={styles.retryBtn} onClick={handleRetryNotify}>
                  再送する
                </button>
              </div>
            ) : null}
            <Link
              href="/contact?message=AIヒアリングを完了しました。詳しいお打ち合わせをお願いします。"
              className="btn-primary"
              onClick={() => trackEvent("hearing_chat_to_contact")}
            >
              打ち合わせに進む<span className="btn-arrow">→</span>
            </Link>
          </div>
        ) : (
          <form ref={formRef} className={styles.inputRow} onSubmit={handleSubmit}>
            <div className={styles.textareaWrap}>
              <textarea
                className={styles.textarea}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="思っていることをそのまま書いてください"
                rows={2}
                disabled={busy}
                maxLength={MAX_FREE_TEXT_LENGTH + 20}
              />
              <span className={`${styles.counter} ${overLimit ? styles.counterOver : ""}`}>
                {input.length}/{MAX_FREE_TEXT_LENGTH}
              </span>
            </div>
            <button type="submit" className={styles.send} disabled={busy || !input.trim() || overLimit}>
              送信
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
