export const CART_CONFIRMATION_DURATION_MS = 1600;

export function getCartConfirmationLabel(isConfirmed: boolean) {
  return isConfirmed ? "Ajouté au panier" : "Ajouter au panier";
}
