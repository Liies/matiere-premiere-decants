import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getProductById: vi.fn(),
  getArchivedProducts: vi.fn(),
  setProductArchived: vi.fn(),
  deleteArchivedProduct: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getProductById: mocks.getProductById,
  getArchivedProducts: mocks.getArchivedProducts,
  setProductArchived: mocks.setProductArchived,
  deleteArchivedProduct: mocks.deleteArchivedProduct,
}));

import { appRouter } from "./routers";

function createCaller(role: "admin" | "user" | null) {
  return appRouter.createCaller({
    user: role ? {
      id: role === "admin" ? 501 : 502,
      openId: `archive-${role}`,
      email: `${role}@example.com`,
      name: role,
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : null,
    req: {} as any,
    res: {} as any,
  });
}

describe("adminCatalog — archivage réversible", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getProductById.mockResolvedValue({ id: 42, name: "Radical Rose" });
    mocks.getArchivedProducts.mockResolvedValue([{ id: 42, name: "Radical Rose", isArchived: true }]);
    mocks.setProductArchived.mockResolvedValue(undefined);
    mocks.deleteArchivedProduct.mockResolvedValue({ deleted: true });
  });

  it("archive un parfum pour un administrateur sans suppression physique", async () => {
    await expect(createCaller("admin").adminCatalog.archive({ id: 42 })).resolves.toEqual({ success: true });
    expect(mocks.setProductArchived).toHaveBeenCalledWith(42, true);
  });

  it("restaure un parfum archivé pour un administrateur", async () => {
    await expect(createCaller("admin").adminCatalog.restore({ id: 42 })).resolves.toEqual({ success: true });
    expect(mocks.setProductArchived).toHaveBeenCalledWith(42, false);
  });

  it("liste les archives pour un administrateur sans les exposer à un utilisateur standard", async () => {
    await expect(createCaller("admin").adminCatalog.archived()).resolves.toEqual([
      { id: 42, name: "Radical Rose", isArchived: true },
    ]);
    await expect(createCaller("user").adminCatalog.archived()).rejects.toThrow("Accès refusé");
  });

  it("refuse l’archivage à un utilisateur non administrateur", async () => {
    await expect(createCaller("user").adminCatalog.archive({ id: 42 })).rejects.toThrow("Accès refusé");
    expect(mocks.setProductArchived).not.toHaveBeenCalled();
  });

  it("signale un parfum introuvable avant tout archivage", async () => {
    mocks.getProductById.mockResolvedValue(undefined);
    await expect(createCaller("admin").adminCatalog.archive({ id: 999 })).rejects.toThrow("Parfum introuvable");
    expect(mocks.setProductArchived).not.toHaveBeenCalled();
  });

  it("supprime définitivement une archive sans dépendance pour un administrateur", async () => {
    await expect(createCaller("admin").adminCatalog.deletePermanently({ id: 42 })).resolves.toEqual({ success: true });
    expect(mocks.deleteArchivedProduct).toHaveBeenCalledWith(42);
  });

  it("bloque la suppression définitive lorsqu’une commande conserve l’historique du parfum", async () => {
    mocks.deleteArchivedProduct.mockResolvedValue({ deleted: false, reason: "orders" });

    await expect(createCaller("admin").adminCatalog.deletePermanently({ id: 42 })).rejects.toThrow("lié à des commandes");
  });

  it("refuse la suppression définitive à un utilisateur non administrateur", async () => {
    await expect(createCaller("user").adminCatalog.deletePermanently({ id: 42 })).rejects.toThrow("Accès refusé");
    expect(mocks.deleteArchivedProduct).not.toHaveBeenCalled();
  });
});
