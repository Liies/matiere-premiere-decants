import DashboardLayout from "@/components/DashboardLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminOrderStatusChart } from "@/components/AdminOrderStatusChart";
import { AdminRevenueChart } from "@/components/AdminRevenueChart";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getOrderStatusSlices, getRevenueSeries, type DashboardOrderStatus } from "@shared/admin-dashboard-analytics";
import { AlertTriangle, ArchiveRestore, ArrowUpRight, CheckCircle2, CircleDollarSign, ClipboardList, PackageCheck, ReceiptText, RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";

type OrderStatusType = "awaiting_payment" | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
type OrderFilter = "all" | "to_fulfill" | "payment_pending" | "shipping";
type AdminTab = "overview" | "orders" | "catalog" | "trust";

const statuses: OrderStatusType[] = ["awaiting_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];
const statusLabels: Record<OrderStatusType, string> = {
  awaiting_payment: "Paiement en attente",
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const paidStatuses = new Set<OrderStatusType>(["paid", "processing", "shipped", "delivered"]);
const fulfillmentStatuses = new Set<OrderStatusType>(["paid", "processing"]);
const paymentPendingStatuses = new Set<OrderStatusType>(["awaiting_payment", "pending"]);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ARCHIVE_PAGE_SIZE = 6;
const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const statusTone: Record<OrderStatusType, string> = {
  awaiting_payment: "border-amber-200 bg-amber-50 text-amber-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  processing: "border-sky-200 bg-sky-50 text-sky-800",
  shipped: "border-violet-200 bg-violet-50 text-violet-800",
  delivered: "border-stone-200 bg-stone-50 text-stone-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};
const adminTabs: Array<{ id: AdminTab; label: string; description: string }> = [
  { id: "overview", label: "Vue d’ensemble", description: "Les priorités et tendances essentielles" },
  { id: "orders", label: "Commandes", description: "Le suivi et les actions de préparation" },
  { id: "catalog", label: "Catalogue", description: "Les archives et la disponibilité produit" },
  { id: "trust", label: "Confiance client", description: "Les avis vérifiés à modérer" },
];

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading, refetch } = trpc.orders.getAllOrders.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: lowStock, isLoading: isLowStockLoading } = trpc.adminInventory.lowStock.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: pendingReviews } = trpc.reviews.pending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: archivedProducts, isLoading: isArchivedLoading } = trpc.adminCatalog.archived.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const trpcUtils = trpc.useUtils();
  const updateStatus = trpc.orders.updateStatus.useMutation();
  const restoreProduct = trpc.adminCatalog.restore.useMutation();
  const [selectedStatus, setSelectedStatus] = useState<Record<number, OrderStatusType | undefined>>({});
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [archivePage, setArchivePage] = useState(1);

  const archivePagination = useMemo(() => {
    const total = archivedProducts?.length ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / ARCHIVE_PAGE_SIZE));
    const currentPage = Math.min(archivePage, pageCount);
    const start = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
    const end = Math.min(start + ARCHIVE_PAGE_SIZE, total);

    return {
      currentPage,
      pageCount,
      total,
      start,
      end,
      products: (archivedProducts ?? []).slice(start, end),
    };
  }, [archivePage, archivedProducts]);

  const dashboard = useMemo(() => {
    const allOrders = orders ?? [];
    const periodStart = Date.now() - THIRTY_DAYS_MS;
    const paidRecentOrders = allOrders.filter((order) => (
      paidStatuses.has(order.status as OrderStatusType)
      && new Date(order.createdAt).getTime() >= periodStart
    ));
    const revenue = paidRecentOrders
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const averageBasket = paidRecentOrders.length > 0 ? revenue / paidRecentOrders.length : 0;
    const toFulfill = allOrders.filter((order) => fulfillmentStatuses.has(order.status as OrderStatusType));
    const paymentPending = allOrders.filter((order) => paymentPendingStatuses.has(order.status as OrderStatusType));
    const shipping = allOrders.filter((order) => order.status === "shipped");
    const filteredOrders = allOrders.filter((order) => {
      if (orderFilter === "to_fulfill") return fulfillmentStatuses.has(order.status as OrderStatusType);
      if (orderFilter === "payment_pending") return paymentPendingStatuses.has(order.status as OrderStatusType);
      if (orderFilter === "shipping") return order.status === "shipped";
      return true;
    });
    const chartOrders = allOrders.map((order) => ({
      status: order.status as DashboardOrderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    }));
    return {
      revenue,
      averageBasket,
      toFulfill,
      paymentPending,
      shipping,
      filteredOrders,
      revenueSeries: getRevenueSeries(chartOrders),
      orderStatusSlices: getOrderStatusSlices(chartOrders),
    };
  }, [orders, orderFilter]);

  const handleStatusChange = (orderId: number, status: OrderStatusType) => {
    updateStatus.mutate(
      { orderId, status },
      {
        onSuccess: () => {
          void refetch();
          toast.success("Statut mis à jour");
          setSelectedStatus((previous) => ({ ...previous, [orderId]: undefined }));
        },
        onError: (error) => toast.error(error.message || "Erreur lors de la mise à jour"),
      },
    );
  };

  const handleRestoreProduct = (productId: number, productName: string) => {
    restoreProduct.mutate(
      { id: productId },
      {
        onSuccess: () => {
          void trpcUtils.adminCatalog.archived.invalidate();
          void trpcUtils.adminCatalog.list.invalidate();
          void trpcUtils.catalog.list.invalidate();
          toast.success(`${productName} a été restauré dans le catalogue.`);
        },
        onError: (error) => toast.error(error.message || "Impossible de restaurer ce parfum."),
      },
    );
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <p className="mb-4 text-gray-600">Accès administrateur requis</p>
            <a href="/" className="inline-flex min-h-11 items-center bg-gray-900 px-4 text-sm text-white transition hover:bg-gray-800">
              Retour à la boutique
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <section data-testid="admin-dashboard" className="mx-auto w-full max-w-6xl space-y-8 px-1 py-4 sm:px-4 sm:py-8">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Administration</p>
            <h1 className="mt-2 text-3xl font-light text-gray-900 sm:text-4xl">Pilotage de la boutique</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Suivez l’encaissement, les commandes à préparer et les alertes de stock depuis un même espace.</p>
          </div>
          <a href="/admin/catalogue" className="inline-flex min-h-11 items-center justify-center gap-2 border border-gray-300 px-4 text-sm text-gray-700 transition hover:border-gray-900 hover:text-gray-900">
            Gérer le catalogue et le stock
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <nav aria-label="Sections du pilotage" className="border-b border-gray-200">
          <div role="tablist" aria-label="Sections du tableau de bord" className="flex gap-1 overflow-x-auto pb-px">
            {adminTabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`admin-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-11 shrink-0 border-b-2 px-3 text-sm transition sm:px-4 ${selected ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {isLoading ? (
          <p className="text-gray-600">Chargement des commandes…</p>
        ) : (
          <>
            {activeTab === "overview" && (
              <section id="admin-panel-overview" role="tabpanel" aria-labelledby="admin-tab-overview" className="space-y-6">
            <section aria-label="Indicateurs de la boutique" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <Card className="border-stone-200 bg-stone-50/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CircleDollarSign className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">30 jours</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Chiffre d’affaires encaissé</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{euro.format(dashboard.revenue / 100)}</p>
              </Card>
              <Card className="border-stone-200 bg-stone-50/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700"><ReceiptText className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">30 jours</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Panier moyen</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{euro.format(dashboard.averageBasket / 100)}</p>
              </Card>
              <Card className="border-amber-100 bg-amber-50/50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700"><PackageCheck className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-800">À agir</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">À préparer</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{dashboard.toFulfill.length}</p>
              </Card>
              <Card className="border-rose-100 bg-rose-50/50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-700"><ClipboardList className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-rose-800">À suivre</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Paiements à confirmer</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{dashboard.paymentPending.length}</p>
              </Card>
              <Card className="border-rose-100 bg-rose-50/50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-700"><AlertTriangle className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-rose-800">Vigilance</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Stock à surveiller</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{isLowStockLoading ? "…" : lowStock?.length ?? 0}</p>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <AdminRevenueChart series={dashboard.revenueSeries} />
              <AdminOrderStatusChart slices={dashboard.orderStatusSlices} labels={statusLabels} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
              <Card className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Priorités</p>
                    <h2 className="mt-2 text-xl font-light text-gray-900">Stock à surveiller</h2>
                  </div>
                  <a href="/admin/catalogue" className="text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900">Ajuster le stock</a>
                </div>
                {isLowStockLoading ? (
                  <p className="py-6 text-sm text-gray-600">Analyse du stock…</p>
                ) : !lowStock || lowStock.length === 0 ? (
                  <div className="flex gap-3 py-6 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    <p>Aucune variante active ne nécessite d’ajustement immédiat.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {lowStock.map((variant) => (
                      <li key={variant.id} className="flex items-center justify-between gap-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{variant.productName}</p>
                          <p className="mt-1 text-xs text-gray-500">{variant.sizeMl} ml</p>
                        </div>
                        <span className={`shrink-0 text-sm font-medium ${variant.stock === 0 ? "text-rose-700" : "text-amber-700"}`}>{variant.stock} unité{variant.stock === 1 ? "" : "s"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card data-testid="admin-priority-queue" className="border-stone-200 bg-stone-50/60 p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Priorités du jour</p>
                <h2 className="mt-2 text-xl font-light text-gray-900">À traiter maintenant</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">Chaque action ouvre la vue correspondante pour vous concentrer sur une seule priorité.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => { setOrderFilter("to_fulfill"); setActiveTab("orders"); }} className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white px-4 text-left transition hover:border-amber-400 hover:bg-amber-50">
                    <span><span className="block text-lg font-light text-gray-900">{dashboard.toFulfill.length}</span><span className="text-xs text-gray-600">à préparer</span></span><PackageCheck className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => { setOrderFilter("payment_pending"); setActiveTab("orders"); }} className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-rose-200 bg-white px-4 text-left transition hover:border-rose-400 hover:bg-rose-50">
                    <span><span className="block text-lg font-light text-gray-900">{dashboard.paymentPending.length}</span><span className="text-xs text-gray-600">paiement{dashboard.paymentPending.length === 1 ? "" : "s"} à confirmer</span></span><CircleDollarSign className="h-4 w-4 text-rose-700" aria-hidden="true" />
                  </button>
                  <a href="/admin/catalogue" className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-rose-200 bg-white px-4 text-left transition hover:border-rose-400 hover:bg-rose-50">
                    <span><span className="block text-lg font-light text-gray-900">{isLowStockLoading ? "…" : lowStock?.length ?? 0}</span><span className="text-xs text-gray-600">stock à surveiller</span></span><AlertTriangle className="h-4 w-4 text-rose-700" aria-hidden="true" />
                  </a>
                  <a href="/admin/catalogue" className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 text-left transition hover:border-gray-400 hover:bg-gray-50">
                    <span><span className="block text-lg font-light text-gray-900">{pendingReviews?.length ?? 0}</span><span className="text-xs text-gray-600">avis à modérer</span></span><ArrowUpRight className="h-4 w-4 text-gray-600" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </section>
              </section>
            )}

            {activeTab === "catalog" && (
            <section id="admin-panel-catalog" role="tabpanel" aria-labelledby="admin-tab-catalog" aria-describedby="admin-tab-catalog-description" className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Catalogue</p>
                <h2 className="mt-2 text-2xl font-light text-gray-900">Disponibilité et archives</h2>
                <p id="admin-tab-catalog-description" className="mt-2 max-w-2xl text-sm text-gray-600">Gardez le catalogue public concentré sur les références actives ; les parfums retirés restent restaurables à tout moment.</p>
              </div>
            <section aria-labelledby="admin-archives-title">
              <Card className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Catalogue</p>
                    <h2 id="admin-archives-title" className="mt-2 text-xl font-light text-gray-900">Produits archivés</h2>
                    <p className="mt-1 text-sm text-gray-600">Les références retirées restent conservées et peuvent être remises en ligne à tout moment.</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 text-sm text-gray-600">
                    <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                    {isArchivedLoading ? "…" : `${archivedProducts?.length ?? 0} archive${(archivedProducts?.length ?? 0) === 1 ? "" : "s"}`}
                  </span>
                </div>

                {isArchivedLoading ? (
                  <p className="py-6 text-sm text-gray-600">Chargement des archives…</p>
                ) : !archivedProducts || archivedProducts.length === 0 ? (
                  <div className="flex gap-3 py-6 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    <p>Aucun parfum n’est actuellement archivé.</p>
                  </div>
                ) : (
                  <>
                  <ul className="divide-y divide-gray-100">
                    {archivePagination.products.map((product) => (
                      <li key={product.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="mt-1 text-xs text-gray-500">{product.concentration === "extrait" ? "Extrait de Parfum" : "Eau de Parfum"} · Retiré du catalogue public</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={restoreProduct.isPending}
                          onClick={() => handleRestoreProduct(product.id, product.name)}
                          className="min-h-11 shrink-0 border-gray-300 text-gray-900 hover:border-gray-900"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                          Restaurer
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {archivePagination.pageCount > 1 && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-600" aria-live="polite">Affichage de {archivePagination.start + 1} à {archivePagination.end} sur {archivePagination.total} archives</p>
                      <nav aria-label="Pagination des produits archivés" className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={archivePagination.currentPage === 1}
                          onClick={() => setArchivePage((page) => Math.max(1, page - 1))}
                          className="min-h-11 border-gray-300 bg-white"
                        >
                          Précédent
                        </Button>
                        <span className="min-w-20 text-center text-sm text-gray-600">Page {archivePagination.currentPage} sur {archivePagination.pageCount}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={archivePagination.currentPage === archivePagination.pageCount}
                          onClick={() => setArchivePage((page) => Math.min(archivePagination.pageCount, page + 1))}
                          className="min-h-11 border-gray-300 bg-white"
                        >
                          Suivant
                        </Button>
                      </nav>
                    </div>
                  )}
                  </>
                )}
              </Card>
            </section>
            </section>
            )}

            {activeTab === "orders" && (
            <section id="admin-panel-orders" role="tabpanel" aria-labelledby="admin-tab-orders" className="space-y-4">
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Commandes</p>
                  <h2 id="admin-orders-title" className="mt-2 text-2xl font-light text-gray-900">Suivi des commandes</h2>
                </div>
                  <div className="flex flex-wrap gap-2" aria-label="Filtrer les commandes">
                  {([
                    ["all", "Toutes"],
                    ["to_fulfill", "À préparer"],
                    ["payment_pending", "Paiements en attente"],
                    ["shipping", "Expédiées"],
                  ] as const).map(([filter, label]) => (
                    <Button key={filter} type="button" size="sm" variant={orderFilter === filter ? "default" : "outline"} aria-pressed={orderFilter === filter} onClick={() => setOrderFilter(filter)} className={orderFilter === filter ? "bg-gray-900 text-white hover:bg-gray-800" : "border-gray-300 bg-white"}>{label}</Button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600" aria-live="polite">{dashboard.filteredOrders.length} commande{dashboard.filteredOrders.length === 1 ? "" : "s"} affichée{dashboard.filteredOrders.length === 1 ? "" : "s"} dans cette vue.</p>

              {dashboard.filteredOrders.length === 0 ? (
                <Card className="p-8 text-center text-gray-600">Aucune commande dans cette vue.</Card>
              ) : (
                <div className="space-y-4">
                  {dashboard.filteredOrders.map((order) => {
              const currentStatus = selectedStatus[order.id] ?? order.status;
              return (
                <Card key={order.id} className="p-5 sm:p-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Numéro</p>
                      <p className="mt-1 font-medium text-gray-900">{order.orderNumber}</p>
                      <span data-testid={`order-status-${order.orderNumber}`} className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone[order.status as OrderStatusType]}`}>{statusLabels[order.status as OrderStatusType]}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Client</p>
                      <p className="mt-1 text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-600">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Montant</p>
                      <p className="mt-1 text-lg font-light text-gray-900">{euro.format(order.totalAmount / 100)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Date</p>
                      <p className="mt-1 text-gray-900">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4 text-sm text-gray-700">
                    <p className="mb-2 font-medium">Articles</p>
                    <ul className="space-y-1">
                      {order.items?.map((item) => (
                        <li key={item.id}>{item.productName} × {item.quantity} — €{((item.unitPrice * item.quantity) / 100).toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">{order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}</p>
                    <div className="flex gap-2">
                      <select
                        aria-label={`Statut de la commande ${order.orderNumber}`}
                        value={currentStatus}
                        onChange={(event) => setSelectedStatus((previous) => ({ ...previous, [order.id]: event.target.value as OrderStatusType }))}
                        className="min-h-11 rounded border border-gray-200 bg-white px-3 text-sm"
                      >
                        {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        disabled={updateStatus.isPending || currentStatus === order.status}
                        onClick={() => handleStatusChange(order.id, currentStatus)}
                        className="min-h-11 bg-gray-900 text-white hover:bg-gray-800"
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </Card>
              );
                  })}
                </div>
              )}
            </section>
            )}

            {activeTab === "trust" && (
              <section id="admin-panel-trust" role="tabpanel" aria-labelledby="admin-tab-trust" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)]">
                <Card className="border-stone-200 bg-stone-50/60 p-6 sm:p-8">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Confiance client</p>
                  <h2 className="mt-2 text-2xl font-light text-gray-900">Avis vérifiés à modérer</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">Seuls les avis issus d’une commande confirmée sont proposés. La modération reste séparée du flux de commandes pour éviter les erreurs d’attention.</p>
                  <a href="/admin/catalogue" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-gray-900 bg-gray-900 px-4 text-sm text-white transition hover:bg-gray-800">
                    Ouvrir la modération
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Card>
                <Card className="p-6 sm:p-8">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">En attente</p>
                  <p className="mt-4 text-4xl font-light text-gray-900">{pendingReviews?.length ?? 0}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">avis à examiner avant publication.</p>
                </Card>
              </section>
            )}
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
