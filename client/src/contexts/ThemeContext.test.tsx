/** @vitest-environment jsdom */

import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" onClick={toggleTheme}>{theme}</button>;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    cleanup();
    document.documentElement.classList.remove("dark");
  });

  it("bascule vers le mode nuit et mémorise la préférence", async () => {
    render(<ThemeProvider switchable><ThemeProbe /></ThemeProvider>);

    fireEvent.click(screen.getByRole("button", { name: "light" }));

    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
    expect(window.localStorage.getItem("matiere-premiere-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
  });

  it("restaure une préférence nuit déjà enregistrée", async () => {
    window.localStorage.setItem("matiere-premiere-theme", "dark");
    render(<ThemeProvider switchable><ThemeProbe /></ThemeProvider>);

    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
  });
});
