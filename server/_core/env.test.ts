import { describe, expect, it } from "vitest";
import { getMissingProductionEnv, getProductionReadiness } from "./env";

describe("production environment readiness", () => {
  it("liste les variables obligatoires absentes sans exposer leurs valeurs", () => {
    const missing = getMissingProductionEnv({});

    expect(missing).toEqual([
      "DATABASE_URL",
      "JWT_SECRET",
      "VITE_APP_ID",
      "OAUTH_SERVER_URL",
      "BUILT_IN_FORGE_API_URL",
      "BUILT_IN_FORGE_API_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ]);
    expect(missing.join(" ")).not.toContain("secret-value");
  });

  it("est prête lorsque les services obligatoires sont configurés", () => {
    const readiness = getProductionReadiness({
      DATABASE_URL: "mysql://database",
      JWT_SECRET: "secret-value",
      VITE_APP_ID: "app-id",
      OAUTH_SERVER_URL: "https://oauth.example",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "forge-key",
      STRIPE_SECRET_KEY: "sk_test_example",
      STRIPE_WEBHOOK_SECRET: "whsec_example",
      EMAIL_DELIVERY_MODE: "resend",
      RESEND_API_KEY: "resend-key",
      EMAIL_FROM: "orders@example.test",
    });

    expect(readiness).toEqual({
      ready: true,
      missing: [],
      emailDeliveryMode: "resend",
      emailReady: true,
    });
  });

  it("signale explicitement quand les emails restent en simulation", () => {
    const readiness = getProductionReadiness({
      DATABASE_URL: "mysql://database",
      JWT_SECRET: "secret-value",
      VITE_APP_ID: "app-id",
      OAUTH_SERVER_URL: "https://oauth.example",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "forge-key",
      STRIPE_SECRET_KEY: "sk_test_example",
      STRIPE_WEBHOOK_SECRET: "whsec_example",
      EMAIL_DELIVERY_MODE: "mock",
    });

    expect(readiness.ready).toBe(true);
    expect(readiness.emailDeliveryMode).toBe("mock");
    expect(readiness.emailReady).toBe(false);
  });

  it("bloque la readiness de production avec des emails simulés", () => {
    const readiness = getProductionReadiness({
      NODE_ENV: "production",
      DATABASE_URL: "mysql://database",
      JWT_SECRET: "secret-value",
      VITE_APP_ID: "app-id",
      OAUTH_SERVER_URL: "https://oauth.example",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "forge-key",
      STRIPE_SECRET_KEY: "sk_live_example",
      STRIPE_WEBHOOK_SECRET: "whsec_example",
      EMAIL_DELIVERY_MODE: "mock",
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.emailDeliveryMode).toBe("mock");
  });
});
