import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

function createCaller(role: "user" | "admin" | null) {
  return appRouter.createCaller({
    user: role
      ? {
          id: role === "admin" ? 9001 : 9002,
          openId: `catalog-${role}`,
          email: `${role}@example.com`,
          name: role,
          loginMethod: "test",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: {} as any,
    res: {} as any,
  });
}

describe("adminCatalog", () => {
  it("refuse la lecture du catalogue à un visiteur non authentifié", async () => {
    await expect(createCaller(null).adminCatalog.list()).rejects.toThrow();
  });

  it("refuse la lecture du catalogue à un utilisateur non administrateur", async () => {
    await expect(createCaller("user").adminCatalog.list()).rejects.toThrow("Accès refusé");
  });

  it("retourne le catalogue avec la contenance pour un administrateur", async () => {
    const products = await createCaller("admin").adminCatalog.list();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("volumeMl");
  });

  it("rejette une mise à jour avec un prix invalide avant toute écriture", async () => {
    await expect(
      createCaller("admin").adminCatalog.update({
        id: 1,
        name: "Vanilla Powder",
        description: "Une description administrable suffisamment détaillée.",
        price: 0,
        volumeMl: 50,
      }),
    ).rejects.toThrow();
  });
});
