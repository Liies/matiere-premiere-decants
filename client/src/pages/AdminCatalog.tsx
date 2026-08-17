import DashboardLayout from "@/components/DashboardLayout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Check, Package, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CatalogDraft = {
  name: string;
  description: string;
  price: string;
  volumeMl: string;
};

const EMPTY_DRAFT: CatalogDraft = { name: "", description: "", price: "", volumeMl: "50" };

export default function AdminCatalog() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.adminCatalog.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const updateProduct = trpc.adminCatalog.update.useMutation();
  const updateStock = trpc.adminInventory.updateStock.useMutation();
  const { data: pendingReviews, isLoading: areReviewsLoading } = trpc.reviews.pending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const moderateReview = trpc.reviews.moderate.useMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CatalogDraft>(EMPTY_DRAFT);
  const [stockDrafts, setStockDrafts] = useState<Record<number, string>>({});

  const selectedProduct = useMemo(
    () => products?.find((product) => product.id === selectedId) ?? products?.[0] ?? null,
    [products, selectedId],
  );
  const { data: variants, isLoading: areVariantsLoading } = trpc.adminInventory.variants.useQuery(
    { productId: selectedProduct?.id ?? 1 },
    { enabled: Boolean(selectedProduct) },
  );

  useEffect(() => {
    if (selectedProduct) {
      setSelectedId(selectedProduct.id);
      setDraft({
        name: selectedProduct.name,
        description: selectedProduct.description ?? "",
        price: (selectedProduct.price / 100).toFixed(2),
        volumeMl: String(selectedProduct.volumeMl ?? 50),
      });
    }
  }, [selectedProduct?.id]);

  useEffect(() => {
    if (!variants) return;
    setStockDrafts(Object.fromEntries(variants.map((variant) => [variant.id, String(variant.stock)])));
  }, [variants]);

  const updateDraft = (field: keyof CatalogDraft, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const normalizedPrice = Number(draft.price.replace(",", "."));
    const volumeMl = Number(draft.volumeMl);
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 1 || !Number.isInteger(volumeMl) || volumeMl < 1) {
      toast.error("Saisissez un prix d’au moins 1,00 € et une contenance entière positive.");
      return;
    }

    updateProduct.mutate(
      {
        id: selectedProduct.id,
        name: draft.name.trim(),
        description: draft.description.trim(),
        price: Math.round(normalizedPrice * 100),
        volumeMl,
      },
      {
        onSuccess: async () => {
          await Promise.all([
            utils.adminCatalog.list.invalidate(),
            utils.products.list.invalidate(),
            utils.products.getById.invalidate({ id: selectedProduct.id }),
          ]);
          toast.success("Produit mis à jour");
        },
        onError: (error) => toast.error(error.message || "La mise à jour a échoué"),
      },
    );
  };

  const handleModeration = (id: number, status: "published" | "rejected") => {
    moderateReview.mutate(
      { id, status },
      {
        onSuccess: async () => {
          await utils.reviews.pending.invalidate();
          toast.success(status === "published" ? "Avis publié" : "Avis refusé");
        },
        onError: (error) => toast.error(error.message || "La modération a échoué"),
      },
    );
  };

  const handleStockSave = (variantId: number) => {
    if (!selectedProduct) return;
    const stock = Number(stockDrafts[variantId]);
    if (!Number.isInteger(stock) || stock < 0 || stock > 10_000) {
      toast.error("Saisissez un stock entier compris entre 0 et 10 000.");
      return;
    }

    updateStock.mutate(
      { variantId, stock },
      {
        onSuccess: async ({ delta }) => {
          await Promise.all([
            utils.adminInventory.variants.invalidate({ productId: selectedProduct.id }),
            utils.products.list.invalidate(),
            utils.catalog.list.invalidate(),
          ]);
          toast.success(delta === 0 ? "Stock inchangé" : "Stock mis à jour");
        },
        onError: (error) => toast.error(error.message || "La mise à jour du stock a échoué"),
      },
    );
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <p className="mb-4 text-gray-600">Accès administrateur requis</p>
            <a href="/" className="inline-flex min-h-11 items-center bg-gray-900 px-4 text-sm text-white transition hover:bg-gray-800">Retour à la boutique</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-6xl space-y-8 px-1 py-4 sm:px-4 sm:py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Administration</p>
            <h1 className="mt-2 text-3xl font-light text-gray-900 sm:text-4xl">Gestion du catalogue</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Modifiez le nom, la description, le prix et la contenance affichés à vos clients.</p>
          </div>
          <a href="/products" className="inline-flex min-h-11 items-center justify-center border border-gray-300 px-4 text-sm text-gray-700 transition hover:border-gray-900 hover:text-gray-900">Voir la boutique</a>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Chargement du catalogue…</p>
        ) : !products || products.length === 0 ? (
          <Card className="p-8 text-center text-gray-600">Aucun produit à administrer.</Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)]">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-gray-200 px-5 py-4">
                <p className="text-sm font-medium text-gray-900">Produits</p>
                <p className="mt-1 text-xs text-gray-500">Sélectionnez un parfum à modifier.</p>
              </div>
              <div className="max-h-[28rem] overflow-y-auto p-2">
                {products.map((product) => {
                  const selected = selectedProduct?.id === product.id;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedId(product.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition ${selected ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{product.name}</span>
                        <span className={`mt-1 block text-xs ${selected ? "text-gray-300" : "text-gray-500"}`}>{product.volumeMl ?? 50} ml · €{(product.price / 100).toFixed(2)}</span>
                      </span>
                      {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Package className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              {selectedProduct && (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="border-b border-gray-200 pb-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Produit sélectionné</p>
                    <h2 className="mt-2 text-2xl font-light text-gray-900">{selectedProduct.name}</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catalog-product-name">Nom du produit</Label>
                    <Input id="catalog-product-name" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} maxLength={255} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catalog-product-description">Description</Label>
                    <Textarea id="catalog-product-description" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} rows={8} maxLength={4000} required />
                    <p className="text-xs text-gray-500">{draft.description.length}/4000 caractères</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="catalog-product-price">Prix affiché (€)</Label>
                      <Input id="catalog-product-price" inputMode="decimal" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="catalog-product-volume">Contenance (ml)</Label>
                      <Input id="catalog-product-volume" type="number" min="1" max="1000" value={draft.volumeMl} onChange={(event) => updateDraft("volumeMl", event.target.value)} required />
                    </div>
                  </div>

                  <section className="space-y-4 border-t border-gray-200 pt-5" aria-labelledby="catalog-stock-title">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Inventaire</p>
                      <h3 id="catalog-stock-title" className="mt-2 text-lg font-medium text-gray-900">Stock disponible</h3>
                      <p className="mt-1 text-xs text-gray-500">Chaque ajustement est enregistré dans le journal des mouvements de stock.</p>
                    </div>

                    {areVariantsLoading ? (
                      <p className="text-sm text-gray-600">Chargement du stock…</p>
                    ) : !variants || variants.length === 0 ? (
                      <p className="text-sm text-gray-600">Aucune variante active pour ce parfum.</p>
                    ) : (
                      <div className="divide-y divide-gray-200 border-y border-gray-200">
                        {variants.map((variant) => (
                          <div key={variant.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_minmax(8rem,10rem)_auto] sm:items-end">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{variant.sizeMl} ml</p>
                              <p className="mt-1 text-xs text-gray-500">Stock actuel : {variant.stock} unité{variant.stock === 1 ? "" : "s"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`catalog-variant-stock-${variant.id}`}>Nouveau stock</Label>
                              <Input
                                id={`catalog-variant-stock-${variant.id}`}
                                type="number"
                                min="0"
                                max="10000"
                                step="1"
                                inputMode="numeric"
                                value={stockDrafts[variant.id] ?? ""}
                                onChange={(event) => setStockDrafts((previous) => ({ ...previous, [variant.id]: event.target.value }))}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleStockSave(variant.id)}
                              disabled={updateStock.isPending}
                              className="min-h-11"
                            >
                              {updateStock.isPending ? "Mise à jour…" : "Mettre à jour"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-500">Les prix sont enregistrés en centimes côté serveur.</p>
                    <Button type="submit" disabled={updateProduct.isPending} className="min-h-11 bg-gray-900 text-white hover:bg-gray-800">
                      <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                      {updateProduct.isPending ? "Enregistrement…" : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        )}

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Confiance client</p>
              <h2 className="mt-2 text-2xl font-light text-gray-900">Avis à modérer</h2>
            </div>
            <p className="text-xs text-gray-500">Seuls les avis liés à une commande vérifiée sont proposés ici.</p>
          </div>

          {areReviewsLoading ? (
            <p className="py-6 text-sm text-gray-600">Chargement des avis…</p>
          ) : !pendingReviews || pendingReviews.length === 0 ? (
            <p className="py-6 text-sm text-gray-600">Aucun avis en attente de modération.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingReviews.map(({ review, productName, authorName }) => (
                <article key={review.id} className="py-6 first:pt-6 last:pb-0">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{productName} · {review.rating}/5</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">Achat vérifié · {authorName || "Client"}</p>
                      {review.title && <h3 className="mt-4 text-base font-medium text-gray-900">{review.title}</h3>}
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{review.body}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="button" size="sm" onClick={() => handleModeration(review.id, "published")} disabled={moderateReview.isPending} className="bg-gray-900 text-white hover:bg-gray-800">Publier</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => handleModeration(review.id, "rejected")} disabled={moderateReview.isPending}>Refuser</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </section>
    </DashboardLayout>
  );
}
