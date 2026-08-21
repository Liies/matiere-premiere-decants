import { useState, useEffect, useRef } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowLeft, ShoppingCart, Heart, Leaf, BookOpen, MapPin, Sparkles, ExternalLink, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { useLocalCart } from '@/hooks/useLocalCart';
import { toast } from 'sonner';
import { formatPrice } from "@shared/price";
import { getConcentrationLabel } from "@shared/fragrance-concentration";
import { CART_CONFIRMATION_DURATION_MS, getCartConfirmationLabel } from '@shared/cart-feedback';
import { getOlfactoryRevealDelay } from '@shared/olfactory-reveal';
import { getProductStory } from '@shared/product-stories';
import { formatSize, getDefaultVariant, isVariantAvailable } from '@shared/variants';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/_core/hooks/useAuth';
import { getProductVisualMotion } from '@shared/product-visual-motion';
import { OfficialFragranceVideo } from '@/components/OfficialFragranceVideo';

function ProductImage({
  fallbackUrl,
  alt,
  className,
  loading = "lazy",
  fetchPriority,
}: {
  productId?: number;
  fallbackUrl?: string | null;
  alt: string;
  className: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [hasError, setHasError] = useState(false);
  const src = fallbackUrl?.startsWith('/manus-storage/') ? fallbackUrl : null;

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
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

export default function ProductDetail() {
  const [legacyMatch, legacyParams] = useRoute('/product/:id');
  const [stableMatch, stableParams] = useRoute('/parfum/:brand/:slug');
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const addFeedbackTimer = useRef<number | null>(null);
  const wishlistAnimationTimer = useRef<number | null>(null);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const olfactoryNotesRef = useRef<HTMLDivElement | null>(null);
  const [areOlfactoryNotesRevealed, setAreOlfactoryNotesRevealed] = useState(false);
  const productVisualMotion = getProductVisualMotion(scrollY);

  const { addToCart } = useLocalCart();
  const { isAuthenticated } = useAuth();
  const addVariantToCart = trpc.cart.addVariant.useMutation();
  const trpcUtils = trpc.useUtils();

  const { data: legacyProduct, isLoading: isLoadingLegacy } = trpc.products.getById.useQuery(
    { id: parseInt((legacyParams as any)?.id || '0') },
    { enabled: !!legacyMatch },
  );
  const { data: stableProduct, isLoading: isLoadingStable } = trpc.products.getByBrandSlug.useQuery(
    { brand: (stableParams as any)?.brand || '', slug: (stableParams as any)?.slug || '' },
    { enabled: !!stableMatch },
  );
  const product = stableProduct ?? legacyProduct;
  const productStory = getProductStory(product?.slug);
  const productVariants = (product as any)?.variants ?? [];
  const publicProductVariants = productVariants.filter((variant: { isActive?: boolean }) => variant.isActive !== false);
  const productBrandName = stableProduct?.brand.name ?? "Collection Matière Première";
  const selectedVariant = getDefaultVariant(publicProductVariants) ?? null;
  const isLoading = stableMatch ? isLoadingStable : isLoadingLegacy;

  const { data: allProducts } = trpc.products.list.useQuery();
  const { data: publishedReviews, isLoading: areReviewsLoading } = trpc.reviews.listPublished.useQuery(
    { productId: product?.id ?? 0 },
    { enabled: Boolean(product?.id) },
  );
  const { data: reviewEligibility } = trpc.reviews.eligibility.useQuery(
    { productId: product?.id ?? 0 },
    { enabled: isAuthenticated && Boolean(product?.id) },
  );
  const createReview = trpc.reviews.create.useMutation();
  const similarProducts = allProducts?.filter(
    (p: any) => p.id !== product?.id && p.brandId === product?.brandId
  ).slice(0, 3);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame: number | null = null;
    const scheduleFrame = typeof window.requestAnimationFrame === "function"
      ? window.requestAnimationFrame.bind(window)
      : (callback: FrameRequestCallback) => window.setTimeout(callback, 0);
    const cancelFrame = typeof window.cancelAnimationFrame === "function"
      ? window.cancelAnimationFrame.bind(window)
      : window.clearTimeout.bind(window);
    const handleScroll = () => {
      if (animationFrame !== null) return;
      animationFrame = scheduleFrame(() => {
        setScrollY(window.scrollY);
        animationFrame = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame !== null) cancelFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
      if (wishlistAnimationTimer.current) window.clearTimeout(wishlistAnimationTimer.current);
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

    if (!selectedVariant || !isVariantAvailable(selectedVariant) || selectedVariant.stock < quantity) {
      toast.error("Le décant 50 ml n’est pas disponible dans cette quantité.");
      return;
    }
    if (isAuthenticated) {
      addVariantToCart.mutate(
        { variantId: selectedVariant.id, quantity },
        {
          onSuccess: async () => {
            await trpcUtils.cart.getItems.invalidate();
            setIsAddingToCart(true);
            setShowAddedFeedback(true);
            if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
            addFeedbackTimer.current = window.setTimeout(() => {
              setIsAddingToCart(false);
              setShowAddedFeedback(false);
            }, CART_CONFIRMATION_DURATION_MS);
          },
          onError: (error) => toast.error(error.message || "Impossible d’ajouter ce format au panier."),
        },
      );
      return;
    }

    addToCart(product, selectedVariant, quantity, { announce: false });
    setIsAddingToCart(true);
    setShowAddedFeedback(true);

    if (addFeedbackTimer.current) window.clearTimeout(addFeedbackTimer.current);
    addFeedbackTimer.current = window.setTimeout(() => {
      setIsAddingToCart(false);
      setShowAddedFeedback(false);
    }, CART_CONFIRMATION_DURATION_MS);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    setIsWishlistAnimating(true);
    if (wishlistAnimationTimer.current) window.clearTimeout(wishlistAnimationTimer.current);
    wishlistAnimationTimer.current = window.setTimeout(() => setIsWishlistAnimating(false), 520);
  };

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product || !reviewEligibility?.canSubmit || createReview.isPending) return;

    createReview.mutate(
      {
        productId: product.id,
        rating: Number(reviewRating),
        title: reviewTitle.trim() || undefined,
        body: reviewBody.trim(),
      },
      {
        onSuccess: async () => {
          setReviewRating("5");
          setReviewTitle("");
          setReviewBody("");
          await trpcUtils.reviews.eligibility.invalidate({ productId: product.id });
          toast.success("Merci. Votre avis sera publié après modération.");
        },
        onError: (error) => toast.error(error.message || "Impossible d’envoyer votre avis."),
      },
    );
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Product Image Gallery / Sticky Visual */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div
              data-testid="product-visual-motion"
              className="luxury-image-frame group relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl bg-gray-50/80 shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{
                transform: `translate3d(${productVisualMotion.translateX}px, ${productVisualMotion.translateY}px, 0) scale(${productVisualMotion.scale}) rotate(${productVisualMotion.rotate}deg)`,
                transformOrigin: "50% 42%",
                willChange: "transform",
              }}
            >
              <ProductImage
                fallbackUrl={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>

          {/* Product Info & Purchase Panel */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-8 animate-fade-in border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                {productBrandName}
              </div>
              <h1 className="mb-4 text-3xl font-light text-gray-900 sm:text-4xl md:text-5xl tracking-tight">
                {product.name}
              </h1>
              <p className="mb-6 text-base leading-7 text-gray-600 sm:text-lg">{product.description}</p>
              
              {publicProductVariants.length === 0 ? (
                <p className="text-base leading-7 text-gray-600">Référence en préparation : les formats et tarifs seront affichés prochainement.</p>
              ) : (
                <div data-testid="product-purchase-summary" className="flex items-baseline justify-between gap-4 py-2">
                  <div>
                    <div className="text-3xl font-light text-gray-900">
                      {selectedVariant ? formatPrice(selectedVariant.priceCents) : formatPrice(product.price)}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 font-medium">
                      {selectedVariant ? `${formatSize(selectedVariant.sizeMl)} · Format unique` : "Format 50 ml"} · Décant de luxe
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${selectedVariant && isVariantAvailable(selectedVariant) ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                    {selectedVariant && isVariantAvailable(selectedVariant) ? "✓ En stock" : "Rupture"}
                  </span>
                </div>
              )}

              {publicProductVariants.length > 0 && (
                <div className="mt-6 grid gap-3 border-t border-gray-100 pt-6 text-sm text-gray-600 sm:grid-cols-3">
                  <p><span className="font-medium text-gray-900">Format unique</span><br />Décant 50 ml</p>
                  {getConcentrationLabel(product.concentration) ? <p><span className="font-medium text-gray-900">Concentration</span><br />{getConcentrationLabel(product.concentration)}</p> : null}
                  <p><span className="font-medium text-gray-900">Livraison</span><br />France et Europe</p>
                </div>
              )}
            </div>

            {/* IMMERSIVE STORY & ORIGIN SECTION */}
            {productStory && (
              <section
                data-testid="product-story"
                className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50/60 via-stone-50/50 to-white p-6 sm:p-8 border border-amber-900/10 shadow-sm"
                aria-labelledby="product-story-title"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-900/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-900">
                    <BookOpen className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    Histoire & Origine
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    <span>{productStory.origin}</span>
                  </div>
                </div>

                <h2 id="product-story-title" className="text-2xl font-light text-gray-900 sm:text-3xl tracking-tight mb-4">
                  {productStory.title}
                </h2>

                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p className="font-normal text-gray-900">{productStory.story}</p>
                  <p className="text-gray-600">{productStory.detail}</p>
                </div>

                <div className="mt-6 pt-5 border-t border-amber-900/10 flex items-center justify-between text-xs text-gray-500">
                  <span>Maison Matière Première · Grasse, France</span>
                  {productStory.sourceUrl ? (
                    <a
                      href={productStory.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-amber-900 hover:underline inline-flex items-center gap-1.5"
                    >
                      Source : Matière Première
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <a
                      href="https://matiere-premiere.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-amber-900 hover:underline inline-flex items-center gap-1.5"
                    >
                      Source : Matière Première
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Olfactory Notes with interactive hover micro-animation */}
            <div ref={olfactoryNotesRef} className="mb-8 rounded-2xl border border-gray-200 p-6 sm:p-8 bg-gray-50/50">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-6">Pyramide Olfactive</h3>
              <div className="space-y-4">
                {[
                  { label: "Notes de tête", notes: product.topNotes, number: "01" },
                  { label: "Notes de cœur", notes: product.heartNotes, number: "02" },
                  { label: "Notes de fond", notes: product.baseNotes, number: "03" },
                ].filter((note) => (note.notes ?? "").trim().length > 0).map((note, index) => (
                  <div
                    key={note.label}
                    tabIndex={0}
                    className={`group/note relative flex gap-4 rounded-xl border-l-2 bg-white/60 p-4 transition-all duration-300 ease-out hover:translate-x-1.5 hover:bg-white hover:shadow-md hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 motion-reduce:translate-x-0 motion-reduce:transition-none ${
                      areOlfactoryNotesRevealed
                        ? "translate-y-0 border-gray-900 opacity-100"
                        : "translate-y-3 border-gray-200 opacity-0"
                    }`}
                    style={{ transitionDelay: `${getOlfactoryRevealDelay(index)}ms` }}
                  >
                    <span className="pt-0.5 text-xs font-semibold tracking-[0.18em] text-gray-400 transition-colors group-hover/note:text-gray-900" aria-hidden="true">
                      {note.number}
                    </span>
                    <div>
                      <h4 className="mb-1 text-xs uppercase tracking-widest text-gray-500 transition-colors duration-300 group-hover/note:text-gray-900 font-medium">
                        {note.label}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-800 font-light">{note.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <label htmlFor="product-quantity-select" className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Quantité
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Diminuer la quantité"
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span id="product-quantity-select" className="flex h-11 min-w-12 items-center justify-center px-3 text-sm font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock ?? quantity, quantity + 1))}
                    aria-label="Augmenter la quantité"
                    disabled={!selectedVariant || quantity >= selectedVariant.stock}
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || addVariantToCart.isPending || !selectedVariant || !isVariantAvailable(selectedVariant) || selectedVariant.stock < quantity}
                  aria-live="polite"
                  aria-atomic="true"
                  className={`relative min-h-12 w-full flex-1 overflow-hidden rounded-xl bg-gray-900 py-3 text-white font-light tracking-wide transition-all duration-300 hover:bg-gray-800 hover:shadow-lg sm:w-auto ${
                    showAddedFeedback ? "product-cart-success-state bg-emerald-700 hover:bg-emerald-700" : ""
                  }`}
                >
                  {showAddedFeedback && <span className="product-cart-success-sweep" aria-hidden="true" />}
                  {showAddedFeedback ? (
                    <span className="product-cart-success-content relative z-10 inline-flex items-center gap-2">
                      <span className="product-cart-success-check" aria-hidden="true">
                        <CircleCheck className="h-5 w-5" />
                      </span>
                      Ajouté au panier
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className={`relative z-10 w-5 h-5 ${isAddingToCart ? "cart-icon-bounce" : ""}`} />
                      <span className="relative z-10">{!selectedVariant || !isVariantAvailable(selectedVariant) || selectedVariant.stock < quantity ? "Indisponible" : getCartConfirmationLabel(isAddingToCart)}</span>
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={isWishlisted(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    } ${isWishlistAnimating ? 'wishlist-heart-pop' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <OfficialFragranceVideo productName={product.name} productSlug={product.slug} />

        <section
          aria-labelledby="product-reviews-title"
          className="mt-16 rounded-2xl border border-gray-200 bg-stone-50/60 px-6 py-10 sm:mt-20 sm:px-10"
        >
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Votre expérience compte</p>
          <h2 id="product-reviews-title" className="mt-3 text-center text-2xl font-light tracking-tight text-gray-900 sm:text-3xl">
            Avis clients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-gray-600 sm:text-base">
            Les avis sont publiés uniquement après un achat vérifié et une modération. Aucune note ni aucun témoignage n’est créé ou affiché sans provenir d’un client réel.
          </p>
          <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
            Avis authentiques · Commandes vérifiées
          </p>

          {areReviewsLoading ? (
            <p className="mt-8 text-center text-sm text-gray-500">Chargement des avis authentifiés…</p>
          ) : publishedReviews && publishedReviews.length > 0 ? (
            <div className="mx-auto mt-8 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
              {publishedReviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.authorName}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">Achat vérifié</p>
                    </div>
                    <p className="text-sm tracking-[0.08em] text-amber-700" aria-label={`${review.rating} étoiles sur 5`}>
                      {"★".repeat(review.rating)}<span className="text-stone-300">{"★".repeat(5 - review.rating)}</span>
                    </p>
                  </div>
                  {review.title && <h3 className="mt-5 text-base font-medium text-gray-900">{review.title}</h3>}
                  <p className="mt-3 text-sm leading-6 text-gray-600">{review.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-gray-600">
              Aucun avis approuvé n’est encore disponible pour ce parfum. Les premiers retours apparaîtront ici après achat vérifié et modération.
            </p>
          )}

          {isAuthenticated && reviewEligibility?.canSubmit && (
            <form onSubmit={handleReviewSubmit} className="mx-auto mt-10 max-w-2xl border-t border-stone-200 pt-8 text-left">
              <h3 className="text-lg font-medium text-gray-900">Partager votre expérience</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Votre commande a été vérifiée. Votre avis sera soumis à modération avant publication.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-[9rem_1fr]">
                <label className="text-sm font-medium text-gray-700" htmlFor="review-rating">Votre note</label>
                <select
                  id="review-rating"
                  value={reviewRating}
                  onChange={(event) => setReviewRating(event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900"
                >
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} étoile{rating > 1 ? "s" : ""} sur 5</option>)}
                </select>
                <label className="text-sm font-medium text-gray-700" htmlFor="review-title">Titre <span className="font-normal text-gray-500">(facultatif)</span></label>
                <input
                  id="review-title"
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                  maxLength={140}
                  className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
                <label className="text-sm font-medium text-gray-700" htmlFor="review-body">Votre avis</label>
                <textarea
                  id="review-body"
                  value={reviewBody}
                  onChange={(event) => setReviewBody(event.target.value)}
                  minLength={20}
                  maxLength={2000}
                  required
                  rows={5}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-6 text-gray-900"
                />
              </div>
              <Button type="submit" disabled={createReview.isPending} className="mt-6 min-h-11 bg-gray-900 text-white hover:bg-gray-800">
                {createReview.isPending ? "Envoi…" : "Soumettre mon avis"}
              </Button>
            </form>
          )}

          {isAuthenticated && reviewEligibility?.existingStatus === "pending" && (
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-gray-600">Votre avis a bien été reçu et attend sa modération.</p>
          )}

          {isAuthenticated && !reviewEligibility?.canSubmit && !reviewEligibility?.existingStatus && (
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-gray-600">Vous pourrez partager votre expérience après l’achat vérifié de ce parfum.</p>
          )}

          {!isAuthenticated && (
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-gray-600">Après votre achat, connectez-vous au compte utilisé lors de la commande pour déposer un avis vérifié.</p>
          )}
        </section>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-200 pt-16">
            <h2 className="mb-8 text-2xl font-light text-gray-900 sm:text-3xl tracking-tight">
              Parfums similaires dans la collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProducts.map((p: any, idx: number) => (
                <Link
                  key={p.id}
                  href={p.brand?.slug ? `/parfum/${p.brand.slug}/${p.slug}` : `/product/${p.id}`}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 transition-transform duration-500 group-hover:scale-[1.02]">
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
                  <p className="text-sm text-gray-500 mt-1">{formatPrice(p.price)} · 50 ml</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes cartIconBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .cart-icon-bounce {
          animation: cartIconBounce 0.4s ease-in-out;
        }
        @keyframes productCartSuccessState {
          0% { transform: translateY(1px) scale(0.975); }
          52% { transform: translateY(-1px) scale(1.018); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes productCartSuccessSweep {
          0% { opacity: 0; transform: translateX(-135%) skewX(-18deg); }
          28% { opacity: 0.42; }
          100% { opacity: 0; transform: translateX(170%) skewX(-18deg); }
        }

        @keyframes productCartSuccessContent {
          0% { opacity: 0; transform: translateY(5px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes productCartSuccessCheck {
          0% { opacity: 0; transform: scale(0.48) rotate(-14deg); }
          62% { opacity: 1; transform: scale(1.16) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }

        .product-cart-success-state {
          box-shadow: 0 14px 30px rgba(5, 90, 60, 0.24);
          animation: productCartSuccessState 440ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        .product-cart-success-sweep {
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.52), transparent);
          pointer-events: none;
          animation: productCartSuccessSweep 660ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .product-cart-success-content {
          animation: productCartSuccessContent 300ms cubic-bezier(0.23, 1, 0.32, 1) 55ms both;
        }

        .product-cart-success-check {
          display: inline-flex;
          animation: productCartSuccessCheck 420ms cubic-bezier(0.23, 1, 0.32, 1) 80ms both;
        }
        @media (prefers-reduced-motion: reduce) {
          .product-cart-success-state,
          .product-cart-success-sweep,
          .product-cart-success-content,
          .product-cart-success-check {
            animation: none !important;
            transform: none !important;
          }
        }
        @keyframes wishlistPop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.35); }
        }
        .wishlist-heart-pop {
          animation: wishlistPop 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
}
