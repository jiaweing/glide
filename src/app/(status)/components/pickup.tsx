"use client";

import { CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon, type LatLngExpression, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

const locations: Location[] = [
  { name: "PUNGGOL INTERCHANGE", lat: 1.4043, lng: 103.9022 },
  { name: "NTU PUNGGOL CAMPUS MAIN ENTRANCE", lat: 1.41, lng: 103.908 },
  { name: "NTU PUNGGOL CAMPUS E4", lat: 1.412, lng: 103.91 },
];

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationMarkerProps {
  position: LatLngExpression | null;
  setPosition: (position: LatLngExpression) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

export default function Pickup() {
  const [pickupPosition, setPickupPosition] = useState<LatLngExpression | null>(null);
  const [dropoffPosition, setDropoffPosition] = useState<LatLngExpression | null>(null);

  const handleLocationSelect = (value: string, type: "pickup" | "dropoff") => {
    const location = locations.find((loc) => loc.name === value);
    if (location) {
      const newPosition: LatLngExpression = { lat: location.lat, lng: location.lng };
      if (type === "pickup") {
        setPickupPosition(newPosition);
      } else {
        setDropoffPosition(newPosition);
      }
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[1.4043, 103.9022]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pickupPosition && <Marker position={pickupPosition} icon={customIcon} />}
          {dropoffPosition && <Marker position={dropoffPosition} icon={customIcon} />}
        </MapContainer>
      </div>

      <div className="absolute left-0 right-0 top-0 z-10 m-2 space-y-4 rounded-xl bg-white p-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-400" />
          <div className="flex w-full flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Pickup</span>
            <Select onValueChange={(value) => handleLocationSelect(value, "pickup")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Pickup" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-red-500" />
          <div className="flex w-full flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Dropoff</span>
            <Select onValueChange={(value) => handleLocationSelect(value, "dropoff")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Drop-off" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <CardFooter className="absolute bottom-0 left-0 right-0 z-10 m-2 flex h-20 items-center justify-center rounded-xl bg-white p-0">
        <p className="text-sm font-medium">Next bus leaving campus in 9 minutes</p>
      </CardFooter>
    </div>
  );
}
