import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link, useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: orders, isLoading } = trpc.orders.getMyOrders.useQuery();
  const { data: savedDeliveryAddress, isLoading: isSavedAddressLoading } = trpc.profile.getDeliveryAddress.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Veuillez vous connecter pour accéder à votre compte</p>
          </div>
        </main>
      </div>
    );
  }

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logout();
        toast.success("Déconnecté avec succès");
        setLocation("/");
      },
    });
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-light text-gray-900">Mon Compte</h2>
              <p className="text-gray-600 mt-2">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>

          <section className="mb-10">
            <h3 className="mb-4 text-2xl font-light text-gray-900">Adresse de livraison</h3>
            <Card className="p-5">
              {isSavedAddressLoading ? <p className="text-gray-600">Chargement de votre adresse…</p> : savedDeliveryAddress ? (
                <p className="text-gray-700">
                  <span className="mb-1 block font-medium text-gray-900">Adresse enregistrée</span>
                  {savedDeliveryAddress.address}<br />
                  {savedDeliveryAddress.postalCode} {savedDeliveryAddress.city}<br />
                  {savedDeliveryAddress.country}
                </p>
              ) : (
                <p className="text-gray-600">Aucune adresse enregistrée. Vous pourrez en sauvegarder une lors de votre prochaine commande.</p>
              )}
            </Card>
          </section>

          {/* Orders Section */}
          <div>
            <h3 className="text-2xl font-light text-gray-900 mb-6">Mes Commandes</h3>

            {isLoading ? (
              <p className="text-gray-600">Chargement des commandes...</p>
            ) : !orders || orders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">Vous n'avez pas encore de commandes</p>
                <Link href="/products">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                    Découvrir le catalogue
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-light text-gray-900">
                          Commande {order.orderNumber}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-lg font-light text-gray-900 mt-2">
                          €{(order.totalAmount / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-2">Articles:</p>
                      <ul className="space-y-1 text-sm">
                        {order.items?.map((item) => (
                          <li key={item.id} className="text-gray-900">
                            {item.productName}{item.sizeMl ? ` — ${item.sizeMl} ml` : " — format historique"} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Livraison:</span> {order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
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
