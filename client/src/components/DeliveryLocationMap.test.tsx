/** @vitest-environment jsdom */

import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mapsMocks = vi.hoisted(() => ({
  loadGoogleMaps: vi.fn(),
  geocode: vi.fn(),
  setCenter: vi.fn(),
  setZoom: vi.fn(),
  markerSetMap: vi.fn(),
}));

vi.mock("@/lib/googleMaps", () => ({ loadGoogleMaps: mapsMocks.loadGoogleMaps }));

import DeliveryLocationMap from "./DeliveryLocationMap";

describe("DeliveryLocationMap", () => {
  it("géocode l’adresse complète puis centre une carte et son marqueur", async () => {
    const mapInstance = { setCenter: mapsMocks.setCenter, setZoom: mapsMocks.setZoom };
    const location = { lat: () => 48.875, lng: () => 2.362 };
    mapsMocks.geocode.mockImplementation((_request, callback) => callback([
      { geometry: { location } },
    ], "OK"));
    mapsMocks.loadGoogleMaps.mockResolvedValue({
      maps: {
        Map: vi.fn(function () { return mapInstance; }),
        Geocoder: vi.fn(function () { return { geocode: mapsMocks.geocode }; }),
        Marker: vi.fn(function () { return { setMap: mapsMocks.markerSetMap }; }),
      },
    });

    render(<DeliveryLocationMap address="27 Rue du Maroc" postalCode="75019" city="Paris" country="France" />);

    await waitFor(() => expect(mapsMocks.geocode).toHaveBeenCalledWith(
      { address: "27 Rue du Maroc, 75019, Paris, France" },
      expect.any(Function),
    ));
    expect(mapsMocks.setCenter).toHaveBeenCalledWith(location);
    expect(mapsMocks.setZoom).toHaveBeenCalledWith(16);
  });
});
