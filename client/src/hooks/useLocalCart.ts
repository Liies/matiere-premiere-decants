import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface LocalCartItem {
  productId: number;
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
        setCartItems(JSON.parse(stored));
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
    product: { id: number; name: string; price: number },
    quantity: number,
    options: { announce?: boolean } = {},
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, name: product.name, price: product.price }];
    });
    if (options.announce !== false) {
      toast.success(`${product.name} ajouté au panier`);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
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
