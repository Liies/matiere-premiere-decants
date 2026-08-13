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

export function useLocalCart() {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        const validLines = Array.isArray(parsed)
          ? parsed.filter((item): item is LocalCartItem => (
            Number.isInteger(item?.productId)
            && Number.isInteger(item?.variantId)
            && Number.isInteger(item?.sizeMl)
            && Number.isInteger(item?.quantity)
            && item.quantity > 0
            && typeof item?.name === "string"
            && Number.isInteger(item?.price)
          ))
          : [];
        setCartItems(validLines);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
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
