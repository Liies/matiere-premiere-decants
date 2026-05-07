import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Leaf, ShoppingCart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { imageAssets } from "@shared/image-assets";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { isAuthenticated } = useAuth();
  const addToCart = trpc.cart.addItem.useMutation();
  const [selectedQuantity, setSelectedQuantity] = useState<Record<number, number>>({});

  const handleAddToCart = (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour ajouter au panier");
      return;
    }

    const quantity = selectedQuantity[productId] || 1;
    addToCart.mutate(
      { productId, quantity },
      {
        onSuccess: () => {
          toast.success("Produit ajouté au panier");
          setSelectedQuantity(prev => ({ ...prev, [productId]: 1 }));
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de l'ajout au panier");
        },
      }
    );
  };

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
            <Link href="/products" className="text-sm text-gray-900 font-medium">
              Catalogue
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Panier
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-2">Catalogue Complet</h2>
            <p className="text-gray-600">Découvrez nos 10 parfums de niche en décants 50ml</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-light text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Décant 50ml</p>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {product.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Notes de tête</p>
                        <p className="text-gray-900">{product.topNotes}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Notes de cœur</p>
                        <p className="text-gray-900">{product.heartNotes}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Notes de fond</p>
                        <p className="text-gray-900">{product.baseNotes}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-2xl font-light text-gray-900">
                          €{(product.price / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {product.stock > 0 ? "✓ En stock" : "Rupture"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={selectedQuantity[product.id] || 1}
                          onChange={(e) =>
                            setSelectedQuantity(prev => ({
                              ...prev,
                              [product.id]: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-12 px-2 py-1 border border-gray-200 rounded text-center text-sm"
                          disabled={product.stock === 0}
                        />
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0 || addToCart.isPending}
                          className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
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
