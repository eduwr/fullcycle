"use client";

import type { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";
import { Loader } from "@googlemaps/js-api-loader";
import { FormEvent, useEffect } from "react";

export function NewRoutePage() {
  useEffect(() => {
    (async () => {
      const loader = new Loader({
        libraries: ["routes", "geometry"],
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      });

      await Promise.all([
        loader.importLibrary("routes"),
        loader.importLibrary("geometry"),
      ]);

      new google.maps.Map(document.getElementById("map") as HTMLDivElement, {
        zoom: 15,
        center: { lat: -23.55, lng: -46.63 },
      });
    })();
  }, []);
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
    const directionsData = await directionsResponse.json();
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
