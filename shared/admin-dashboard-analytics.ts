export type DashboardOrderStatus =
  | "awaiting_payment"
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type DashboardOrder = {
  status: DashboardOrderStatus;
  totalAmount: number;
  createdAt: Date | string;
};

export type RevenuePoint = {
  dayKey: string;
  label: string;
  totalCents: number;
};

export type OrderStatusSlice = {
  status: DashboardOrderStatus;
  count: number;
};

export const PAID_DASHBOARD_STATUSES = new Set<DashboardOrderStatus>([
  "paid",
  "processing",
  "shipped",
  "delivered",
]);

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dayKey(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}

export function getRevenueSeries(
  orders: DashboardOrder[],
  now: Date = new Date(),
  dayCount: number = 7,
): RevenuePoint[] {
  const start = startOfUtcDay(now);
  const totals = new Map<string, number>();

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const day = new Date(start.getTime() - offset * DAY_MS);
    totals.set(dayKey(day), 0);
  }

  for (const order of orders) {
    if (!PAID_DASHBOARD_STATUSES.has(order.status)) continue;
    const createdAt = new Date(order.createdAt);
    const key = dayKey(createdAt);
    if (totals.has(key)) {
      totals.set(key, (totals.get(key) ?? 0) + order.totalAmount);
    }
  }

  return Array.from(totals.entries()).map(([key, totalCents]) => {
    const day = new Date(`${key}T00:00:00.000Z`);
    return {
      dayKey: key,
      label: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(day).replace(".", ""),
      totalCents,
    };
  });
}

export function getOrderStatusSlices(orders: DashboardOrder[]): OrderStatusSlice[] {
  const statuses: DashboardOrderStatus[] = ["processing", "paid", "awaiting_payment", "pending", "shipped", "delivered", "cancelled"];
  return statuses
    .map((status) => ({ status, count: orders.filter((order) => order.status === status).length }))
    .filter((slice) => slice.count > 0);
}
