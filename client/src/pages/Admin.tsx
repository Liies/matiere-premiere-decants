import DashboardLayout from "@/components/DashboardLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

type OrderStatusType = "awaiting_payment" | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

const statuses: OrderStatusType[] = ["awaiting_payment", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading, refetch } = trpc.orders.getAllOrders.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const updateStatus = trpc.orders.updateStatus.useMutation();
  const [selectedStatus, setSelectedStatus] = useState<Record<number, OrderStatusType | undefined>>({});

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
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Administration</p>
          <h1 className="mt-2 text-3xl font-light text-gray-900 sm:text-4xl">Gestion des commandes</h1>
          <p className="mt-2 text-sm text-gray-600">Suivez les commandes et mettez à jour leur état d’avancement.</p>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Chargement des commandes…</p>
        ) : !orders || orders.length === 0 ? (
          <Card className="p-8 text-center text-gray-600">Aucune commande pour le moment</Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
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
                      <p className="mt-1 text-lg font-light text-gray-900">€{(order.totalAmount / 100).toFixed(2)}</p>
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
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
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
    </DashboardLayout>
  );
}
