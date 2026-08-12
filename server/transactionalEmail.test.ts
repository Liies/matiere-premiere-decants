import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createOrderConfirmationEmail,
  createOrderStatusEmail,
  createOwnerOrderEmail,
  sendOrderCreatedEmails,
  sendOrderStatusEmail,
  sendTransactionalEmail,
} from "./transactionalEmail";

const order = {
  orderNumber: "MP-TEST-0001",
  customerName: "Camille <Martin>",
  customerEmail: "camille@example.com",
  totalAmount: 17_000,
  items: [{ productName: "Vanilla Powder", quantity: 2, unitPrice: 8_500 }],
};

afterEach(() => vi.unstubAllEnvs());

describe("modèles transactionnels", () => {
  it("prépare une notification propriétaire avec les articles et le montant", () => {
    const email = createOwnerOrderEmail(order, "owner@example.com");

    expect(email.to).toBe("owner@example.com");
    expect(email.subject).toContain(order.orderNumber);
    expect(email.html).toContain("Vanilla Powder");
    expect(email.html).toContain("170,00 €");
    expect(email.html).toContain("Camille &lt;Martin&gt;");
  });

  it("prépare une confirmation client et un email de statut lisibles", () => {
    const confirmation = createOrderConfirmationEmail(order);
    const status = createOrderStatusEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: "shipped",
    });

    expect(confirmation.to).toBe(order.customerEmail);
    expect(confirmation.text).toContain("MP-TEST-0001");
    expect(status.subject).toContain("expédiée");
    expect(status.html).toContain("Camille &lt;Martin&gt;");
  });
});

describe("adaptateur d’email", () => {
  it("journalise l’envoi simulé sans contacter Resend", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await sendTransactionalEmail({
      to: "client@example.com",
      subject: "Test",
      html: "<p>Test</p>",
      text: "Test",
    }, "mock");

    expect(result).toEqual({ mode: "mock", delivered: true });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("prépare l’email propriétaire et la confirmation client à la création", async () => {
    vi.stubEnv("EMAIL_DELIVERY_MODE", "mock");
    vi.stubEnv("ORDER_NOTIFICATION_EMAIL", "owner@example.com");

    const results = await sendOrderCreatedEmails(order);

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.status === "fulfilled")).toBe(true);
  });

  it("utilise EMAIL_FROM comme destinataire propriétaire de secours", async () => {
    vi.stubEnv("EMAIL_DELIVERY_MODE", "mock");
    vi.stubEnv("EMAIL_FROM", "boutique@example.com");
    vi.stubEnv("ORDER_NOTIFICATION_EMAIL", "");
    const sentTo: string[] = [];

    await sendOrderCreatedEmails(order, async (email) => {
      sentTo.push(email.to);
      return { mode: "mock", delivered: true };
    });

    expect(sentTo).toEqual(["boutique@example.com", "camille@example.com"]);
  });

  it("isole un échec propriétaire et conserve la confirmation client", async () => {
    vi.stubEnv("ORDER_NOTIFICATION_EMAIL", "owner@example.com");
    const sentTo: string[] = [];

    const results = await sendOrderCreatedEmails(order, async (email) => {
      sentTo.push(email.to);
      if (email.to === "owner@example.com") throw new Error("Boîte propriétaire indisponible");
      return { mode: "mock", delivered: true };
    });

    expect(results.map((result) => result.status)).toEqual(["rejected", "fulfilled"]);
    expect(sentTo).toEqual(["owner@example.com", "camille@example.com"]);
  });

  it("envoie l’email de statut au seul client concerné", async () => {
    const sender = vi.fn(async () => ({ mode: "mock" as const, delivered: true }));

    await sendOrderStatusEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: "delivered",
    }, sender);

    expect(sender).toHaveBeenCalledWith(expect.objectContaining({
      to: "camille@example.com",
      subject: expect.stringContaining("livrée"),
    }));
  });

  it("prépare la requête Resend avec les champs attendus sans appeler le réseau réel", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "boutique@example.com");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));

    await expect(sendTransactionalEmail({
      to: "camille@example.com",
      subject: "Confirmation test",
      html: "<p>Test</p>",
      text: "Test",
    }, "resend")).resolves.toEqual({ mode: "resend", delivered: true });

    expect(fetchSpy).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ Authorization: "Bearer re_test_key" }),
    }));
    expect(JSON.parse((fetchSpy.mock.calls[0]?.[1] as RequestInit).body as string)).toMatchObject({
      from: "boutique@example.com",
      to: ["camille@example.com"],
      subject: "Confirmation test",
    });
    fetchSpy.mockRestore();
  });

  it("signale proprement le refus de Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "boutique@example.com");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 422 }));

    await expect(sendTransactionalEmail({
      to: "camille@example.com",
      subject: "Confirmation test",
      html: "<p>Test</p>",
      text: "Test",
    }, "resend")).rejects.toThrow("Resend a refusé l’envoi (422)");
    fetchSpy.mockRestore();
  });
});
