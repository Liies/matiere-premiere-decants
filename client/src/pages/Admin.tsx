import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Leaf } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

type OrderStatusType = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: orders, isLoading, refetch } = trpc.orders.getAllOrders.useQuery();
  const updateStatus = trpc.orders.updateStatus.useMutation();
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string | undefined>>({});

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-gray-200">
          <div className="container flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
              <Leaf className="w-6 h-6 text-gray-900" />
              <h1 className="text-2xl font-light tracking-wider text-gray-900">
                Matière Première
              </h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Accès administrateur requis</p>
            <Link href="/">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatus.mutate(
      { orderId, status: status as OrderStatusType },
      {
        onSuccess: () => {
          refetch();
          toast.success("Statut mis à jour");
          setSelectedStatus(prev => ({ ...prev, [orderId]: undefined }));
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de la mise à jour");
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Payée", color: "bg-blue-100 text-blue-800" },
      processing: { label: "En traitement", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Expédiée", color: "bg-green-100 text-green-800" },
      delivered: { label: "Livrée", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
    };
    const info = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.color}`}>{info.label}</span>;
  };

  const statuses: OrderStatusType[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Leaf className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-light tracking-wider text-gray-900">
              Matière Première
            </h1>
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Catalogue
            </Link>
            <Link href="/account" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Mon Compte
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-light text-gray-900 mb-8">Gestion des Commandes</h2>

          {isLoading ? (
            <p className="text-gray-600">Chargement des commandes...</p>
          ) : !orders || orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Aucune commande pour le moment</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Numéro</p>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Client</p>
                      <p className="text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-600">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Montant</p>
                      <p className="text-lg font-light text-gray-900">
                        €{(order.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Articles:</p>
                    <ul className="space-y-1 text-sm">
                      {order.items?.map((item) => (
                        <li key={item.id} className="text-gray-900">
                          {item.productName} x {item.quantity} - €{((item.unitPrice * item.quantity) / 100).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Adresse de livraison:</p>
                    <p className="text-sm text-gray-900">
                      {order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Statut:</span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedStatus[order.id] ?? order.status}
                        onChange={(e) => setSelectedStatus(prev => ({ ...prev, [order.id]: e.target.value }))}
                        className="px-3 py-1 border border-gray-200 rounded text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={() => handleStatusChange(order.id, selectedStatus[order.id] || order.status)}
                        disabled={updateStatus.isPending || (selectedStatus[order.id] || order.status) === order.status}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
                        size="sm"
                      >
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 mt-12">
        <div className="container text-center text-sm text-gray-600">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
