export type StripeMode = "test" | "live";

export type StripeRuntimeConfig = {
  secretKey: string;
  mode: StripeMode;
};

export function getStripeRuntimeConfig(): StripeRuntimeConfig {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const match = secretKey?.match(/^(?:sk|rk)_(test|live)_/);

  if (!secretKey || !match) {
    throw new Error("La clé Stripe doit être une clé serveur de test ou de production valide");
  }

  return { secretKey, mode: match[1] as StripeMode };
}

export function getStripeWebhookSecret(): string {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret?.startsWith("whsec_")) {
    throw new Error("Le secret de signature du webhook Stripe est absent ou invalide");
  }
  return webhookSecret;
}
