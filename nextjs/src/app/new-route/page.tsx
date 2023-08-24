"use client";

import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";

import { FormEvent, useRef } from "react";
import { useMap } from "../hooks/useMap";

export function NewRoutePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapRef);

  async function searchPlaces(e: FormEvent) {
    e.preventDefault();
    const source = (document.getElementById("source") as HTMLInputElement)
      .value;
    const destination = (
      document.getElementById("destination") as HTMLInputElement
    ).value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3000/places?text=${source}`),
      fetch(`http://localhost:3000/places?text=${destination}`),
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
      await Promise.all([sourceResponse.json(), destinationResponse.json()]);

    if (sourcePlace.status !== "OK") {
      console.error(sourcePlace);
      alert("Não foi possível encontrar a origem");
    }

    if (destinationPlace.status !== "OK") {
      console.error(destinationPlace);
      alert("Não foi possível encontrar o destino");
    }

    const placeSourceId = sourcePlace.candidates[0].place_id;
    const placeDestinationId = destinationPlace.candidates[0].place_id;

    const directionsResponse = await fetch(
      `http://localhost:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`
    );
    const directionsData: DirectionsResponseData & { request: any } =
      await directionsResponse.json();

    await map?.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
    });
  }
  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <aside>
        <h1>Nova Rota</h1>
        <form
          onSubmit={searchPlaces}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div>
            <input id="source" type="text" placeholder="origem" />
          </div>
          <div>
            <input id="destination" type="text" placeholder="destino" />
          </div>
          <button type="submit">Pesquisar</button>
        </form>
      </aside>
      <div
        ref={mapRef}
        id="map"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </div>
  );
}

export default NewRoutePage;
