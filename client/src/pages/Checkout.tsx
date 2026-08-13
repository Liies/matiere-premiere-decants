import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link, useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import DeliveryLocationMap from "@/components/DeliveryLocationMap";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDeliveryEligibility } from "@shared/delivery-zones";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Le nom est requis"),
  customerEmail: z.string().email("Email invalide"),
  shippingAddress: z.string().min(1, "L'adresse est requise"),
  shippingCity: z.string().min(1, "La ville est requise"),
  shippingPostalCode: z.string().min(1, "Le code postal est requis"),
  shippingCountry: z.string().min(1, "Le pays est requis"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: cartItems } = trpc.cart.getItems.useQuery();
  const createOrder = trpc.orders.create.useMutation();
  const { data: savedDeliveryAddress, isLoading: isSavedAddressLoading } = trpc.profile.getDeliveryAddress.useQuery();
  const saveDeliveryAddress = trpc.profile.saveDeliveryAddress.useMutation();
  const [orderCreated, setOrderCreated] = useState<{ orderNumber: string; orderId: number } | null>(null);
  const [saveAddressForLater, setSaveAddressForLater] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerEmail: user?.email || "",
    },
  });
  const shippingAddress = watch("shippingAddress") || "";
  const shippingCity = watch("shippingCity") || "";
  const shippingPostalCode = watch("shippingPostalCode") || "";
  const shippingCountry = watch("shippingCountry") || "";
  const shippingAddressField = register("shippingAddress");
  const hasCompleteDeliveryAddress = Boolean(shippingAddress && shippingCity && shippingPostalCode && shippingCountry);
  const deliveryEligibility = hasCompleteDeliveryAddress
    ? getDeliveryEligibility({ country: shippingCountry, postalCode: shippingPostalCode })
    : null;

  const applySuggestedAddress = (address: { address: string; city: string; postalCode: string; country: string }) => {
    setValue("shippingAddress", address.address, { shouldDirty: true, shouldValidate: true });
    setValue("shippingCity", address.city, { shouldDirty: true, shouldValidate: true });
    setValue("shippingPostalCode", address.postalCode, { shouldDirty: true, shouldValidate: true });
    setValue("shippingCountry", address.country, { shouldDirty: true, shouldValidate: true });
  };

  const applySavedAddress = () => {
    if (!savedDeliveryAddress) return;
    applySuggestedAddress({
      address: savedDeliveryAddress.address,
      city: savedDeliveryAddress.city,
      postalCode: savedDeliveryAddress.postalCode,
      country: savedDeliveryAddress.country,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Veuillez vous connecter pour continuer</p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Se connecter
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-light text-gray-900 mb-2">Commande confirmée !</h2>
            <p className="text-gray-600 mb-2">
              Numéro de commande: <span className="font-medium">{orderCreated.orderNumber}</span>
            </p>
            <p className="text-gray-600 mb-6">
              Un email de confirmation a été envoyé à votre adresse.
            </p>
            <Link href="/account">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Voir mes commandes
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalAmount = (cartItems || []).reduce(
    (sum, item) => sum + (item.variant?.priceCents ?? item.product?.price ?? 0) * item.quantity,
    0
  );

  const submitOrder = (data: CheckoutFormData) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      ...(item.variantId ? { variantId: item.variantId } : {}),
    }));

    createOrder.mutate(
      {
        ...data,
        items,
        totalAmount,
      },
      {
        onSuccess: (result) => {
          setOrderCreated({
            orderNumber: result.orderNumber,
            orderId: result.orderId,
          });
          toast.success("Commande créée avec succès !");
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de la création de la commande");
        },
      }
    );
  };

  const onSubmit = (data: CheckoutFormData) => {
    const eligibility = getDeliveryEligibility({ country: data.shippingCountry, postalCode: data.shippingPostalCode });
    if (!eligibility.eligible) {
      toast.error(eligibility.reason || "Cette adresse est hors zone de livraison.");
      return;
    }
    if (!saveAddressForLater) {
      submitOrder(data);
      return;
    }
    saveDeliveryAddress.mutate({
      address: data.shippingAddress,
      city: data.shippingCity,
      postalCode: data.shippingPostalCode,
      country: data.shippingCountry,
    }, {
      onSuccess: () => {
        toast.success("Adresse enregistrée dans votre profil.");
        submitOrder(data);
      },
      onError: (error) => toast.error(error.message || "Impossible d’enregistrer l’adresse."),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Content */}
              <main className="flex-1 py-8 sm:py-12">

        <div className="container max-w-4xl">
          <h2 className="mb-6 text-3xl font-light text-gray-900 sm:mb-8 sm:text-4xl">Finaliser votre commande</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-light text-gray-900 mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
                      <input
                        {...register("customerName")}
                        type="text"
                        className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 text-base"
                      />
                      {errors.customerName && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        {...register("customerEmail")}
                        type="email"
                        className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 text-base"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-light text-gray-900 mb-4">Adresse de livraison</h3>
                  <div className="space-y-4">
                    {savedDeliveryAddress ? (
                      <div className="flex flex-col gap-3 rounded border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">
                          <span className="block font-medium text-gray-900">Adresse enregistrée</span>
                          {savedDeliveryAddress.address}, {savedDeliveryAddress.postalCode} {savedDeliveryAddress.city}, {savedDeliveryAddress.country}
                        </p>
                        <Button type="button" variant="outline" className="min-h-11 border-gray-300 bg-white" onClick={applySavedAddress}>
                          Utiliser cette adresse
                        </Button>
                      </div>
                    ) : isSavedAddressLoading ? <p className="text-sm text-gray-500">Chargement de votre adresse enregistrée…</p> : null}
                    <AddressAutocomplete
                      value={shippingAddress}
                      inputRef={shippingAddressField.ref}
                      onBlur={shippingAddressField.onBlur}
                      onValueChange={(address) => setValue("shippingAddress", address, { shouldDirty: true, shouldValidate: true })}
                      onAddressSelected={applySuggestedAddress}
                      error={errors.shippingAddress?.message}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Ville</label>
                        <input
                          {...register("shippingCity")}
                          type="text"
                          className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 text-base"
                        />
                        {errors.shippingCity && (
                          <p className="text-red-600 text-sm mt-1">{errors.shippingCity.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Code postal</label>
                        <input
                          {...register("shippingPostalCode")}
                          type="text"
                          className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 text-base"
                        />
                        {errors.shippingPostalCode && (
                          <p className="text-red-600 text-sm mt-1">{errors.shippingPostalCode.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Pays</label>
                      <input
                        {...register("shippingCountry")}
                        type="text"
                        className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 text-base"
                      />
                      {errors.shippingCountry && (
                        <p className="text-red-600 text-sm mt-1">{errors.shippingCountry.message}</p>
                      )}
                    </div>
                    {deliveryEligibility ? (
                      <div className={`rounded border px-4 py-3 text-sm ${deliveryEligibility.eligible ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800"}`} role="status">
                        {deliveryEligibility.eligible
                          ? "Cette adresse se trouve dans notre zone de livraison."
                          : deliveryEligibility.reason}
                      </div>
                    ) : null}
                    {hasCompleteDeliveryAddress && deliveryEligibility?.eligible ? (
                      <>
                        <DeliveryLocationMap
                          address={shippingAddress}
                          city={shippingCity}
                          postalCode={shippingPostalCode}
                          country={shippingCountry}
                        />
                        <label className="flex min-h-11 items-start gap-3 rounded border border-gray-200 p-3 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={saveAddressForLater}
                            onChange={(event) => setSaveAddressForLater(event.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300"
                          />
                          <span>Enregistrer cette adresse dans mon profil pour mes prochaines commandes.</span>
                        </label>
                      </>
                    ) : null}
                  </div>
                </Card>

                <Button
                  type="submit"
                  disabled={createOrder.isPending || saveDeliveryAddress.isPending || deliveryEligibility?.eligible === false}
                  className="min-h-12 w-full bg-gray-900 py-3 text-white hover:bg-gray-800"
                >
                  {createOrder.isPending || saveDeliveryAddress.isPending ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="space-y-4 p-4 lg:sticky lg:top-4 sm:p-6">
                <h3 className="text-lg font-light text-gray-900">Résumé de la commande</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900">
                        €{(((item.variant?.priceCents ?? item.product?.price ?? 0) * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-light text-gray-900">Total</span>
                    <span className="text-xl font-light text-gray-900">
                      €{(totalAmount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 mt-12">
        <div className="container text-center text-sm text-gray-600">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
