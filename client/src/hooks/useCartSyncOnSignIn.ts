import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CART_STORAGE_KEY, CART_SYNC_KEY_STORAGE_KEY, useLocalCart } from "@/hooks/useLocalCart";

function getOrCreateSyncKey() {
  const storedKey = window.localStorage.getItem(CART_SYNC_KEY_STORAGE_KEY);
  if (storedKey) return storedKey;

  const syncKey = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(CART_SYNC_KEY_STORAGE_KEY, syncKey);
  return syncKey;
}

export function useCartSyncOnSignIn() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { cartItems, clearCart, isLoaded } = useLocalCart();
  const attemptedSyncKey = useRef<string | null>(null);
  const syncGuestCart = trpc.cart.syncGuestCart.useMutation();

  useEffect(() => {
    if (!isAuthenticated || !isLoaded || cartItems.length === 0 || syncGuestCart.isPending) return;

    const syncKey = getOrCreateSyncKey();
    if (attemptedSyncKey.current === syncKey) return;
    attemptedSyncKey.current = syncKey;

    syncGuestCart.mutate(
      {
        syncKey,
        items: cartItems.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
      },
      {
        onSuccess: async (result) => {
          clearCart();
          window.localStorage.removeItem(CART_STORAGE_KEY);
          window.localStorage.removeItem(CART_SYNC_KEY_STORAGE_KEY);
          attemptedSyncKey.current = null;
          await utils.cart.getItems.invalidate();
          toast.success(
            result.alreadySynced
              ? "Votre panier a déjà été synchronisé avec votre compte."
              : "Votre panier invité a été synchronisé avec votre compte.",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Votre panier invité est conservé : la synchronisation pourra être réessayée.");
        },
      },
    );
  }, [cartItems, clearCart, isAuthenticated, isLoaded, syncGuestCart, utils]);
}
