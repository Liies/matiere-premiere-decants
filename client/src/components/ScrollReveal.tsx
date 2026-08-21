import { useDeferredElementVisibility } from "@/hooks/useDeferredElementVisibility";
import { type CSSProperties, type ReactNode, useRef } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

const SCROLL_REVEAL_ROOT_MARGIN = "0px 0px -12% 0px";

/** Révèle une section une seule fois lorsqu’elle entre dans la zone de lecture. */
export default function ScrollReveal({ children, className = "", delayMs = 0 }: ScrollRevealProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const isVisible = useDeferredElementVisibility(targetRef, true, SCROLL_REVEAL_ROOT_MARGIN);
  const style = { "--scroll-reveal-delay": `${delayMs}ms` } as CSSProperties;

  return (
    <div
      ref={targetRef}
      data-scroll-reveal
      data-state={isVisible ? "visible" : "hidden"}
      className={`scroll-reveal ${isVisible ? "scroll-reveal--visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
