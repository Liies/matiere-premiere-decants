const REQUIRED_PRODUCTION_ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "VITE_APP_ID",
  "OAUTH_SERVER_URL",
  "BUILT_IN_FORGE_API_URL",
  "BUILT_IN_FORGE_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

/**
 * Returns the names of required production variables that are missing.
 * Values are intentionally never included in the result.
 */
export function getMissingProductionEnv(env: NodeJS.ProcessEnv = process.env): string[] {
  return REQUIRED_PRODUCTION_ENV_VARS.filter((name) => !env[name]?.trim());
}

export function getProductionReadiness(env: NodeJS.ProcessEnv = process.env) {
  const missing = getMissingProductionEnv(env);
  const emailDeliveryMode = env.EMAIL_DELIVERY_MODE === "resend" ? "resend" : "mock";

  const isProduction = env.NODE_ENV === "production";
  const emailReady = emailDeliveryMode === "resend"
    && Boolean(env.RESEND_API_KEY?.trim())
    && Boolean(env.EMAIL_FROM?.trim());

  return {
    ready: missing.length === 0 && (!isProduction || emailReady),
    missing,
    emailDeliveryMode,
    emailReady,
  };
}
