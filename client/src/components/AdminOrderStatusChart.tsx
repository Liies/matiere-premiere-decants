import type { DashboardOrderStatus, OrderStatusSlice } from "@shared/admin-dashboard-analytics";

type AdminOrderStatusChartProps = {
  slices: OrderStatusSlice[];
  labels: Record<DashboardOrderStatus, string>;
};

const barTone: Record<DashboardOrderStatus, string> = {
  awaiting_payment: "bg-amber-500",
  pending: "bg-amber-500",
  paid: "bg-emerald-600",
  processing: "bg-sky-600",
  shipped: "bg-violet-600",
  delivered: "bg-stone-500",
  cancelled: "bg-rose-600",
};

export function AdminOrderStatusChart({ slices, labels }: AdminOrderStatusChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <section data-testid="admin-order-status-chart" aria-labelledby="admin-order-status-chart-title" className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Répartition</p>
      <h3 id="admin-order-status-chart-title" className="mt-2 text-xl font-light text-gray-900">Statut des commandes</h3>
      {total === 0 ? (
        <p className="mt-6 text-sm text-gray-600">Aucune commande à répartir pour le moment.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {slices.map((slice) => {
            const percentage = Math.round((slice.count / total) * 100);
            return (
              <div key={slice.status}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-700">{labels[slice.status]}</span>
                  <span className="font-medium text-gray-900">{slice.count} · {percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className={`h-full rounded-full ${barTone[slice.status]}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
