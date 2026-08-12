import { Heart, Leaf, X } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductImage } from "@shared/image-assets";

export default function Wishlist() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const wishedProducts = products?.filter((product) => wishlistIds.includes(product.id)) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 py-10 sm:py-14">
        <div className="container">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gray-500">Sélection personnelle</p>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">Liste de souhaits</h1>
              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                Gardez les fragrances que vous souhaitez découvrir ou retrouver.
              </p>
            </div>
            <p className="text-sm text-gray-500" aria-live="polite">
              {wishlistIds.length} parfum{wishlistIds.length > 1 ? "s" : ""} enregistré{wishlistIds.length > 1 ? "s" : ""}
            </p>
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
                return (
                  <Card key={product.id} className="group overflow-hidden border-gray-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="relative p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Retirer ${product.name} de la liste de souhaits`}
                        className="wishlist-heart-button absolute right-7 top-7 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition hover:bg-white"
                      >
                        <Heart className="wishlist-heart-pop h-5 w-5 fill-current" aria-hidden="true" />
                      </button>
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="luxury-image-frame product-bottle-frame flex h-64 items-center justify-center rounded-lg bg-gray-100">
                          {image ? <img src={image.compressed} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /> : <Leaf className="h-12 w-12 text-gray-300" aria-hidden="true" />}
                        </div>
                        <h2 className="mt-5 text-xl font-light text-gray-900">{product.name}</h2>
                        <p className="mt-1 text-sm text-gray-500">Décant {product.volumeMl ?? 50} ml · €{(product.price / 100).toFixed(2)}</p>
                      </Link>
                      <button type="button" onClick={() => toggleWishlist(product.id)} className="mt-5 flex min-h-11 items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900">
                        <X className="h-4 w-4" aria-hidden="true" /> Retirer de la liste
                      </button>
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
