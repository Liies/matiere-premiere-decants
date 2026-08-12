import { useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';
import { ArrowLeft, ShoppingCart, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { useLocalCart } from '@/hooks/useLocalCart';
import { toast } from 'sonner';
import { getProductImage } from '@shared/image-assets';
import { formatPrice } from '@shared/price';
import { CART_CONFIRMATION_DURATION_MS, getCartConfirmationLabel } from '@shared/cart-feedback';
import { getOlfactoryRevealDelay } from '@shared/olfactory-reveal';

function ProductImage({
  productId,
  fallbackUrl,
  alt,
  className,
}: {
  productId: number;
  fallbackUrl?: string | null;
  alt: string;
  className: string;
}) {
  const [hasError, setHasError] = useState(false);
  const mappedImage = getProductImage(productId);
  const storageFallback = fallbackUrl?.startsWith('/manus-storage/') ? fallbackUrl : null;
  const src = mappedImage?.compressed ?? storageFallback;

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50" role="img" aria-label={alt}>
        <Leaf className="w-16 h-16 text-gray-300" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

export default function ProductDetail() {
  const [match, params] = useRoute('/product/:id');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const addFeedbackTimer = useRef<number | null>(null);
  const olfactoryNotesRef = useRef<HTMLDivElement | null>(null);
  const [areOlfactoryNotesRevealed, setAreOlfactoryNotesRevealed] = useState(false);

  const { addToCart } = useLocalCart();

  // Get product from tRPC
  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: parseInt((params as any)?.id || '0') },
    { enabled: !!match }
  );

  // Get similar products
  const { data: allProducts } = trpc.products.list.useQuery();
  const similarProducts = allProducts?.filter(
    (p: any) => p.id !== product?.id
  ).slice(0, 3);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    };
  }, []);

  useEffect(() => {
    const notesSection = olfactoryNotesRef.current;
    if (!notesSection || !product) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setAreOlfactoryNotesRevealed(true);
      return;
    }

    setAreOlfactoryNotesRevealed(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAreOlfactoryNotesRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(notesSection);
    return () => observer.disconnect();
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;

    addToCart(product, quantity, { announce: false });
    setIsAddingToCart(true);
    setShowAddedFeedback(true);

    if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    addFeedbackTimer.current = window.setTimeout(() => {
      setIsAddingToCart(false);
      setShowAddedFeedback(false);
    }, CART_CONFIRMATION_DURATION_MS);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-gray-400">Chargement...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-gray-600">Produit non trouvé</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

              <main className="container py-8 sm:py-12">

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex min-h-11 items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div
              className="luxury-image-frame group relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-lg bg-gray-50 transition-transform duration-700"
              style={{
                transform: `scale(${1 + scrollY * 0.0001})`,
              }}
            >
              <ProductImage
                productId={product.id}
                fallbackUrl={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                Collection Matière Première
              </p>
              <h1 className="mb-4 text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl">
                {product.name}
              </h1>
              <p className="mb-6 text-base leading-7 text-gray-600 sm:text-xl">{product.description}</p>
              <div className="text-3xl font-light text-gray-900">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Olfactory Notes */}
            <div ref={olfactoryNotesRef} className="mb-8 space-y-5 sm:space-y-6">
              {[
                { label: "Notes de tête", notes: product.topNotes, number: "01" },
                { label: "Notes de cœur", notes: product.heartNotes, number: "02" },
                { label: "Notes de fond", notes: product.baseNotes, number: "03" },
              ].map((note, index) => (
                <div
                  key={note.label}
                  className={`group/note flex gap-4 border-l pl-4 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
                    areOlfactoryNotesRevealed
                      ? "translate-y-0 border-gray-900 opacity-100"
                      : "translate-y-3 border-gray-200 opacity-0"
                  }`}
                  style={{ transitionDelay: `${getOlfactoryRevealDelay(index)}ms` }}
                >
                  <span className="pt-0.5 text-[0.65rem] font-medium tracking-[0.18em] text-gray-400" aria-hidden="true">
                    {note.number}
                  </span>
                  <div>
                    <h3 className="mb-2 text-sm uppercase tracking-widest text-gray-500 transition-colors duration-300 group-hover/note:text-gray-900">
                      {note.label}
                    </h3>
                    <p className="text-gray-700">{note.notes}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-4 animate-fade-in-delay-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center self-start rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Diminuer la quantité"
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="flex h-11 min-w-12 items-center justify-center px-3">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Augmenter la quantité"
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  aria-live="polite"
                  className={`relative min-h-12 w-full flex-1 overflow-hidden rounded-lg bg-gray-900 py-3 text-white transition-all hover:bg-gray-800 hover:shadow-lg sm:w-auto ${
                    isAddingToCart ? "scale-[0.98] bg-gray-800" : ""
                  }`}
                >
                  {showAddedFeedback && <span className="cart-added-ripple" aria-hidden="true" />}
                  <ShoppingCart className={`relative z-10 w-5 h-5 ${isAddingToCart ? "cart-icon-bounce" : ""}`} />
                  <span className="relative z-10">{getCartConfirmationLabel(isAddingToCart)}</span>
                  {showAddedFeedback && <span className="cart-added-check" aria-hidden="true">✓</span>}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className="flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h2 className="mb-6 text-2xl font-light text-gray-900 sm:mb-8 sm:text-3xl">
              Parfums similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProducts.map((p, idx) => (
                <a
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4 transition-transform duration-300 group-hover:scale-105">
                    <ProductImage
                      productId={p.id}
                      fallbackUrl={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-gray-600">{formatPrice(p.price)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
