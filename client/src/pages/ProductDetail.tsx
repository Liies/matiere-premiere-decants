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

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;

    addToCart(product, quantity);
    setIsAddingToCart(true);
    setShowAddedFeedback(true);

    if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    addFeedbackTimer.current = window.setTimeout(() => {
      setIsAddingToCart(false);
      setShowAddedFeedback(false);
    }, 950);
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

      <main className="container mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div
              className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 transition-transform duration-500"
              style={{
                transform: `scale(${1 + scrollY * 0.0001})`,
              }}
            >
              <ProductImage
                productId={product.id}
                fallbackUrl={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
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
              <h1 className="text-4xl md:text-5xl font-light mb-4 text-gray-900">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{product.description}</p>
              <div className="text-3xl font-light text-gray-900">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Olfactory Notes */}
            <div className="mb-8 space-y-6 animate-fade-in-delay">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Notes de tête
                </h3>
                <p className="text-gray-700">{product.topNotes}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Notes de cœur
                </h3>
                <p className="text-gray-700">{product.heartNotes}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Notes de fond
                </h3>
                <p className="text-gray-700">{product.baseNotes}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 animate-fade-in-delay-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="px-6 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  aria-live="polite"
                  className={`relative flex-1 overflow-hidden bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg ${
                    isAddingToCart ? "scale-[0.98] bg-gray-800" : ""
                  }`}
                >
                  {showAddedFeedback && <span className="cart-added-ripple" aria-hidden="true" />}
                  <ShoppingCart className={`relative z-10 w-5 h-5 ${isAddingToCart ? "cart-icon-bounce" : ""}`} />
                  <span className="relative z-10">{isAddingToCart ? "Ajouté au panier" : "Ajouter au panier"}</span>
                  {showAddedFeedback && <span className="cart-added-check" aria-hidden="true">✓</span>}
                </Button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <div className="mt-20">
            <h2 className="text-3xl font-light mb-8 text-gray-900">
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
