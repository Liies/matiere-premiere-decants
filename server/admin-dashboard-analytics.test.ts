import { describe, expect, it } from "vitest";
import { getOrderStatusSlices, getRevenueSeries } from "../shared/admin-dashboard-analytics";

describe("admin dashboard analytics", () => {
  it("calcule les sept derniers jours de chiffre d’affaires en excluant les commandes non réglées", () => {
    const series = getRevenueSeries([
      { status: "paid", totalAmount: 12000, createdAt: "2026-08-17T10:00:00.000Z" },
      { status: "shipped", totalAmount: 9000, createdAt: "2026-08-16T10:00:00.000Z" },
      { status: "awaiting_payment", totalAmount: 12000, createdAt: "2026-08-17T11:00:00.000Z" },
    ], new Date("2026-08-17T12:00:00.000Z"));

    expect(series).toHaveLength(7);
    expect(series.at(-1)).toMatchObject({ dayKey: "2026-08-17", totalCents: 12000 });
    expect(series.at(-2)).toMatchObject({ dayKey: "2026-08-16", totalCents: 9000 });
  });

  it("regroupe les statuts réellement présents sans afficher de catégories vides", () => {
    expect(getOrderStatusSlices([
      { status: "processing", totalAmount: 12000, createdAt: "2026-08-17T10:00:00.000Z" },
      { status: "processing", totalAmount: 12000, createdAt: "2026-08-17T11:00:00.000Z" },
      { status: "cancelled", totalAmount: 12000, createdAt: "2026-08-17T12:00:00.000Z" },
    ])).toEqual([
      { status: "processing", count: 2 },
      { status: "cancelled", count: 1 },
    ]);
  });
});
