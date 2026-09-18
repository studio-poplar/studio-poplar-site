"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import {
  CLOSING_MESSAGE,
  INTRO_MESSAGE,
  MAX_FREE_TEXT_LENGTH,
  PRIVACY_NOTICE,
  QUESTIONS,
  TOTAL_QUESTIONS,
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

function makeId() {
  return Math.random().toString(36).slice(2);
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

  useEffect(() => {
    retryPendingNotify();
  }, []);

  function handleOpen() {
    setOpen(true);
    trackEvent("hearing_chat_open");
  }

  return (
    <>
      <button type="button" className={styles.launcher} onClick={handleOpen}>
        <span className={styles.launcherDot} aria-hidden="true" />
        AIと話す
      </button>
      {open && <HearingChatModal onClose={() => setOpen(false)} />}
    </>
  );
}

function HearingChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: makeId(), role: "assistant", content: INTRO_MESSAGE },
    { id: makeId(), role: "assistant", content: QUESTIONS[0].text },
  ]);
  const [step, setStep] = useState(1);
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

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function pushMessage(role: "user" | "assistant", content: string) {
    setMessages((prev) => [...prev, { id: makeId(), role, content }]);
  }

  async function finishSession(lastAck: string) {
    const transcript = [...messages, { role: "assistant" as const, content: lastAck + "\n\n" + CLOSING_MESSAGE }]
      .map((m) => `${m.role === "user" ? "来訪者" : "AI"}: ${m.content}`)
      .join("\n");

    pushMessage("assistant", lastAck + "\n\n" + CLOSING_MESSAGE);
    setDone(true);
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

  function advanceAfter(ack: string, record: AnswerRecord) {
    answersRef.current = [...answersRef.current, record];
    trackEvent("hearing_chat_step", { step });

    const isLast = step >= TOTAL_QUESTIONS;
    if (isLast) {
      finishSession(ack);
      return;
    }

    pushMessage("assistant", ack + "\n\n" + QUESTIONS[step].text);
    setStep((s) => s + 1);
    setFollowupUsed(false);
    setMultiSelected(new Set());
  }

  function submitSingleChoice(choiceLabel: string, ack: string, category?: Category) {
    if (done || busy) return;
    pushMessage("user", choiceLabel);
    userTurnCountRef.current += 1;
    const question = QUESTIONS[step - 1];
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      advanceAfter(ack, {
        question: question.text,
        label: choiceLabel,
        freeText: null,
        categories: category ? [category] : undefined,
      });
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
    const question = QUESTIONS[step - 1];
    const chosen = question.choices.filter((c) => multiSelected.has(c.label));
    const labels = chosen.map((c) => c.label);
    const categories = chosen.map((c) => c.category).filter((c): c is Category => Boolean(c));

    pushMessage("user", labels.join("、"));
    userTurnCountRef.current += 1;
    setBusy(true);
    const ack = chosen.length === 1 ? chosen[0].ack : "複数の視点から教えてくださり、ありがとうございます。";

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

    const question = QUESTIONS[step - 1];

    try {
      const res = await fetch("/api/hearing-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step,
          userAnswer: text,
          alreadyFollowedUp: followupUsed,
          userTurnCount: userTurnCountRef.current,
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

  const currentQuestion = !done ? QUESTIONS[step - 1] : null;
  const showChips = currentQuestion && !followupUsed && !busy;
  const overLimit = input.length > MAX_FREE_TEXT_LENGTH;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="AIヒアリングチャット">
      <button type="button" className={styles.backdrop} aria-label="閉じる" onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <span className={`en ${styles.headerLabel}`}>AI HEARING</span>
            <span className={styles.headerTitle}>AIヒアリング</span>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>

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
                  onClick={() => submitSingleChoice(choice.label, choice.ack, choice.category)}
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

        {error && (
          <p className={styles.error} role="status">
            {error}
          </p>
        )}

        {done ? (
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
              打ち合わせに進む<span className={styles.arrowBadge}>→</span>
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
