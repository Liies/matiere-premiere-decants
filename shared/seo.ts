export const DEFAULT_SITE_NAME = "Matière Première";
export const DEFAULT_SITE_URL = typeof window !== "undefined" 
  ? window.location.origin 
  : "https://matiere50ml-okjlk7qk.manus.space";

export function truncateDescription(text: string, maxLength = 155): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace).trim() + "…";
  }
  return truncated.trim() + "…";
}
