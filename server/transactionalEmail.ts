export type EmailDeliveryMode = "mock" | "resend";

export type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type OrderEmailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderEmailItem[];
};

const statusLabels: Record<string, string> = {
  pending: "en attente de confirmation",
  paid: "confirmée",
  processing: "en préparation",
  shipped: "expédiée",
  delivered: "livrée",
  cancelled: "annulée",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(amountInCents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amountInCents / 100);
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;background:#f7f6f3;color:#181817;font-family:Arial,sans-serif;">
  <main style="max-width:620px;margin:32px auto;background:#fff;padding:42px 34px;">
    <p style="margin:0 0 26px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6b6a65;">Matière Première</p>
    <h1 style="margin:0 0 18px;font-weight:400;font-size:28px;line-height:1.2;">${title}</h1>
    ${body}
    <hr style="border:0;border-top:1px solid #e5e3df;margin:32px 0 20px;" />
    <p style="margin:0;color:#77756f;font-size:12px;line-height:1.6;">Décants de parfums de niche · Matière Première</p>
  </main>
</body></html>`;
}

function renderItems(items: OrderEmailItem[]) {
  return `<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:24px 0;">
    ${items.map((item) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eceae5;">${escapeHtml(item.productName)} <span style="color:#77756f;">× ${item.quantity}</span></td><td align="right" style="padding:10px 0;border-bottom:1px solid #eceae5;">${formatPrice(item.unitPrice * item.quantity)}</td></tr>`).join("")}
  </table>`;
}

export function createOwnerOrderEmail(order: OrderEmailData, ownerEmail: string): TransactionalEmail {
  const subject = `Nouvelle commande ${order.orderNumber}`;
  return {
    to: ownerEmail,
    subject,
    html: layout("Une nouvelle commande vient d’être passée", `
      <p style="line-height:1.65;">${escapeHtml(order.customerName)} vient de passer la commande <strong>${escapeHtml(order.orderNumber)}</strong>.</p>
      ${renderItems(order.items)}
      <p style="font-size:18px;margin:0;"><strong>Total : ${formatPrice(order.totalAmount)}</strong></p>
      <p style="margin:22px 0 0;line-height:1.65;color:#5f5e58;">Client : ${escapeHtml(order.customerEmail)}</p>`),
    text: `${subject}\nClient : ${order.customerName} (${order.customerEmail})\nTotal : ${formatPrice(order.totalAmount)}`,
  };
}

export function createOrderConfirmationEmail(order: OrderEmailData): TransactionalEmail {
  const subject = `Confirmation de votre commande ${order.orderNumber}`;
  return {
    to: order.customerEmail,
    subject,
    html: layout("Merci pour votre commande", `
      <p style="line-height:1.65;">Bonjour ${escapeHtml(order.customerName)},</p>
      <p style="line-height:1.65;">Nous avons bien reçu votre commande <strong>${escapeHtml(order.orderNumber)}</strong>. Nous vous tiendrons informé(e) de son évolution.</p>
      ${renderItems(order.items)}
      <p style="font-size:18px;margin:0;"><strong>Total : ${formatPrice(order.totalAmount)}</strong></p>`),
    text: `Bonjour ${order.customerName},\nNous avons bien reçu votre commande ${order.orderNumber}. Total : ${formatPrice(order.totalAmount)}.`,
  };
}

export function createOrderStatusEmail({
  orderNumber,
  customerName,
  customerEmail,
  status,
}: Pick<OrderEmailData, "orderNumber" | "customerName" | "customerEmail"> & { status: string }): TransactionalEmail {
  const statusLabel = statusLabels[status] ?? status;
  const subject = `Commande ${orderNumber} : ${statusLabel}`;
  return {
    to: customerEmail,
    subject,
    html: layout("Votre commande évolue", `
      <p style="line-height:1.65;">Bonjour ${escapeHtml(customerName)},</p>
      <p style="line-height:1.65;">Votre commande <strong>${escapeHtml(orderNumber)}</strong> est désormais <strong>${escapeHtml(statusLabel)}</strong>.</p>
      <p style="margin:22px 0 0;line-height:1.65;color:#5f5e58;">Vous recevrez une nouvelle confirmation à chaque étape importante.</p>`),
    text: `Bonjour ${customerName}, votre commande ${orderNumber} est désormais ${statusLabel}.`,
  };
}

export function getEmailDeliveryMode(): EmailDeliveryMode {
  return process.env.EMAIL_DELIVERY_MODE === "resend" ? "resend" : "mock";
}

export async function sendTransactionalEmail(email: TransactionalEmail, mode = getEmailDeliveryMode()) {
  if (mode === "mock") {
    console.info("[Email mock]", { to: email.to, subject: email.subject });
    return { mode: "mock" as const, delivered: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("Resend requiert RESEND_API_KEY et EMAIL_FROM");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [email.to], subject: email.subject, html: email.html, text: email.text }),
  });

  if (!response.ok) {
    throw new Error(`Resend a refusé l’envoi (${response.status})`);
  }

  return { mode: "resend" as const, delivered: true };
}

export async function sendOrderCreatedEmails(order: OrderEmailData) {
  const ownerEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.EMAIL_FROM;
  const emails = [createOrderConfirmationEmail(order)];
  if (ownerEmail) emails.unshift(createOwnerOrderEmail(order, ownerEmail));

  return Promise.allSettled(emails.map((email) => sendTransactionalEmail(email)));
}

export async function sendOrderStatusEmail(order: Pick<OrderEmailData, "orderNumber" | "customerName" | "customerEmail"> & { status: string }) {
  return sendTransactionalEmail(createOrderStatusEmail(order));
}
