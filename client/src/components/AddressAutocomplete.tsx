import { loadGoogleMaps } from "@/lib/googleMaps";
import { toDeliveryAddress, type DeliveryAddress } from "@shared/address-autocomplete";
import { LoaderCircle, MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState, type FocusEventHandler, type Ref } from "react";

type AddressSuggestion = {
  placeId: string;
  primaryText: string;
  secondaryText: string;
};

type AddressAutocompleteProps = {
  value: string;
  onValueChange: (value: string) => void;
  onAddressSelected: (address: DeliveryAddress) => void;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
};

/** Champ Places progressif : la saisie manuelle reste possible si le service est indisponible. */
export default function AddressAutocomplete({
  value,
  onValueChange,
  onAddressSelected,
  inputRef,
  onBlur,
  error,
  disabled = false,
}: AddressAutocompleteProps) {
  const listboxId = useId();
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPlacesReady, setIsPlacesReady] = useState(false);

  useEffect(() => {
    let active = true;
    void loadGoogleMaps()
      .then((googleMaps) => {
        if (!active) return;
        autocompleteService.current = new googleMaps.maps.places.AutocompleteService();
        placesService.current = new googleMaps.maps.places.PlacesService(document.createElement("div"));
        setIsPlacesReady(true);
      })
      .catch(() => {
        if (active) {
          setIsPlacesReady(false);
          setSuggestions([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const query = value.trim();
    if (!isPlacesReady || !autocompleteService.current || query.length < 3 || isSelecting) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => {
      autocompleteService.current?.getPlacePredictions(
        { input: query, types: ["address"] },
        (predictions, status) => {
          if (status !== window.google?.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
          } else {
            setSuggestions(predictions.slice(0, 5).map((prediction) => ({
              placeId: prediction.place_id,
              primaryText: prediction.structured_formatting?.main_text || prediction.description,
              secondaryText: prediction.structured_formatting?.secondary_text || "",
            })));
          }
          setIsLoading(false);
        },
      );
    }, 180);

    return () => {
      window.clearTimeout(timer);
      setIsLoading(false);
    };
  }, [isPlacesReady, isSelecting, value]);

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    if (!placesService.current) return;
    setIsSelecting(true);
    setSuggestions([]);
    setIsLoading(true);

    placesService.current.getDetails(
      { placeId: suggestion.placeId, fields: ["formatted_address", "address_components"] },
      (place, status) => {
        setIsLoading(false);
        setIsSelecting(false);
        if (status !== window.google?.maps.places.PlacesServiceStatus.OK || !place?.formatted_address || !place.address_components) return;

        const deliveryAddress = toDeliveryAddress(place.formatted_address, place.address_components);
        onValueChange(deliveryAddress.address);
        onAddressSelected(deliveryAddress);
      },
    );
  };

  return (
    <div className="relative">
      <label htmlFor="shippingAddress" className="mb-1 block text-sm text-gray-600">Adresse</label>
      <p className="mb-2 text-xs text-gray-500">Commencez à saisir votre adresse pour sélectionner une suggestion.</p>
      <div className="relative">
        <input
          id="shippingAddress"
          ref={inputRef}
          name="shippingAddress"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onBlur={onBlur}
          type="text"
          autoComplete="street-address"
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls={suggestions.length > 0 ? listboxId : undefined}
          aria-expanded={suggestions.length > 0}
          className="min-h-12 w-full rounded border border-gray-200 px-4 py-3 pr-11 text-base"
        />
        {isLoading ? <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" aria-label="Recherche d’adresses" /> : null}
      </div>
      {suggestions.length > 0 ? (
        <ul id={listboxId} role="listbox" aria-label="Suggestions d’adresses" className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded border border-gray-200 bg-white p-1 shadow-xl">
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className="flex min-h-12 w-full items-start gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-stone-50 focus:bg-stone-50 focus:outline-none"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-sm text-gray-900">{suggestion.primaryText}</span>
                  {suggestion.secondaryText ? <span className="block truncate text-xs text-gray-500">{suggestion.secondaryText}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
