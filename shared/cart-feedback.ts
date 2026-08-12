export const CART_CONFIRMATION_DURATION_MS = 1600;

export type CartFeedbackProduct = {
  id: number | string;
  name: string;
};

export function getCartFeedbackKey(product: CartFeedbackProduct) {
  return `${product.id}::${product.name.trim().toLocaleLowerCase("fr-FR")}`;
}

export function getCartConfirmationLabel(isConfirmed: boolean) {
  return isConfirmed ? "Ajouté au panier" : "Ajouter au panier";
}
