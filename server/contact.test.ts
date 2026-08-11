import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { notifyOwnerMock } = vi.hoisted(() => ({
  notifyOwnerMock: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: notifyOwnerMock,
}));

import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("refuse les messages trop courts avant toute notification", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submit({
        name: "A",
        email: "client@example.com",
        subject: "produit",
        message: "Court",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(notifyOwnerMock).not.toHaveBeenCalled();
  });

  it("transmet un message valide au propriétaire", async () => {
    notifyOwnerMock.mockResolvedValueOnce(true);
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submit({
      name: "Camille Martin",
      email: "camille@example.com",
      subject: "livraison",
      message: "Bonjour, pouvez-vous préciser les délais de livraison ?",
    });

    expect(result).toEqual({ success: true });
    expect(notifyOwnerMock).toHaveBeenCalledWith({
      title: "Nouveau message de contact — Livraison et retours",
      content: [
        "Nom : Camille Martin",
        "Email : camille@example.com",
        "Sujet : Livraison et retours",
        "",
        "Bonjour, pouvez-vous préciser les délais de livraison ?",
      ].join("\n"),
    });
  });

  it("retourne une erreur si le service de notification est indisponible", async () => {
    notifyOwnerMock.mockResolvedValueOnce(false);
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submit({
        name: "Camille Martin",
        email: "camille@example.com",
        subject: "autre",
        message: "Je souhaite obtenir davantage d'informations.",
      }),
    ).rejects.toThrow("Le message n’a pas pu être transmis");
  });
});
