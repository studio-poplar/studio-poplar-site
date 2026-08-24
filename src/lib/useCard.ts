"use client";

import { useEffect, useRef } from "react";

const MAX_TILT = 3.5;

export function useCard<T extends HTMLElement>(revealDelayMs = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // entrance reveal
    el.style.transitionDelay = reduceMotion ? "0ms" : `${revealDelayMs}ms`;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);

    // tilt-on-hover
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * MAX_TILT;
      const ry = (px - 0.5) * MAX_TILT;
      el.style.transitionDuration = ".25s";
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.008,1.008,1.008)`;
      el.style.boxShadow = "0 20px 44px -16px rgba(20,20,20,0.16)";
      el.style.zIndex = "5";
    }
    function onLeave() {
      if (!el) return;
      el.style.transitionDuration = ".6s";
      el.style.transform = "";
      el.style.boxShadow = "";
      el.style.zIndex = "";
    }

    if (!reduceMotion && canHover) {
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    }

    return () => {
      observer.disconnect();
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [revealDelayMs]);

  return ref;
}
