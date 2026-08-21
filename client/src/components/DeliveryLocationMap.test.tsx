/** @vitest-environment jsdom */

import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  const mapInstance = { setCenter: mapsMocks.setCenter, setZoom: mapsMocks.setZoom };
  const location = { lat: () => 48.875, lng: () => 2.362 };

  beforeEach(() => {
    mapsMocks.loadGoogleMaps.mockReset();
    mapsMocks.geocode.mockReset();
    mapsMocks.setCenter.mockReset();
    mapsMocks.setZoom.mockReset();
    mapsMocks.markerSetMap.mockReset();
    delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
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
  });

  afterEach(() => cleanup());

  it("géocode l’adresse complète puis centre une carte et son marqueur", async () => {
    render(<DeliveryLocationMap address="27 Rue du Maroc" postalCode="75019" city="Paris" country="France" />);

    await waitFor(() => expect(mapsMocks.geocode).toHaveBeenCalledWith(
      { address: "27 Rue du Maroc, 75019, Paris, France" },
      expect.any(Function),
    ));
    expect(mapsMocks.setCenter).toHaveBeenCalledWith(location);
    expect(mapsMocks.setZoom).toHaveBeenCalledWith(16);
  });

  it("diffère le chargement de Maps jusqu’à l’approche de la carte dans le viewport", async () => {
    let onIntersect: ((entries: Array<{ isIntersecting: boolean }>) => void) | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
        onIntersect = callback;
      }
      observe = observe;
      disconnect = disconnect;
    }
    Object.defineProperty(window, "IntersectionObserver", { configurable: true, value: MockIntersectionObserver });

    render(<DeliveryLocationMap address="27 Rue du Maroc" postalCode="75019" city="Paris" country="France" />);

    expect(observe).toHaveBeenCalledTimes(1);
    expect(mapsMocks.loadGoogleMaps).not.toHaveBeenCalled();

    onIntersect?.([{ isIntersecting: true }]);

    await waitFor(() => expect(mapsMocks.loadGoogleMaps).toHaveBeenCalledTimes(1));
    expect(disconnect).toHaveBeenCalled();
  });
});
