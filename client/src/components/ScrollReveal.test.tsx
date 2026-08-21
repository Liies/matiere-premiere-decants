// @vitest-environment jsdom
import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ScrollReveal from "./ScrollReveal";

describe("ScrollReveal", () => {
  let onIntersect: ((entries: IntersectionObserverEntry[]) => void) | undefined;

  beforeEach(() => {
    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        onIntersect = callback;
      }

      observe() {}
      disconnect() {}
    }

    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  afterEach(() => {
    cleanup();
    delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
  });

  it("révèle le contenu après son entrée dans la zone de lecture", () => {
    render(<ScrollReveal delayMs={80}>La collection</ScrollReveal>);

    const reveal = screen.getByText("La collection").closest("[data-scroll-reveal]") as HTMLDivElement | null;
    expect(reveal?.getAttribute("data-state")).toBe("hidden");
    expect(reveal?.style.getPropertyValue("--scroll-reveal-delay")).toBe("80ms");

    act(() => onIntersect?.([{ isIntersecting: true } as IntersectionObserverEntry]));

    expect(reveal?.getAttribute("data-state")).toBe("visible");
    expect(reveal?.className).toContain("scroll-reveal--visible");
  });
});
