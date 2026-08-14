import { describe, expect, it } from "vitest";
import { sendOrderConfirmationEmail, sendShippingNotificationEmail } from "./emailService";

describe("Transactional email templates", () => {
  it("renders and sends order confirmation email successfully", async () => {
    const success = await sendOrderConfirmationEmail({
      orderNumber: "MP-TEST-101",
      customerName: "Liès Haouas",
      customerEmail: "lies.haouas@gmail.com",
      totalAmountCents: 12495,
      shippingCostCents: 495,
      shippingAddress: "27 rue du Maroc",
      shippingCity: "Paris",
      shippingPostalCode: "75019",
      shippingCountry: "France",
      carrier: "Colissimo",
      status: "paid",
      items: [
        {
          productName: "Radical Rose",
          sizeMl: 50,
          quantity: 1,
          unitPriceCents: 12000,
        }
      ]
    });
    expect(success).toBe(true);
  });

  it("renders and sends shipping notification email with tracking", async () => {
    const success = await sendShippingNotificationEmail({
      orderNumber: "MP-TEST-101",
      customerName: "Liès Haouas",
      customerEmail: "lies.haouas@gmail.com",
      totalAmountCents: 12495,
      shippingCostCents: 495,
      shippingAddress: "27 rue du Maroc",
      shippingCity: "Paris",
      shippingPostalCode: "75019",
      shippingCountry: "France",
      carrier: "Colissimo",
      trackingNumber: "8R12345678901",
      status: "shipped",
      items: [
        {
          productName: "Radical Rose",
          sizeMl: 50,
          quantity: 1,
          unitPriceCents: 12000,
        }
      ]
    });
    expect(success).toBe(true);
  });
});
