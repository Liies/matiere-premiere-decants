import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createVerifiedProductReview: vi.fn(),
  getPendingProductReviews: vi.fn(),
  getPublishedProductReviews: vi.fn(),
  getReviewEligibility: vi.fn(),
  moderateProductReview: vi.fn(),
}));

vi.mock("../db", () => mocks);

import { reviewsRouter } from "./reviewsRouter";

const customerContext = {
  user: { id: 8, role: "user" },
  req: {},
  res: {},
} as any;

const adminContext = {
  user: { id: 1, role: "admin" },
  req: {},
  res: {},
} as any;

describe("reviews router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("délègue la liste publique au stockage des seuls avis publiés", async () => {
    mocks.getPublishedProductReviews.mockResolvedValue([]);

    const result = await reviewsRouter.createCaller({ req: {}, res: {} } as any).listPublished({ productId: 12 });

    expect(mocks.getPublishedProductReviews).toHaveBeenCalledWith(12);
    expect(result).toEqual([]);
  });

  it("ne permet le dépôt qu’après l’éligibilité vérifiée côté serveur", async () => {
    mocks.getReviewEligibility.mockResolvedValue({ eligibleOrderId: 42, existingReview: null });
    mocks.createVerifiedProductReview.mockResolvedValue(9);

    const caller = reviewsRouter.createCaller(customerContext);
    const eligibility = await caller.eligibility({ productId: 12 });
    const result = await caller.create({ productId: 12, rating: 5, title: "Très belle découverte", body: "Une tenue élégante et une matière vraiment expressive." });

    expect(eligibility).toEqual({ canSubmit: true, existingStatus: null });
    expect(mocks.createVerifiedProductReview).toHaveBeenCalledWith(expect.objectContaining({ userId: 8, productId: 12, rating: 5 }));
    expect(result).toEqual({ id: 9, status: "pending" });
  });

  it("réserve la modération des avis aux administrateurs", async () => {
    const customer = reviewsRouter.createCaller(customerContext);
    await expect(customer.moderate({ id: 9, status: "published" })).rejects.toMatchObject({ code: "FORBIDDEN" });

    const admin = reviewsRouter.createCaller(adminContext);
    await admin.moderate({ id: 9, status: "published" });

    expect(mocks.moderateProductReview).toHaveBeenCalledWith(9, "published");
  });
});
