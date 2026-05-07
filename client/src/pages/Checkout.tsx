import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Leaf, CheckCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [orderCreated, setOrderCreated] = useState<{ orderNumber: string; orderId: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerEmail: user?.email || "",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-gray-200">
          <div className="container flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
              <Leaf className="w-6 h-6 text-gray-900" />
              <h1 className="text-2xl font-light tracking-wider text-gray-900">
                Matière Première
              </h1>
            </Link>
          </div>
        </header>
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
        <header className="border-b border-gray-200">
          <div className="container flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
              <Leaf className="w-6 h-6 text-gray-900" />
              <h1 className="text-2xl font-light tracking-wider text-gray-900">
                Matière Première
              </h1>
            </Link>
          </div>
        </header>
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
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const onSubmit = (data: CheckoutFormData) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product?.price || 0,
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Leaf className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-light tracking-wider text-gray-900">
              Matière Première
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-light text-gray-900 mb-8">Finaliser votre commande</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-light text-gray-900 mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
                      <input
                        {...register("customerName")}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded"
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
                        className="w-full px-4 py-2 border border-gray-200 rounded"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-light text-gray-900 mb-4">Adresse de livraison</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Adresse</label>
                      <input
                        {...register("shippingAddress")}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded"
                      />
                      {errors.shippingAddress && (
                        <p className="text-red-600 text-sm mt-1">{errors.shippingAddress.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Ville</label>
                        <input
                          {...register("shippingCity")}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-200 rounded"
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
                          className="w-full px-4 py-2 border border-gray-200 rounded"
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
                        className="w-full px-4 py-2 border border-gray-200 rounded"
                      />
                      {errors.shippingCountry && (
                        <p className="text-red-600 text-sm mt-1">{errors.shippingCountry.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
                >
                  {createOrder.isPending ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4 space-y-4">
                <h3 className="text-lg font-light text-gray-900">Résumé de la commande</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900">
                        €{(((item.product?.price || 0) * item.quantity) / 100).toFixed(2)}
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
