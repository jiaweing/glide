// Create a new file: components/Map.tsx
"use client";
import { Icon, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface MapProps {
  userLocation: LatLngTuple;
  busLocations: Array<{ lat: number; lng: number }>;
  generateRandomBusPlate: () => string;
}

export default function Map({ userLocation, busLocations, generateRandomBusPlate }: MapProps) {
  const busIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      }),
    [],
  );

  const userIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      }),
    [],
  );

  return (
    <MapContainer center={userLocation} zoom={15} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={userLocation} icon={userIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      {busLocations.map((location) => (
        <Marker
          key={location.lat + location.lng}
          position={[location.lat, location.lng] as LatLngTuple}
          icon={busIcon}
        >
          <Popup>{generateRandomBusPlate()}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
