import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createOrderConfirmationEmail,
  createOrderStatusEmail,
  createOwnerOrderEmail,
  sendOrderCreatedEmails,
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
});
