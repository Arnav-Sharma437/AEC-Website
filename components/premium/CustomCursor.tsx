"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/premium/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor-hover], input, textarea, select, label"
      );
      hovering.current = Boolean(el);
      gsap.to(ring, {
        scale: hovering.current ? 2.2 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: hovering.current ? 0.5 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
      ring.classList.toggle("cursor-ring--accent", hovering.current);
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      gsap.set(dot, {
        x: pos.current.x,
        y: pos.current.y,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(ring, {
        x: pos.current.x,
        y: pos.current.y,
        xPercent: -50,
        yPercent: -50,
      });
    };

    gsap.ticker.add(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
