import { describe, expect, it } from "vitest";

describe("Resend", () => {
  it("valide le fournisseur actif sans appeler Resend en mode simulation", async () => {
    const deliveryMode = process.env.EMAIL_DELIVERY_MODE ?? "mock";
    expect(["mock", "resend"]).toContain(deliveryMode);

    if (deliveryMode === "mock") {
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
