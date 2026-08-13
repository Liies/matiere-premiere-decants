import { loadGoogleMaps } from "@/lib/googleMaps";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DeliveryLocationMapProps = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

/** Carte légère de confirmation : le marqueur suit l’adresse de livraison courante. */
export default function DeliveryLocationMap({ address, city, postalCode, country }: DeliveryLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const formattedAddress = [address, postalCode, city, country].filter(Boolean).join(", ");

  useEffect(() => {
    let active = true;
    if (!mapContainer.current || !formattedAddress) return;

    void loadGoogleMaps()
      .then((googleMaps) => {
        if (!active || !mapContainer.current) return;
        map.current ??= new googleMaps.maps.Map(mapContainer.current, {
          center: { lat: 46.6034, lng: 1.8883 },
          zoom: 5,
          disableDefaultUI: true,
          gestureHandling: "cooperative",
          keyboardShortcuts: false,
        });
        const geocoder = new googleMaps.maps.Geocoder();
        geocoder.geocode({ address: formattedAddress }, (results, geocodeStatus) => {
          if (!active) return;
          const result = results?.[0];
          if (geocodeStatus !== "OK" || !result) {
            setStatus("unavailable");
            return;
          }
          const location = result.geometry.location;
          map.current?.setCenter(location);
          map.current?.setZoom(16);
          marker.current?.setMap(null);
          marker.current = new googleMaps.maps.Marker({
            map: map.current,
            position: location,
            title: "Adresse de livraison",
          });
          setStatus("ready");
        });
      })
      .catch(() => {
        if (active) setStatus("unavailable");
      });

    return () => {
      active = false;
    };
  }, [formattedAddress]);

  return (
    <section aria-labelledby="delivery-map-title" className="overflow-hidden rounded border border-stone-200 bg-stone-50">
      <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-3">
        <MapPin className="h-4 w-4 text-stone-700" aria-hidden="true" />
        <div>
          <h4 id="delivery-map-title" className="text-sm font-medium text-gray-900">Emplacement de livraison</h4>
          <p className="text-xs text-gray-500">Vérifiez visuellement le point de livraison avant de confirmer.</p>
        </div>
      </div>
      {status === "unavailable" ? (
        <p className="px-4 py-5 text-sm text-gray-600">La carte est momentanément indisponible. Votre adresse reste modifiable.</p>
      ) : (
        <div ref={mapContainer} className="h-56 w-full" aria-label="Carte de confirmation de l’adresse de livraison" />
      )}
      {status === "loading" ? <p className="border-t border-stone-200 px-4 py-2 text-xs text-gray-500">Localisation de l’adresse…</p> : null}
    </section>
  );
}
