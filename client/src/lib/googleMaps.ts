const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
const GOOGLE_MAPS_SCRIPT_ID = "matiere-premiere-google-maps";

let googleMapsPromise: Promise<typeof google> | null = null;

/** Charge une seule fois le SDK Google Maps utilisé par les cartes et Places. */
export function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps indisponible")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Google Maps indisponible"));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
