import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getProductById: vi.fn(),
  setProductArchived: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getProductById: mocks.getProductById,
  setProductArchived: mocks.setProductArchived,
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
    mocks.setProductArchived.mockResolvedValue(undefined);
  });

  it("archive un parfum pour un administrateur sans suppression physique", async () => {
    await expect(createCaller("admin").adminCatalog.archive({ id: 42 })).resolves.toEqual({ success: true });
    expect(mocks.setProductArchived).toHaveBeenCalledWith(42, true);
  });

  it("restaure un parfum archivé pour un administrateur", async () => {
    await expect(createCaller("admin").adminCatalog.restore({ id: 42 })).resolves.toEqual({ success: true });
    expect(mocks.setProductArchived).toHaveBeenCalledWith(42, false);
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
});
