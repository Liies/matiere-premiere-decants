import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Leaf } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { getProductImage } from "@shared/image-assets";
import { useLocalCart } from "@/hooks/useLocalCart";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { isAuthenticated, user } = useAuth();
  const { addToCart: addToLocalCart } = useLocalCart();
  const addToCart = trpc.cart.addItem.useMutation();
  const [selectedQuantity, setSelectedQuantity] = useState<Record<number, number>>({});

  const handleAddToCart = (product: any) => {
    const quantity = selectedQuantity[product.id] || 1;
    if (isAuthenticated && user) {
      // Add to server cart if authenticated
      addToCart.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            setSelectedQuantity((prev) => ({ ...prev, [product.id]: 1 }));
            toast.success("Article ajouté au panier");
          },
          onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'ajout au panier");
          },
        }
      );
    } else {
      // Add to local cart if not authenticated
      addToLocalCart(product, quantity);
      setSelectedQuantity((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

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
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {(() => {
                        const image = getProductImage(product.id);
                        return image ? (
                          <img
                            src={image.compressed}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Leaf className="w-12 h-12 text-gray-300" />
                        );
                      })()}
                    </div>
                    <h3 className="text-lg font-light text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">Décant 50ml</p>

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
                        onClick={() => handleAddToCart(product)}
                        disabled={addToCart.isPending || product.stock === 0}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter au panier
                      </Button>           </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
