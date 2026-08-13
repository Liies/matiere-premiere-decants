import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Leaf, Search, SlidersHorizontal, X, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getProductImage } from "@shared/image-assets";
import { useLocalCart } from "@/hooks/useLocalCart";
import { filterProductsByNotes, OLFACTORY_FILTERS } from "@shared/olfactory";
import { getCatalogSuggestions, searchProductsByName } from "@shared/catalog-search";
import { CART_CONFIRMATION_DURATION_MS, getCartFeedbackKey } from "@shared/cart-feedback";
import { getOlfactoryFilterIdFromHash } from "@shared/catalog-category-route";
import { useWishlist } from "@/hooks/useWishlist";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { isAuthenticated, user } = useAuth();
  const { addToCart: addToLocalCart } = useLocalCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const addToCart = trpc.cart.addItem.useMutation();
  const [selectedQuantity, setSelectedQuantity] = useState<Record<number, number>>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [recentlyAddedProductKeys, setRecentlyAddedProductKeys] = useState<Set<string>>(() => new Set());
  const [wishlistAnimationKey, setWishlistAnimationKey] = useState<string | null>(null);
  const [flippedProductId, setFlippedProductId] = useState<number | null>(null);
  const [hoverFlippedProductId, setHoverFlippedProductId] = useState<number | null>(null);
  const addFeedbackTimers = useRef<Map<string, number>>(new Map());
  const wishlistAnimationTimer = useRef<number | null>(null);
  const hoverFlipTimer = useRef<number | null>(null);

  type CatalogProduct = NonNullable<typeof products>[number];
  const productPath = (product: CatalogProduct) => product.brand?.slug
    ? `/parfum/${product.brand.slug}/${product.slug}`
    : `/product/${product.id}`;
  const noteMatchedProducts = useMemo<CatalogProduct[]>(
    () => (products ? filterProductsByNotes<CatalogProduct>(products, selectedFilters) : []),
    [products, selectedFilters],
  );
  const filteredProducts = useMemo<CatalogProduct[]>(
    () => searchProductsByName(noteMatchedProducts, searchQuery),
    [noteMatchedProducts, searchQuery],
  );
  const searchSuggestions = useMemo<CatalogProduct[]>(() => {
    if (!searchQuery.trim()) return [];
    return getCatalogSuggestions(noteMatchedProducts, searchQuery, 6);
  }, [noteMatchedProducts, searchQuery]);

  useEffect(() => {
    return () => {
      addFeedbackTimers.current.forEach((timer) => window.clearTimeout(timer));
      addFeedbackTimers.current.clear();
      if (wishlistAnimationTimer.current) window.clearTimeout(wishlistAnimationTimer.current);
      if (hoverFlipTimer.current) window.clearTimeout(hoverFlipTimer.current);
    };
  }, []);

  useEffect(() => {
    const applyCategoryFromHash = () => {
      const filterId = getOlfactoryFilterIdFromHash(window.location.hash);
      if (!filterId) return;

      setSelectedFilters([filterId]);
      window.requestAnimationFrame(() => {
        document.getElementById("catalog-filters")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    applyCategoryFromHash();
    window.addEventListener("hashchange", applyCategoryFromHash);
    return () => window.removeEventListener("hashchange", applyCategoryFromHash);
  }, []);

  const confirmAddedProduct = (product: CatalogProduct) => {
    const feedbackKey = getCartFeedbackKey(product);
    setRecentlyAddedProductKeys((current) => new Set(current).add(feedbackKey));

    const existingTimer = addFeedbackTimers.current.get(feedbackKey);
    if (existingTimer) window.clearTimeout(existingTimer);

    const timer = window.setTimeout(() => {
      setRecentlyAddedProductKeys((current) => {
        if (!current.has(feedbackKey)) return current;
        const next = new Set(current);
        next.delete(feedbackKey);
        return next;
      });
      addFeedbackTimers.current.delete(feedbackKey);
    }, CART_CONFIRMATION_DURATION_MS);
    addFeedbackTimers.current.set(feedbackKey, timer);
  };

  const isProductRecentlyAdded = (product: CatalogProduct) =>
    recentlyAddedProductKeys.has(getCartFeedbackKey(product));

  const clearHoverFlipTimer = () => {
    if (hoverFlipTimer.current) {
      window.clearTimeout(hoverFlipTimer.current);
      hoverFlipTimer.current = null;
    }
  };

  const scheduleHoverFlip = (productId: number) => {
    clearHoverFlipTimer();
    hoverFlipTimer.current = window.setTimeout(() => {
      setHoverFlippedProductId(productId);
      hoverFlipTimer.current = null;
    }, 1200);
  };

  const cancelHoverFlip = (productId: number) => {
    clearHoverFlipTimer();
    setHoverFlippedProductId((current) => (current === productId ? null : current));
  };

  const handleToggleWishlist = (product: CatalogProduct) => {
    toggleWishlist(product.id);
    setWishlistAnimationKey(getCartFeedbackKey(product));
    if (wishlistAnimationTimer.current) window.clearTimeout(wishlistAnimationTimer.current);
    wishlistAnimationTimer.current = window.setTimeout(() => setWishlistAnimationKey(null), 520);
  };

  const selectSuggestion = (product: CatalogProduct) => {
    setSearchQuery(product.name);
    setIsSearchFocused(false);
    setActiveSuggestionIndex(-1);
    window.location.assign(productPath(product));
  };

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!searchSuggestions.length) {
      if (event.key === "Escape") setIsSearchFocused(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => Math.min(current + 1, searchSuggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      const suggestion = searchSuggestions[activeSuggestionIndex];
      if (suggestion) selectSuggestion(suggestion);
    } else if (event.key === "Escape") {
      setIsSearchFocused(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleAddToCart = (product: CatalogProduct) => {
    const quantity = selectedQuantity[product.id] || 1;
    const handleSuccessfulAddition = () => {
      setSelectedQuantity((prev) => ({ ...prev, [product.id]: 1 }));
      confirmAddedProduct(product);
    };

    if (isAuthenticated && user) {
      addToCart.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            handleSuccessfulAddition();
          },
          onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'ajout au panier");
          },
        },
      );
    } else {
      addToLocalCart(product, quantity, { announce: false });
      handleSuccessfulAddition();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">La collection</p>
            <h2 className="text-3xl font-light text-gray-900 mb-2 sm:text-4xl">Catalogue Complet</h2>
            <p className="max-w-xl text-sm leading-6 text-gray-600 sm:text-base">Découvrez nos 10 parfums de niche en décants 50ml</p>
          </div>

          <section aria-labelledby="catalog-search-title" className="mb-6 animate-slide-up">
            <label id="catalog-search-title" htmlFor="catalog-search" className="sr-only">
              Rechercher un parfum par son nom
            </label>
            <div className="relative max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 120)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Rechercher un parfum par son nom…"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isSearchFocused && searchQuery.trim().length > 0}
                aria-controls="catalog-search-suggestions"
                aria-activedescendant={
                  activeSuggestionIndex >= 0
                    ? `catalog-search-option-${searchSuggestions[activeSuggestionIndex]?.id}`
                    : undefined
                }
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSuggestionIndex(-1);
                  }}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              {isSearchFocused && searchQuery.trim() && (
                <div
                  id="catalog-search-suggestions"
                  role="listbox"
                  aria-label="Suggestions de parfums"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white p-2 shadow-xl animate-fade-in"
                >
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        id={`catalog-search-option-${suggestion.id}`}
                        type="button"
                        role="option"
                        aria-selected={activeSuggestionIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onClick={() => selectSuggestion(suggestion)}
                                                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors sm:px-4 ${

                          activeSuggestionIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <span>
                          <span className="block text-sm text-gray-900">{suggestion.name}</span>
                          <span className="block text-xs text-gray-500">Décant {suggestion.volumeMl ?? 50} ml · Voir la fiche</span>
                        </span>
                        <span className="text-xs uppercase tracking-[0.16em] text-gray-400">Ouvrir</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500" role="status">
                      Aucune suggestion pour « {searchQuery} »
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section
            id="catalog-filters"
            aria-labelledby="olfactory-filter-title"
            className="mb-12 scroll-mt-24 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 md:p-6 animate-slide-up"
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
                  className="min-h-11 self-start text-gray-600 hover:text-gray-900 md:self-auto"
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
              className="mt-5 flex w-full flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
            >
              {OLFACTORY_FILTERS.map((filter) => (
                <ToggleGroupItem
                  key={filter.id}
                  value={filter.id}
                  aria-label={`Filtrer par notes ${filter.label}`}
                  className="inline-flex min-h-11 min-w-max flex-none whitespace-nowrap rounded-full border-gray-300 bg-white px-3 py-2 text-sm font-normal touch-manipulation data-[state=on]:border-gray-900 data-[state=on]:bg-gray-900 data-[state=on]:text-white sm:px-4"
                >
                  {filter.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <p className="mt-4 text-xs text-gray-500" aria-live="polite">
              {searchQuery || selectedFilters.length > 0
                ? `${filteredProducts.length} parfum${filteredProducts.length > 1 ? "s" : ""} correspondant${filteredProducts.length > 1 ? "s" : ""}`
                : `${products?.length ?? 0} parfums affichés`}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedFilters([]);
                  setSearchQuery("");
                }}
              >
                Voir toute la collection
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <Card
                  key={getCartFeedbackKey(product)}
                  className="catalog-product-card group/product-card overflow-hidden border-gray-200 transition-all duration-500 animate-fade-in hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
                  style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
                  onMouseEnter={() => scheduleHoverFlip(product.id)}
                  onMouseLeave={() => cancelHoverFlip(product.id)}
                >
                  <div className="space-y-4 p-4 sm:p-5">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product)}
                        aria-label={isWishlisted(product.id) ? `Retirer ${product.name} de la liste de souhaits` : `Ajouter ${product.name} à la liste de souhaits`}
                        aria-pressed={isWishlisted(product.id)}
                        className={`wishlist-heart-button absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white ${isWishlisted(product.id) ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? "fill-current" : ""} ${wishlistAnimationKey === getCartFeedbackKey(product) ? "wishlist-heart-pop" : ""}`} aria-hidden="true" />
                      </button>
                      <div
                        data-testid={`catalog-flip-card-${product.id}`}
                        data-flipped={flippedProductId === product.id}
                        data-hover-flipped={hoverFlippedProductId === product.id}
                        className="catalog-flip-card"
                      >
                        <div className="catalog-flip-card-inner">
                          <a href={productPath(product)} className="catalog-flip-face catalog-flip-front luxury-image-frame product-bottle-frame flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-64" aria-label={`Voir la fiche de ${product.name}`}>
                            {(() => {
                              const image = getProductImage(product.id);
                              return image ? (
                                <img
                                  src={image.compressed}
                                  alt={product.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover/product-card:scale-[1.035] group-focus-within/product-card:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
                                />
                              ) : (
                                <Leaf className="w-12 h-12 text-gray-300" aria-hidden="true" />
                              );
                            })()}
                          </a>
                          <a href={productPath(product)} className="catalog-flip-face catalog-flip-back" aria-label={`Voir la fiche de ${product.name} et ses notes olfactives`}>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Pyramide olfactive</p>
                            <dl className="mt-5 space-y-4 text-left">
                              <div>
                                <dt className="text-xs uppercase tracking-[0.14em] text-gray-500">Tête</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-900">{product.topNotes}</dd>
                              </div>
                              <div>
                                <dt className="text-xs uppercase tracking-[0.14em] text-gray-500">Cœur</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-900">{product.heartNotes}</dd>
                              </div>
                              <div>
                                <dt className="text-xs uppercase tracking-[0.14em] text-gray-500">Fond</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-900">{product.baseNotes}</dd>
                              </div>
                            </dl>
                            <p className="mt-5 text-xs text-gray-500">Voir la fiche détaillée →</p>
                          </a>
                        </div>
                      </div>
                      <a href={productPath(product)} className="mt-5 block" aria-label={`Voir la fiche de ${product.name}`}>
                        <h3 className="text-lg font-light text-gray-900 hover:text-gray-600 transition-colors">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Décant {product.volumeMl ?? 50} ml</p>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFlippedProductId((current) => (current === product.id ? null : product.id))}
                      aria-expanded={flippedProductId === product.id}
                      aria-controls={`catalog-flip-card-${product.id}`}
                      className="mt-1 min-h-11 text-left text-xs font-medium uppercase tracking-[0.14em] text-gray-600 underline decoration-gray-300 underline-offset-4 sm:hidden"
                    >
                      {flippedProductId === product.id ? "Masquer les notes" : "Afficher les notes"}
                    </button>

                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>

                    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div>
                        <p className="text-2xl font-light text-gray-900">€{(product.price / 100).toFixed(2)}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {product.stock > 0 ? "✓ En stock" : "Rupture"}
                        </p>
                      </div>

                      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
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
                          className="h-11 w-14 rounded border border-gray-200 px-2 text-center text-sm"
                          disabled={product.stock === 0}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={addToCart.isPending || product.stock === 0}
                          aria-live="polite"
                          className={`relative min-h-11 flex-1 overflow-hidden bg-gray-900 text-white font-light whitespace-nowrap transition-all duration-500 touch-manipulation hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg sm:max-w-0 sm:min-w-0 sm:flex-none sm:scale-95 sm:translate-y-2 sm:px-0 sm:opacity-0 sm:group-hover/product-card:max-w-44 sm:group-hover/product-card:scale-100 sm:group-hover/product-card:translate-y-0 sm:group-hover/product-card:px-4 sm:group-hover/product-card:opacity-100 sm:group-focus-within/product-card:max-w-44 sm:group-focus-within/product-card:scale-100 sm:group-focus-within/product-card:translate-y-0 sm:group-focus-within/product-card:px-4 sm:group-focus-within/product-card:opacity-100 motion-reduce:transform-none motion-reduce:transition-none ${
                            isProductRecentlyAdded(product) ? "scale-[0.97] bg-gray-800" : ""
                          }`}
                        >
                          {isProductRecentlyAdded(product) && (
                            <span className="cart-added-ripple" aria-hidden="true" />
                          )}
                          <ShoppingCart
                            className={`relative z-10 mr-2 h-4 w-4 ${
                              isProductRecentlyAdded(product) ? "cart-icon-bounce" : ""
                            }`}
                            aria-hidden="true"
                          />
                          <span className="relative z-10">
                            {isProductRecentlyAdded(product) ? "Ajouté" : "Ajouter"}
                          </span>
                          {isProductRecentlyAdded(product) && (
                            <span className="cart-added-check" aria-hidden="true">✓</span>
                          )}
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
