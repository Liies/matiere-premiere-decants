/** @vitest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OfficialFragranceVideo } from "./OfficialFragranceVideo";

describe("OfficialFragranceVideo", () => {
  it("diffère le lecteur Instagram officiel jusqu’à une action explicite", () => {
    render(<OfficialFragranceVideo productName="Vanilla Powder" productSlug="vanilla-powder" />);

    expect(screen.getByText("Vanilla Powder, en mouvement")).toBeTruthy();
    expect(screen.queryByTitle("Vanilla Powder Extrait — film officiel")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Lire le film officiel de Vanilla Powder" }));

    const player = screen.getByTitle("Vanilla Powder Extrait — film officiel");
    expect(player.getAttribute("src")).toBe("https://www.instagram.com/reel/DPwV4ozDnh_/embed/captioned/");
    expect(screen.getByRole("link", { name: /Ouvrir la publication officielle/ }).getAttribute("href")).toBe("https://www.instagram.com/reel/DPwV4ozDnh_/");
  });

  it("ne rend aucune section sans source vidéo officielle vérifiée", () => {
    const { container } = render(<OfficialFragranceVideo productName="Encens Suave" productSlug="encens-suave" />);

    expect(container.firstChild).toBeNull();
  });
});
