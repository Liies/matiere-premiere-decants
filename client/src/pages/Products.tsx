import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Leaf, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getProductImage } from "@shared/image-assets";
import { useLocalCart } from "@/hooks/useLocalCart";
import { filterProductsByNotes, OLFACTORY_FILTERS } from "@shared/olfactory";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { isAuthenticated, user } = useAuth();
  const { addToCart: addToLocalCart } = useLocalCart();
  const addToCart = trpc.cart.addItem.useMutation();
  const [selectedQuantity, setSelectedQuantity] = useState<Record<number, number>>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  type CatalogProduct = NonNullable<typeof products>[number];
  const filteredProducts = useMemo<CatalogProduct[]>(
    () => (products ? filterProductsByNotes<CatalogProduct>(products, selectedFilters) : []),
    [products, selectedFilters],
  );

  const handleAddToCart = (product: any) => {
    const quantity = selectedQuantity[product.id] || 1;
    if (isAuthenticated && user) {
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
        },
      );
    } else {
      addToLocalCart(product, quantity);
      setSelectedQuantity((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">La collection</p>
            <h2 className="text-4xl font-light text-gray-900 mb-2">Catalogue Complet</h2>
            <p className="text-gray-600">Découvrez nos 10 parfums de niche en décants 50ml</p>
          </div>

          <section
            aria-labelledby="olfactory-filter-title"
            className="mb-12 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 md:p-6 animate-slide-up"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <h3 id="olfactory-filter-title" className="text-sm font-medium uppercase tracking-[0.18em] text-gray-800">
                    Explorer par notes
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  Sélectionnez une ou plusieurs familles olfactives pour affiner la collection.
                </p>
              </div>
              {selectedFilters.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedFilters([])}
                  className="self-start md:self-auto text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <ToggleGroup
              type="multiple"
              value={selectedFilters}
              onValueChange={setSelectedFilters}
              variant="outline"
              aria-label="Filtrer les parfums par notes olfactives"
              className="mt-5 flex w-full flex-wrap gap-2"
            >
              {OLFACTORY_FILTERS.map((filter) => (
                <ToggleGroupItem
                  key={filter.id}
                  value={filter.id}
                  aria-label={`Filtrer par notes ${filter.label}`}
                  className="rounded-full border-gray-300 bg-white px-4 py-2 text-sm font-normal data-[state=on]:border-gray-900 data-[state=on]:bg-gray-900 data-[state=on]:text-white"
                >
                  {filter.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <p className="mt-4 text-xs text-gray-500" aria-live="polite">
              {selectedFilters.length === 0
                ? `${products?.length ?? 0} parfums affichés`
                : `${filteredProducts.length} parfum${filteredProducts.length > 1 ? "s" : ""} correspondant${filteredProducts.length > 1 ? "s" : ""}`}
            </p>
          </section>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[520px] rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center animate-fade-in" role="status">
              <Leaf className="mx-auto mb-4 h-10 w-10 text-gray-300" aria-hidden="true" />
              <h3 className="text-2xl font-light text-gray-900 mb-2">Aucun parfum trouvé</h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500">
                Essayez une autre famille olfactive ou réinitialisez les filtres pour retrouver toute la collection.
              </p>
              <Button type="button" variant="outline" onClick={() => setSelectedFilters([])}>
                Voir toute la collection
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
                >
                  <div className="space-y-4 p-5">
                    <a href={`/product/${product.id}`} className="block" aria-label={`Voir la fiche de ${product.name}`}>
                      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {(() => {
                          const image = getProductImage(product.id);
                          return image ? (
                            <img
                              src={image.compressed}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <Leaf className="w-12 h-12 text-gray-300" aria-hidden="true" />
                          );
                        })()}
                      </div>
                      <div className="mt-5">
                        <h3 className="text-lg font-light text-gray-900 hover:text-gray-600 transition-colors">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Décant 50ml</p>
                      </div>
                    </a>

                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>

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

                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-2xl font-light text-gray-900">€{(product.price / 100).toFixed(2)}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {product.stock > 0 ? "✓ En stock" : "Rupture"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor={`quantity-${product.id}`} className="sr-only">
                          Quantité de {product.name}
                        </label>
                        <input
                          id={`quantity-${product.id}`}
                          type="number"
                          min="1"
                          max={product.stock}
                          value={selectedQuantity[product.id] || 1}
                          onChange={(event) =>
                            setSelectedQuantity((prev) => ({
                              ...prev,
                              [product.id]: Math.max(1, parseInt(event.target.value, 10) || 1),
                            }))
                          }
                          className="w-12 px-2 py-2 border border-gray-200 rounded text-center text-sm"
                          disabled={product.stock === 0}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={addToCart.isPending || product.stock === 0}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-light whitespace-nowrap"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                          Ajouter
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

      <Footer />
    </div>
  );
}
