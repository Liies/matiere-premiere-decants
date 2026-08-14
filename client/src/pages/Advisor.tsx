import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Leaf, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AIChatBox } from "@/components/AIChatBox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocalCart } from "@/hooks/useLocalCart";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSEO } from "@/hooks/useSEO";
import { formatPrice } from "@shared/price";

type AdvisorRecommendation = {
  productSlug: string;
  reason: string;
  suggestedSizeMl: number;
};

type AdvisorMessage = {
  role: "user" | "assistant";
  content: string;
};

type RecommendationVariant = {
  id: number;
  sizeMl: number;
  priceCents: number;
  stock: number;
};

const suggestedPrompts = [
  "Un parfum pour l'hiver",
  "Quelque chose de boisé et discret",
  "Un oud pour débuter",
  "Une vanille pas trop sucrée",
];

export default function Advisor() {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [recommendations, setRecommendations] = useState<AdvisorRecommendation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: products } = trpc.products.list.useQuery();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useLocalCart();
  const addVariantToCart = trpc.cart.addVariant.useMutation();

  useSEO({
    title: "Conseiller olfactif — Matière Première",
    description: "Décrivez vos envies et recevez une sélection de décants issue de notre catalogue Matière Première.",
  });

  const recommendationCards = useMemo(() => {
    if (!products) return [];
    return recommendations.flatMap((recommendation) => {
      const product = products.find((item) => item.slug === recommendation.productSlug);
      if (!product) return [];
      const variant = product.variants?.find((item: RecommendationVariant) => item.sizeMl === recommendation.suggestedSizeMl && item.stock > 0)
        ?? product.variants?.find((item: RecommendationVariant) => item.stock > 0);
      if (!variant) return [];
      return [{ product, variant, reason: recommendation.reason }];
    });
  }, [products, recommendations]);

  const handleSendMessage = (content: string) => {
    const nextMessages: AdvisorMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setErrorMessage(null);

    advisorMutation.mutate({ messages: nextMessages }, {
      onSuccess: (response) => {
        setMessages((current) => [...current, { role: "assistant", content: response.reply }]);
        setRecommendations(response.recommendations);
      },
      onError: (error) => {
        setErrorMessage(error.message || "Le conseiller est momentanément indisponible.");
      },
    });
  };

  const advisorMutation = trpc.advisor.ask.useMutation();

  const addRecommendationToCart = (product: NonNullable<typeof products>[number], variant: NonNullable<NonNullable<typeof products>[number]["variants"]>[number]) => {
    if (isAuthenticated) {
      addVariantToCart.mutate({ variantId: variant.id, quantity: 1 }, {
        onSuccess: () => toast.success(`${product.name} a été ajouté au panier.`),
        onError: (error) => toast.error(error.message || "Impossible d'ajouter ce format au panier."),
      });
      return;
    }
    addToCart(product, variant, 1);
    toast.success(`${product.name} a été ajouté au panier.`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="container py-10 sm:py-14">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
            <Sparkles className="h-5 w-5 text-gray-700" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-gray-500">Conseil personnalisé</p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-5xl">Trouvons le parfum qui vous ressemble</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Parlez-nous d'une matière, d'un moment ou d'une sensation. Le conseiller rapproche vos envies des parfums réellement disponibles dans notre collection.
          </p>
        </section>

        <section className="mx-auto mt-9 max-w-4xl" aria-label="Conversation avec le conseiller olfactif">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={advisorMutation.isPending}
            height="520px"
            placeholder="Ex. Je cherche un parfum boisé, discret et confortable…"
            emptyStateMessage="Décrivez le parfum que vous aimeriez porter."
            suggestedPrompts={suggestedPrompts}
          />
          <p className="mt-3 text-center text-xs leading-5 text-gray-500">
            Les recommandations sont générées automatiquement à titre indicatif et correspondent uniquement aux références disponibles du catalogue.
          </p>
        </section>

        {errorMessage && (
          <section className="mx-auto mt-6 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-5" role="alert">
            <p className="text-sm text-amber-950">{errorMessage}</p>
            <Link href="/products" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-amber-950 underline underline-offset-4">
              Parcourir le catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        )}

        {messages.some((message) => message.role === "assistant") && !advisorMutation.isPending && recommendationCards.length === 0 && !errorMessage && (
          <section className="mx-auto mt-8 max-w-4xl rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <Leaf className="mx-auto h-7 w-7 text-gray-400" aria-hidden="true" />
            <p className="mt-3 text-sm text-gray-600">Aucune référence précise ne se dégage encore. Vous pouvez préciser une matière, une intensité ou l'occasion.</p>
          </section>
        )}

        {recommendationCards.length > 0 && (
          <section className="mx-auto mt-10 max-w-5xl" aria-labelledby="advisor-recommendations-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Sélection vérifiée</p>
                <h2 id="advisor-recommendations-title" className="mt-2 text-2xl font-light sm:text-3xl">Les parfums à explorer</h2>
              </div>
              <Link href="/products" className="inline-flex min-h-11 items-center text-sm text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline">Voir tout le catalogue</Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendationCards.map(({ product, variant, reason }) => {
                const productPath = product.brand?.slug ? `/parfum/${product.brand.slug}/${product.slug}` : `/product/${product.id}`;
                return (
                  <Card key={`${product.id}-${variant.id}`} className="flex h-full flex-col overflow-hidden border-gray-200 p-5 shadow-sm">
                    <Link href={productPath} className="group block">
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                        ) : (
                          <Leaf className="h-12 w-12 text-gray-300" aria-hidden="true" />
                        )}
                      </div>
                      <h3 className="mt-4 text-xl font-light text-gray-900">{product.name}</h3>
                    </Link>
                    <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{reason}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <span className="text-sm text-gray-700">Décant {variant.sizeMl} ml · {formatPrice(variant.priceCents)}</span>
                      <Button
                        type="button"
                        size="sm"
                        disabled={addVariantToCart.isPending}
                        onClick={() => addRecommendationToCart(product, variant)}
                        className="min-h-10 bg-gray-900 text-white hover:bg-gray-800"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                        Ajouter
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
