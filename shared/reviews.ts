export const REVIEW_ELIGIBLE_ORDER_STATUSES = ["paid", "processing", "shipped", "delivered"] as const;

export function isEligibleReviewOrderStatus(status: string) {
  return (REVIEW_ELIGIBLE_ORDER_STATUSES as readonly string[]).includes(status);
}
