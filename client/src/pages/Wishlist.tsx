import { Heart, Leaf, Share2, ShoppingCart, X } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocalCart } from "@/hooks/useLocalCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductImage } from "@shared/image-assets";
import { CART_CONFIRMATION_DURATION_MS } from "@shared/cart-feedback";
import { createSharedWishlistPath, parseSharedWishlistIds } from "@shared/wishlist-share";
import { toast } from "sonner";

export default function Wishlist() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { isAuthenticated, user } = useAuth();
  const { addToCart: addToLocalCart } = useLocalCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const utils = trpc.useUtils();
  const addVariantToCart = trpc.cart.addVariant.useMutation();
  const [recentlyAddedProductId, setRecentlyAddedProductId] = useState<number | null>(null);
  const addFeedbackTimer = useRef<number | null>(null);
  const sharedWishlistIds = parseSharedWishlistIds(window.location.search);
  const isSharedSelection = sharedWishlistIds.length > 0;
  const selectedIds = isSharedSelection ? sharedWishlistIds : wishlistIds;
  const wishedProducts = products?.filter((product) => selectedIds.includes(product.id)) ?? [];

  useEffect(() => () => {
    if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
  }, []);

  type WishlistProduct = NonNullable<typeof products>[number];

  const getAvailableVariant = (product: WishlistProduct) => (
    (product.variants ?? []).find((variant: { isActive?: boolean; stock: number }) => variant.isActive !== false && variant.stock > 0) ?? null
  );

  const confirmAddedProduct = (productId: number) => {
    if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    setRecentlyAddedProductId(productId);
    addFeedbackTimer.current = window.setTimeout(() => {
      setRecentlyAddedProductId((currentProductId) => currentProductId === productId ? null : currentProductId);
      addFeedbackTimer.current = null;
    }, CART_CONFIRMATION_DURATION_MS);
  };

  const handleAddToCart = (product: WishlistProduct) => {
    const variant = getAvailableVariant(product);
    if (!variant) {
      toast.error("Ce parfum est momentanément indisponible.");
      return;
    }

    if (isAuthenticated && user) {
      addVariantToCart.mutate(
        { variantId: variant.id, quantity: 1 },
        {
          onSuccess: () => {
            void utils.cart.getItems.invalidate();
            confirmAddedProduct(product.id);
          },
          onError: (error) => toast.error(error.message || "Impossible d’ajouter ce parfum au panier."),
        },
      );
      return;
    }

    addToLocalCart(product, variant, 1, { announce: false });
    confirmAddedProduct(product.id);
  };

  const shareWishlist = async () => {
    const selectionIds = wishedProducts.map((product) => product.id);
    const shareUrl = `${window.location.origin}${createSharedWishlistPath(selectionIds)}`;
    const shareData = {
      title: "Ma sélection Matière Première",
      text: `Découvrez ma sélection de ${selectionIds.length} parfum${selectionIds.length > 1 ? "s" : ""} Matière Première.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Sélection partagée.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien de sélection copié.");
        return;
      }

      toast.error("Le partage n’est pas disponible sur ce navigateur.");
    } catch (error) {
      if ((error as { name?: string }).name !== "AbortError") {
        toast.error("Impossible de partager cette sélection.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 py-10 sm:py-14">
        <div className="container">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gray-500">{isSharedSelection ? "Sélection partagée" : "Sélection personnelle"}</p>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">Liste de favoris</h1>
              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                Gardez les fragrances que vous souhaitez découvrir ou retrouver.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-gray-500" aria-live="polite">
                {wishedProducts.length} parfum{wishedProducts.length > 1 ? "s" : ""} {isSharedSelection ? "dans cette sélection" : `enregistré${wishedProducts.length > 1 ? "s" : ""}`}
              </p>
              {!isLoading && wishedProducts.length > 0 ? (
                <Button type="button" variant="outline" onClick={shareWishlist} className="min-h-11 gap-2 border-gray-300 bg-white text-gray-800 hover:border-gray-900 hover:bg-stone-50">
                  <Share2 className="h-4 w-4" aria-hidden="true" /> Partager la sélection
                </Button>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-xl bg-gray-100" />)}
            </div>
          ) : wishedProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10 text-gray-300" aria-hidden="true" />
              <h2 className="text-2xl font-light text-gray-900">Votre liste est encore vide</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
                Ajoutez un parfum avec le cœur pour le retrouver ici à tout moment.
              </p>
              <Link href="/products">
                <Button className="mt-7 min-h-11 bg-gray-900 px-5 text-white hover:bg-gray-800">Explorer la collection</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishedProducts.map((product) => {
                const image = getProductImage(product.id);
                const imageSrc = product.imageUrl ?? image?.compressed;
                const availableVariant = getAvailableVariant(product);
                const isAvailable = Boolean(availableVariant);
                const wasRecentlyAdded = recentlyAddedProductId === product.id;
                return (
                  <Card key={product.id} className="group overflow-hidden border-gray-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="relative p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Retirer ${product.name} de la liste de favoris`}
                        className="wishlist-remove-button absolute right-7 top-7 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-600 shadow-sm transition-[background-color,color,transform,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:bg-[#453a2e] hover:text-[#fffaf0] hover:shadow-md active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="luxury-image-frame product-bottle-frame flex h-64 items-center justify-center rounded-lg bg-gray-100">
                          {imageSrc ? <img src={imageSrc} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /> : <Leaf className="h-12 w-12 text-gray-300" aria-hidden="true" />}
                        </div>
                        <h2 className="mt-5 text-xl font-light text-gray-900">{product.name}</h2>
                        <p className="mt-1 text-sm text-gray-500">Décant {product.volumeMl ?? 50} ml · €{(product.price / 100).toFixed(2)}</p>
                      </Link>
                      <div className="mt-5 flex">
                        <Button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={!isAvailable || addVariantToCart.isPending}
                          aria-live="polite"
                          className={`min-h-11 w-full gap-2 bg-gray-900 px-4 text-sm font-medium text-white transition-[background-color,transform,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:bg-gray-800 hover:shadow-lg active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none sm:w-auto ${!isAvailable ? "cursor-not-allowed bg-stone-300 text-stone-600 hover:bg-stone-300 hover:shadow-none" : ""}`}
                        >
                          <ShoppingCart className={`h-4 w-4 ${wasRecentlyAdded ? "cart-icon-bounce" : ""}`} aria-hidden="true" />
                          <span>{!isAvailable ? "Indisponible" : wasRecentlyAdded ? "Ajouté au panier" : "Ajouter au panier"}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
