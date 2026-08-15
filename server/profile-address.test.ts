import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSavedDeliveryAddress: vi.fn(),
  saveDeliveryAddress: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  getSavedDeliveryAddress: mocks.getSavedDeliveryAddress,
  saveDeliveryAddress: mocks.saveDeliveryAddress,
}));

import { appRouter } from "./routers";

const customer = {
  id: 91,
  openId: "profile-address-customer",
  email: "camille@example.com",
  name: "Camille Martin",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("profil — adresse de livraison", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveDeliveryAddress.mockResolvedValue(undefined);
  });

  it("retourne l’adresse enregistrée du client connecté", async () => {
    mocks.getSavedDeliveryAddress.mockResolvedValue({ address: "27 Rue du Maroc", city: "Paris", postalCode: "75019", country: "France" });
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.profile.getDeliveryAddress()).resolves.toMatchObject({ city: "Paris", postalCode: "75019" });
    expect(mocks.getSavedDeliveryAddress).toHaveBeenCalledWith(customer.id);
  });

  it("retourne null sans adresse enregistrée afin de préserver le contrat tRPC", async () => {
    mocks.getSavedDeliveryAddress.mockResolvedValue(undefined);
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.profile.getDeliveryAddress()).resolves.toBeNull();
  });

  it("sauvegarde une adresse européenne éligible", async () => {
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.profile.saveDeliveryAddress({
      address: "5 Rue de la Loi",
      city: "Bruxelles",
      postalCode: "1000",
      country: "Belgique",
    })).resolves.toEqual({ success: true });
    expect(mocks.saveDeliveryAddress).toHaveBeenCalledWith(customer.id, expect.objectContaining({ country: "Belgique" }));
  });

  it("refuse une adresse hors zone avant tout enregistrement", async () => {
    const caller = appRouter.createCaller({ user: customer, req: {} as any, res: {} as any });

    await expect(caller.profile.saveDeliveryAddress({
      address: "1 Market Street",
      city: "San Francisco",
      postalCode: "94105",
      country: "États-Unis",
    })).rejects.toThrow("France métropolitaine et en Europe");
    expect(mocks.saveDeliveryAddress).not.toHaveBeenCalled();
  });
});
