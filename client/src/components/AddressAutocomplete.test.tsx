/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AddressAutocomplete from "./AddressAutocomplete";

describe("AddressAutocomplete", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("propose une adresse puis remplit les données de livraison au clic", async () => {
    const onValueChange = vi.fn();
    const onAddressSelected = vi.fn();
    const getPlacePredictions = vi.fn((_request, callback) => callback([
      {
        place_id: "place-27",
        description: "27 Rue du Maroc, Paris",
        structured_formatting: { main_text: "27 Rue du Maroc", secondary_text: "75019 Paris, France" },
      },
    ], "OK"));
    const getDetails = vi.fn((_request, callback) => callback({
      formatted_address: "27 Rue du Maroc, 75019 Paris, France",
      address_components: [
        { long_name: "27", types: ["street_number"] },
        { long_name: "Rue du Maroc", types: ["route"] },
        { long_name: "Paris", types: ["locality"] },
        { long_name: "75019", types: ["postal_code"] },
        { long_name: "France", types: ["country"] },
      ],
    }, "OK"));

    vi.stubGlobal("google", {
      maps: {
        places: {
          AutocompleteService: class { getPlacePredictions = getPlacePredictions },
          PlacesService: class { getDetails = getDetails },
          PlacesServiceStatus: { OK: "OK" },
        },
      },
    });

    render(
      <AddressAutocomplete
        value="27 rue"
        onValueChange={onValueChange}
        onAddressSelected={onAddressSelected}
      />,
    );

    const suggestion = await screen.findByRole("option", { name: /27 Rue du Maroc/ });
    fireEvent.click(suggestion);

    await waitFor(() => expect(onAddressSelected).toHaveBeenCalledWith({
      address: "27 Rue du Maroc",
      city: "Paris",
      postalCode: "75019",
      country: "France",
    }));
    expect(onValueChange).toHaveBeenCalledWith("27 Rue du Maroc");
    expect(getDetails).toHaveBeenCalledWith(
      expect.objectContaining({ placeId: "place-27" }),
      expect.any(Function),
    );
  });

  it("conserve la sélection active lorsque le blur précède le clic sur une suggestion", async () => {
    const onAddressSelected = vi.fn();
    const pendingDetails = {
      callback: null as ((place: unknown, status: string) => void) | null,
    };
    const getPlacePredictions = vi.fn((_request, callback) => callback([
      {
        place_id: "place-27",
        description: "27 Rue du Maroc, Paris",
        structured_formatting: { main_text: "27 Rue du Maroc", secondary_text: "75019 Paris, France" },
      },
    ], "OK"));
    const getDetails = vi.fn((_request, callback) => {
      pendingDetails.callback = callback as unknown as (place: unknown, status: string) => void;
    });

    vi.stubGlobal("google", {
      maps: {
        places: {
          AutocompleteService: class { getPlacePredictions = getPlacePredictions },
          PlacesService: class { getDetails = getDetails },
          PlacesServiceStatus: { OK: "OK" },
        },
      },
    });

    render(<AddressAutocomplete value="27 rue" onValueChange={vi.fn()} onAddressSelected={onAddressSelected} />);

    const input = screen.getByLabelText("Adresse");
    const suggestion = await screen.findByRole("option", { name: /27 Rue du Maroc/ });
    fireEvent.mouseDown(suggestion);
    fireEvent.blur(input);
    fireEvent.click(suggestion);

    await waitFor(() => expect(getDetails).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("option", { name: /27 Rue du Maroc/ })).toBeNull();
    const detailsCallback = pendingDetails.callback;
    if (!detailsCallback) throw new Error("Le callback de détails doit être enregistré.");

    detailsCallback({
      formatted_address: "27 Rue du Maroc, 75019 Paris, France",
      address_components: [
        { long_name: "27", types: ["street_number"] },
        { long_name: "Rue du Maroc", types: ["route"] },
        { long_name: "Paris", types: ["locality"] },
        { long_name: "75019", types: ["postal_code"] },
        { long_name: "France", types: ["country"] },
      ],
    }, "OK");

    await waitFor(() => expect(onAddressSelected).toHaveBeenCalledWith({
      address: "27 Rue du Maroc",
      city: "Paris",
      postalCode: "75019",
      country: "France",
    }));
  });

  it("ferme les suggestions après un clic extérieur sans sélection", async () => {
    const getPlacePredictions = vi.fn((_request, callback) => callback([
      {
        place_id: "place-27",
        description: "27 Rue du Maroc, Paris",
        structured_formatting: { main_text: "27 Rue du Maroc", secondary_text: "75019 Paris, France" },
      },
    ], "OK"));

    vi.stubGlobal("google", {
      maps: {
        places: {
          AutocompleteService: class { getPlacePredictions = getPlacePredictions },
          PlacesService: class {},
          PlacesServiceStatus: { OK: "OK" },
        },
      },
    });

    render(
      <>
        <AddressAutocomplete value="27 rue" onValueChange={vi.fn()} onAddressSelected={vi.fn()} />
        <button type="button">Autre zone</button>
      </>,
    );

    const input = screen.getByLabelText("Adresse");
    await screen.findByRole("option", { name: /27 Rue du Maroc/ });
    const outsideButton = screen.getByRole("button", { name: "Autre zone" });
    input.focus();
    outsideButton.focus();

    await waitFor(() => expect(screen.queryByRole("option", { name: /27 Rue du Maroc/ })).toBeNull());
  });
});
