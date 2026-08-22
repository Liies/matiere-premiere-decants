import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface LocalCartItem {
  productId: number;
  variantId: number;
  sizeMl: number;
  quantity: number;
  name: string;
  price: number;
}

export const CART_STORAGE_KEY = "matiere-premiere-cart";
export const CART_SYNC_KEY_STORAGE_KEY = "matiere-premiere-cart-sync-key";
export const CART_STORAGE_VERSION = 1;
export const LOCAL_CART_UPDATED_EVENT = "matiere-premiere-cart-updated";

type StoredCart = {
  version: typeof CART_STORAGE_VERSION;
  items: LocalCartItem[];
};

function isValidLocalCartItem(item: unknown): item is LocalCartItem {
  return typeof item === "object"
    && item !== null
    && Number.isInteger((item as LocalCartItem).productId)
    && Number.isInteger((item as LocalCartItem).variantId)
    && Number.isInteger((item as LocalCartItem).sizeMl)
    && Number.isInteger((item as LocalCartItem).quantity)
    && (item as LocalCartItem).quantity > 0
    && typeof (item as LocalCartItem).name === "string"
    && Number.isInteger((item as LocalCartItem).price);
}

function readStoredCart(value: string | null): LocalCartItem[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return [];
  const stored = parsed as Partial<StoredCart>;
  if (stored.version !== CART_STORAGE_VERSION || !Array.isArray(stored.items) || !stored.items.every(isValidLocalCartItem)) {
    return [];
  }
  return stored.items;
}

function notifyLocalCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LOCAL_CART_UPDATED_EVENT));
  }
}

function areSameCartItems(left: LocalCartItem[], right: LocalCartItem[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function useLocalCart() {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const validLines = readStoredCart(stored);
      setCartItems(validLines);
      if (stored && validLines.length === 0) localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const syncCart = () => {
      try {
        const nextCartItems = readStoredCart(localStorage.getItem(CART_STORAGE_KEY));
        setCartItems((currentCartItems) => (
          areSameCartItems(currentCartItems, nextCartItems) ? currentCartItems : nextCartItems
        ));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
        setCartItems((currentCartItems) => currentCartItems.length === 0 ? currentCartItems : []);
      }
    };
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) syncCart();
    };

    window.addEventListener(LOCAL_CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(LOCAL_CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const storedCart: StoredCart = { version: CART_STORAGE_VERSION, items: cartItems };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
        notifyLocalCartUpdated();
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (
    product: { id: number; name: string },
    variant: { id: number; sizeMl: number; priceCents: number },
    quantity: number,
    options: { announce?: boolean } = {},
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        variantId: variant.id,
        sizeMl: variant.sizeMl,
        quantity,
        name: product.name,
        price: variant.priceCents,
      }];
    });
    if (options.announce !== false) {
      toast.success(`${product.name} ajouté au panier`);
    }
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (variantId: number) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
    toast.success("Article supprimé du panier");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoaded,
  };
}
