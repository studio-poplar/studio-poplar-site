"use client";

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>(revealDelayMs = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    return () => observer.disconnect();
  }, [revealDelayMs]);

  return ref;
}
