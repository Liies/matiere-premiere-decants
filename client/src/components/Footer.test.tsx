/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("affiche Snapchat parmi les réseaux sociaux", () => {
    render(<Footer />);

    expect(screen.getByRole("heading", { name: "Suivez-nous" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Snapchat" }).getAttribute("href")).toBe("#");
  });
});
