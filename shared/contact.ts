import { z } from "zod";

export const CONTACT_SUBJECTS = ["commande", "produit", "livraison", "autre"] as const;

export const CONTACT_SUBJECT_LABELS: Record<(typeof CONTACT_SUBJECTS)[number], string> = {
  commande: "Question sur une commande",
  produit: "Question sur un produit",
  livraison: "Livraison et retours",
  autre: "Autre",
};

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(80),
  email: z.string().trim().email("Adresse email invalide").max(160),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(4000),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type ContactSubject = ContactMessage["subject"];
