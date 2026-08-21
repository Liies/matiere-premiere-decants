import type { RevenuePoint } from "@shared/admin-dashboard-analytics";

type AdminRevenueChartProps = {
  series: RevenuePoint[];
};

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function AdminRevenueChart({ series }: AdminRevenueChartProps) {
  const maximum = Math.max(...series.map((point) => point.totalCents), 1);
  const width = 560;
  const height = 188;
  const paddingX = 20;
  const paddingY = 22;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const points = series.map((point, index) => {
    const x = series.length === 1 ? width / 2 : paddingX + (usableWidth * index) / (series.length - 1);
    const y = paddingY + usableHeight - (point.totalCents / maximum) * usableHeight;
    return { ...point, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const totalCents = series.reduce((sum, point) => sum + point.totalCents, 0);

  return (
    <figure data-testid="admin-revenue-chart" className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <figcaption>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Tendance</p>
          <h3 className="mt-2 text-xl font-light text-gray-900">Encaissements des 7 derniers jours</h3>
        </figcaption>
        <p className="text-right text-sm text-gray-600"><span className="block text-lg font-light text-gray-900">{euro.format(totalCents / 100)}</span>encaissé</p>
      </div>
      <div className="mt-6" role="img" aria-label={`Chiffre d’affaires encaissé sur les sept derniers jours : ${euro.format(totalCents / 100)}`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = paddingY + usableHeight * ratio;
            return <line key={ratio} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#e7e5e4" strokeDasharray="4 6" />;
          })}
          <polyline points={polyline} fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => <circle key={point.dayKey} cx={point.x} cy={point.y} r="4" fill="#292524" />)}
        </svg>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
          {series.map((point) => <span key={point.dayKey}>{point.label}</span>)}
        </div>
      </div>
    </figure>
  );
}
