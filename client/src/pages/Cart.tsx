import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "wouter";
import { Trash2, Plus, Minus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocalCart } from "@/hooks/useLocalCart";
import { toast } from "sonner";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { data: cartItems, isLoading, refetch } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated, // Only fetch when authenticated
  });
  const { cartItems: localCartItems, updateQuantity: updateLocalQuantity, removeItem: removeLocalItem, clearCart: clearLocalCart, getTotalPrice } = useLocalCart();
  const updateQuantity = trpc.cart.updateQuantity.useMutation();
  const removeItem = trpc.cart.removeItem.useMutation();
  const clearCart = trpc.cart.clear.useMutation();
  const displayItems = isAuthenticated ? cartItems : localCartItems;

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    updateQuantity.mutate(
      { cartItemId, quantity: newQuantity },
      {
        onSuccess: () => {
          refetch();
          toast.success("Quantité mise à jour");
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de la mise à jour");
        },
      }
    );
  };

  const handleRemoveItem = (cartItemId: number) => {
    removeItem.mutate(
      { cartItemId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Produit supprimé du panier");
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de la suppression");
        },
      }
    );
  };

  const handleClearCart = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => {
        refetch();
        toast.success("Panier vidé");
      },
    });
  };

  const totalAmount = isAuthenticated
    ? (cartItems || []).reduce(
        (sum, item) => sum + (item.variant?.priceCents ?? item.product?.price ?? 0) * item.quantity,
        0
      )
    : getTotalPrice();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Content */}
              <main className="flex-1 py-8 sm:py-12">

        <div className="container max-w-4xl">
          <h2 className="mb-6 text-3xl font-light text-gray-900 sm:mb-8 sm:text-4xl">Votre Panier</h2>

          {isLoading && isAuthenticated ? (
            <p className="text-gray-600">Chargement du panier...</p>
          ) : !displayItems || displayItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Votre panier est vide</p>
              <Link href="/products">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  Continuer vos achats
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {displayItems?.map((item) => (
                                      <Card key={isAuthenticated ? (item as any).id : (item as any).productId} className="p-4 sm:p-6">

                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-light text-gray-900">
                          {isAuthenticated ? (item as any).product?.name : (item as any).name}
                        </h3>
                        <p className="text-sm text-gray-500">Décant {(isAuthenticated ? (item as any).variant?.sizeMl ?? (item as any).product?.volumeMl : (item as any).volumeMl) ?? 50} ml</p>
                      </div>
                      <p className="text-lg font-light text-gray-900">
                        €{((isAuthenticated ? (item as any).variant?.priceCents ?? (item as any).product?.price ?? 0 : (item as any).price) / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isAuthenticated) {
                              handleUpdateQuantity((item as any).id, item.quantity - 1);
                            } else {
                              updateLocalQuantity((item as any).productId, item.quantity - 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (isAuthenticated) {
                              handleUpdateQuantity((item as any).id, item.quantity + 1);
                            } else {
                              updateLocalQuantity((item as any).productId, item.quantity + 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            handleRemoveItem((item as any).id);
                          } else {
                            removeLocalItem((item as any).productId);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded transition text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="space-y-6 p-4 lg:sticky lg:top-4 sm:p-6">
                  <div>
                    <h3 className="text-lg font-light text-gray-900 mb-4">Récapitulatif</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="text-gray-900">€{(totalAmount / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Livraison</span>
                        <span className="text-gray-900">À calculer</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-light text-gray-900">Total</span>
                      <span className="text-xl font-light text-gray-900">
                        €{(totalAmount / 100).toFixed(2)}
                      </span>
                    </div>

                    <Link href="/checkout">
                      <Button className="mb-2 min-h-12 w-full bg-gray-900 text-white hover:bg-gray-800">
                        Procéder au paiement
                      </Button>
                    </Link>

                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          handleClearCart();
                        } else {
                          clearLocalCart();
                          toast.success("Panier vidé");
                        }
                      }}
                      className="min-h-11 w-full py-2 text-sm text-gray-600 transition hover:text-gray-900"
                    >
                      Vider le panier
                    </button>
                  </div>
                </Card>
              </div>
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
