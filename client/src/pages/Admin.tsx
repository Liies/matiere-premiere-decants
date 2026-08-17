import DashboardLayout from "@/components/DashboardLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertTriangle, ArrowUpRight, CheckCircle2, CircleDollarSign, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";

type OrderStatusType = "awaiting_payment" | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
type OrderFilter = "all" | "to_fulfill" | "shipping";

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
const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

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
  const updateStatus = trpc.orders.updateStatus.useMutation();
  const [selectedStatus, setSelectedStatus] = useState<Record<number, OrderStatusType | undefined>>({});
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");

  const dashboard = useMemo(() => {
    const allOrders = orders ?? [];
    const revenue = allOrders
      .filter((order) => paidStatuses.has(order.status as OrderStatusType))
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const toFulfill = allOrders.filter((order) => fulfillmentStatuses.has(order.status as OrderStatusType));
    const shipping = allOrders.filter((order) => order.status === "shipped");
    const filteredOrders = allOrders.filter((order) => {
      if (orderFilter === "to_fulfill") return fulfillmentStatuses.has(order.status as OrderStatusType);
      if (orderFilter === "shipping") return order.status === "shipped";
      return true;
    });
    return { revenue, toFulfill, shipping, filteredOrders };
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
      <section className="mx-auto w-full max-w-6xl space-y-8 px-1 py-4 sm:px-4 sm:py-8">
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

        {isLoading ? (
          <p className="text-gray-600">Chargement des commandes…</p>
        ) : (
          <>
            <section aria-label="Indicateurs de la boutique" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="p-5">
                <CircleDollarSign className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Chiffre d’affaires encaissé</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{euro.format(dashboard.revenue / 100)}</p>
                <p className="mt-1 text-xs text-gray-500">Commandes payées et livrées incluses</p>
              </Card>
              <Card className="p-5">
                <PackageCheck className="h-5 w-5 text-amber-700" aria-hidden="true" />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">À préparer</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{dashboard.toFulfill.length}</p>
                <p className="mt-1 text-xs text-gray-500">Commandes payées ou en préparation</p>
              </Card>
              <Card className="p-5">
                <Truck className="h-5 w-5 text-sky-700" aria-hidden="true" />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">En livraison</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{dashboard.shipping.length}</p>
                <p className="mt-1 text-xs text-gray-500">Commandes marquées expédiées</p>
              </Card>
              <Card className="p-5">
                <AlertTriangle className="h-5 w-5 text-rose-700" aria-hidden="true" />
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">Stock à surveiller</p>
                <p className="mt-2 text-2xl font-light text-gray-900">{isLowStockLoading ? "…" : lowStock?.length ?? 0}</p>
                <p className="mt-1 text-xs text-gray-500">Variantes actives à 3 unités ou moins</p>
              </Card>
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

              <Card className="p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Actions rapides</p>
                <h2 className="mt-2 text-xl font-light text-gray-900">À ne pas oublier</h2>
                <div className="mt-5 space-y-3">
                  <a href="/admin/catalogue" className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm text-gray-800 transition hover:text-gray-500">
                    <span>Mettre à jour le catalogue</span><ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a href="/admin/catalogue" className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm text-gray-800 transition hover:text-gray-500">
                    <span>{pendingReviews?.length ?? 0} avis à modérer</span><ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <button type="button" onClick={() => setOrderFilter("to_fulfill")} className="flex w-full items-center justify-between text-left text-sm text-gray-800 transition hover:text-gray-500">
                    <span>{dashboard.toFulfill.length} commande{dashboard.toFulfill.length === 1 ? "" : "s"} à préparer</span><ClipboardList className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            </section>

            <section aria-labelledby="admin-orders-title" className="space-y-4">
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Commandes</p>
                  <h2 id="admin-orders-title" className="mt-2 text-2xl font-light text-gray-900">Suivi des commandes</h2>
                </div>
                <div className="flex flex-wrap gap-2" aria-label="Filtrer les commandes">
                  {([
                    ["all", "Toutes"],
                    ["to_fulfill", "À préparer"],
                    ["shipping", "Expédiées"],
                  ] as const).map(([filter, label]) => (
                    <Button key={filter} type="button" size="sm" variant={orderFilter === filter ? "default" : "outline"} onClick={() => setOrderFilter(filter)} className={orderFilter === filter ? "bg-gray-900 text-white hover:bg-gray-800" : ""}>{label}</Button>
                  ))}
                </div>
              </div>

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
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
