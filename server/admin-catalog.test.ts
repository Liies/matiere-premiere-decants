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

// These are database-backed integration tests. They run in CI/deployment when DATABASE_URL is provided.
describe.skipIf(!process.env.DATABASE_URL)("adminCatalog", () => {
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

  it("rejette des notes olfactives trop longues avant toute écriture", async () => {
    await expect(
      createCaller("admin").adminCatalog.update({
        id: 1,
        name: "Vanilla Powder",
        description: "Une description administrable suffisamment détaillée.",
        topNotes: "a".repeat(1_001),
        heartNotes: "Musc blanc",
        baseNotes: "Bois ambrés",
        price: 12_000,
        volumeMl: 50,
      }),
    ).rejects.toThrow();
  });

  it("refuse la modification de stock à un utilisateur non administrateur", async () => {
    await expect(
      createCaller("user").adminInventory.updateStock({ variantId: 1, stock: 5 }),
    ).rejects.toThrow("Accès refusé");
  });

  it("réserve les alertes de stock aux administrateurs", async () => {
    await expect(createCaller(null).adminInventory.lowStock()).rejects.toThrow();
    await expect(createCaller("user").adminInventory.lowStock()).rejects.toThrow("Accès refusé");
    await expect(createCaller("admin").adminInventory.lowStock()).resolves.toEqual(expect.any(Array));
  });

  it("rejette un stock négatif avant toute écriture", async () => {
    await expect(
      createCaller("admin").adminInventory.updateStock({ variantId: 1, stock: -1 }),
    ).rejects.toThrow();
  });

  it("autorise un administrateur à confirmer le stock courant d’une variante", async () => {
    const variants = await createCaller("admin").adminInventory.variants({ productId: 1 });
    expect(variants.length).toBeGreaterThan(0);

    const variant = variants[0]!;
    await expect(
      createCaller("admin").adminInventory.updateStock({ variantId: variant.id, stock: variant.stock }),
    ).resolves.toEqual({ success: true, delta: 0 });
  });
});
