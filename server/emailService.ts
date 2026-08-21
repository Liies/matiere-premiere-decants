export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmountCents: number;
  shippingCostCents: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  carrier?: string;
  trackingNumber?: string;
  status: string;
  items: Array<{
    productName: string;
    sizeMl: number;
    quantity: number;
    unitPriceCents: number;
  }>;
}

const COMPANY_INFO = {
  name: "Liès HAOUAS EI",
  address: "27 rue du Maroc, 75019 Paris",
  email: "lies.haouas@gmail.com",
};

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const subject = `Confirmation de votre commande #${data.orderNumber} - Matière Première`;
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName} (${item.sizeMl} ml)</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.unitPriceCents * item.quantity)}</td>
    </tr>
  `).join("");

  const subtotal = data.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #111; background: #fff; padding: 24px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Matière Première</h1>
        <p style="font-size: 12px; color: #666; margin-top: 4px;">Décants de Luxe 50ml</p>
      </div>
      
      <p style="font-size: 16px;">Bonjour <strong>${data.customerName}</strong>,</p>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Nous vous remercions pour votre commande. Vos décants sont préparés avec le plus grand soin dans notre atelier.</p>
      
      <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Détails de la commande #${data.orderNumber}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; color: #666;">Sous-total</td>
            <td style="padding: 10px; text-align: right; color: #666;">${formatPrice(subtotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; color: #666;">Livraison (${data.carrier || 'Colissimo'})</td>
            <td style="padding: 10px; text-align: right; color: #666;">${data.shippingCostCents === 0 ? 'Offerte' : formatPrice(data.shippingCostCents)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: bold; border-top: 2px solid #111;">Total payé</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: bold; border-top: 2px solid #111;">${formatPrice(data.totalAmountCents)}</td>
          </tr>
        </table>
      </div>

      <div style="font-size: 14px; color: #4b5563; margin-bottom: 24px;">
        <p style="font-weight: 600; margin-bottom: 4px;">Adresse de livraison :</p>
        <p style="margin: 0;">${data.shippingAddress}</p>
        <p style="margin: 0;">${data.shippingPostalCode} ${data.shippingCity}, ${data.shippingCountry}</p>
      </div>

      <div style="border-top: 1px solid #eaeaea; padding-top: 16px; font-size: 12px; color: #9ca3af; text-align: center;">
        <p style="margin: 0;">${COMPANY_INFO.name} — ${COMPANY_INFO.address}</p>
        <p style="margin: 4px 0 0 0;">Contact : <a href="mailto:${COMPANY_INFO.email}" style="color: #6b7280;">${COMPANY_INFO.email}</a></p>
      </div>
    </div>
  `;

  return sendEmailViaResend(data.customerEmail, subject, html);
}

export async function sendShippingNotificationEmail(data: OrderEmailData): Promise<boolean> {
  const trackingText = data.trackingNumber ? `Numéro de suivi : ${data.trackingNumber}` : "";
  const trackingLink = data.trackingNumber ? `<p style="margin: 16px 0;"><a href="https://www.laposte.fr/outils/suivre-vos-envois?code=${data.trackingNumber}" style="background: #111; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 14px;">Suivre mon colis (${data.carrier || 'Colissimo'})</a></p>` : "";
  
  const subject = `Votre commande #${data.orderNumber} a été expédiée - Matière Première`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #111; background: #fff; padding: 24px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 20px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Matière Première</h1>
        <p style="font-size: 12px; color: #666; margin-top: 4px;">Expédition de votre colis</p>
      </div>
      
      <p style="font-size: 16px;">Bonjour <strong>${data.customerName}</strong>,</p>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Bonne nouvelle ! Votre commande <strong>#${data.orderNumber}</strong> vient d'être confiée à notre transporteur (${data.carrier || 'Colissimo'}).</p>
      
      ${trackingLink}
      ${trackingText ? `<p style="font-size: 14px; color: #374151;"><code>${trackingText}</code></p>` : ""}

      <div style="font-size: 14px; color: #4b5563; margin-top: 24px; margin-bottom: 24px;">
        <p style="font-weight: 600; margin-bottom: 4px;">Livraison prévue à l'adresse :</p>
        <p style="margin: 0;">${data.shippingAddress}, ${data.shippingPostalCode} ${data.shippingCity}, ${data.shippingCountry}</p>
      </div>

      <div style="border-top: 1px solid #eaeaea; padding-top: 16px; font-size: 12px; color: #9ca3af; text-align: center;">
        <p style="margin: 0;">${COMPANY_INFO.name} — ${COMPANY_INFO.address}</p>
      </div>
    </div>
  `;

  return sendEmailViaResend(data.customerEmail, subject, html);
}

export async function sendOwnerNewOrderNotification(data: OrderEmailData): Promise<boolean> {
  const subject = `[Admin] Nouvelle commande #${data.orderNumber} (${(data.totalAmountCents/100).toFixed(2)} €)`;
  const html = `
    <div style="font-family: monospace; font-size: 14px; padding: 16px;">
      <h2>Nouvelle commande reçue</h2>
      <p>Numéro : <strong>${data.orderNumber}</strong></p>
      <p>Client : ${data.customerName} (${data.customerEmail})</p>
      <p>Montant total : ${(data.totalAmountCents/100).toFixed(2)} € (dont port : ${(data.shippingCostCents/100).toFixed(2)} €)</p>
      <p>Adresse : ${data.shippingAddress}, ${data.shippingPostalCode} ${data.shippingCity}, ${data.shippingCountry}</p>
    </div>
  `;

  return sendEmailViaResend(COMPANY_INFO.email, subject, html);
}

async function sendEmailViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const mode = process.env.EMAIL_DELIVERY_MODE || "mock";
  const apiKey = process.env.RESEND_API_KEY;

  if (mode === "mock" || !apiKey) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Matière Première <noreply@${process.env.VITE_APP_ID || 'manus.space'}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Email] Resend API error:", errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Failed to send email via Resend:", error);
    return false;
  }
}
