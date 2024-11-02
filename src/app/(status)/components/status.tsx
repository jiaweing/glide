"use client";

import { BackButton } from "@/app/(example)/_components/back-button";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Icon, type LatLngExpression, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowUpDown, Clock, MapPin, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import { toast } from "sonner";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

const locations: Location[] = [
  { name: "PUNGGOL INTERCHANGE", lat: 1.4043, lng: 103.9022 },
  { name: "SIT PUNGGOL CAMPUS MAIN ENTRANCE", lat: 1.41, lng: 103.908 },
  { name: "SIT PUNGGOL CAMPUS E4", lat: 1.412, lng: 103.91 },
];

// Define map boundaries for random bus starting position
const MAP_BOUNDS = {
  minLat: 1.4,
  maxLat: 1.415,
  minLng: 103.9,
  maxLng: 103.915,
};

const getRandomPosition = (): LatLngExpression => {
  const lat = MAP_BOUNDS.minLat + Math.random() * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
  const lng = MAP_BOUNDS.minLng + Math.random() * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  return [lat, lng];
};

const pickupIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const busIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
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

  return position ? <Marker position={position} icon={pickupIcon} /> : null;
}

export default function Status({ user }: { user: { email: string } }) {
  const [pickupPosition, setPickupPosition] = useState<LatLngExpression | null>(null);
  const [dropoffPosition, setDropoffPosition] = useState<LatLngExpression | null>(null);
  const [pickupLocation, setPickupLocation] = useState<string | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<string | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [busPosition, setBusPosition] = useState<LatLngExpression | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(9);
  const [statusMessage, setStatusMessage] = useState("Nearest bus will arrive at");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBoarding, setIsBoarding] = useState(false);
  const [showDestinationETA, setShowDestinationETA] = useState(false);
  const [destinationETA, setDestinationETA] = useState(15);
  const [boardingTimeDisplay, setBoardingTimeDisplay] = useState(1);
  const [etaTime, setEtaTime] = useState<string>("");
  const [initialBusPosition, setInitialBusPosition] = useState<LatLngExpression | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const router = useRouter();

  const updateETA = () => {
    const now = new Date();
    const etaDate = new Date(now);

    if (showDestinationETA) {
      etaDate.setMinutes(now.getMinutes() + destinationETA);
    } else if (isBoarding) {
      etaDate.setMinutes(now.getMinutes() + boardingTimeDisplay);
    } else {
      etaDate.setMinutes(now.getMinutes() + timeRemaining);
    }

    setEtaTime(
      etaDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    );
  };

  useEffect(() => {
    updateETA();
  }, [timeRemaining, boardingTimeDisplay, destinationETA, showDestinationETA, isBoarding]);

  const handleLocationSelect = (value: string, type: "pickup" | "dropoff") => {
    const location = locations.find((loc) => loc.name === value);
    if (location) {
      const newPosition: LatLngExpression = { lat: location.lat, lng: location.lng };
      if (type === "pickup") {
        if (dropoffPosition && JSON.stringify(newPosition) === JSON.stringify(dropoffPosition)) {
          setErrorMessage("Pickup and dropoff locations cannot be the same");
          return;
        }
        setPickupPosition(newPosition);
        setPickupLocation(value);
      } else {
        if (pickupPosition && JSON.stringify(newPosition) === JSON.stringify(pickupPosition)) {
          setErrorMessage("Pickup and dropoff locations cannot be the same");
          return;
        }
        setDropoffPosition(newPosition);
        setDropoffLocation(value);
      }
      setErrorMessage(null);
    }
  };

  const swapLocations = () => {
    if (pickupPosition && dropoffPosition && pickupLocation && dropoffLocation) {
      setPickupPosition(dropoffPosition);
      setDropoffPosition(pickupPosition);
      setPickupLocation(dropoffLocation);
      setDropoffLocation(pickupLocation);
    }
  };

  const confirmBooking = () => {
    const randomStart = getRandomPosition();
    toast("Booking confirmed! Your bus will arrive shortly.");
    setInitialBusPosition(randomStart);
    setBusPosition(randomStart);
    setIsBookingConfirmed(true);
    setStatusMessage("Your bus will arrive in");
    simulateBusMovement(randomStart);
  };

  const simulateBusMovement = (startPosition: LatLngExpression) => {
    let currentTime = timeRemaining;
    const interval = setInterval(() => {
      if (currentTime > 0) {
        currentTime--;
        setTimeRemaining(currentTime);

        // Update bus position from random start to pickup
        const progress = 1 - currentTime / 9;
        if (pickupPosition && Array.isArray(startPosition)) {
          const [startLat, startLng] = startPosition;
          const endLat =
            typeof pickupPosition === "object" && "lat" in pickupPosition ? pickupPosition.lat : 0;
          const endLng =
            typeof pickupPosition === "object" && "lng" in pickupPosition ? pickupPosition.lng : 0;

          const newLat = startLat + (endLat - startLat) * progress;
          const newLng = startLng + (endLng - startLng) * progress;
          setBusPosition([newLat, newLng]);
        }
      } else {
        clearInterval(interval);
        setStatusMessage("Your bus has arrived. The bus will depart at");
        toast("Your bus has arrived. Please board the bus immediately.");
        setTimeRemaining(0);
        setIsBoarding(true);
      }
    }, 1000);
  };

  // Handle boarding time (5 seconds but display as 1 minute countdown)
  useEffect(() => {
    if (isBoarding) {
      const startTime = Date.now();
      const simulatedDuration = 5000; // 5 seconds
      const displayDuration = 60000; // 1 minute

      const boardingTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / simulatedDuration, 1);
        const displayTimeLeft = Math.ceil(((1 - progress) * (displayDuration / 1000)) / 60);

        if (progress >= 1) {
          clearInterval(boardingTimer);
          setIsBoarding(false);
          setShowDestinationETA(true);
          setStatusMessage("You will arrive at" + " " + dropoffLocation);
          setBoardingTimeDisplay(0);
          // Start destination movement
          if (pickupPosition && dropoffPosition) {
            const startLat =
              typeof pickupPosition === "object" && "lat" in pickupPosition
                ? pickupPosition.lat
                : 0;
            const startLng =
              typeof pickupPosition === "object" && "lng" in pickupPosition
                ? pickupPosition.lng
                : 0;
            const endLat =
              typeof dropoffPosition === "object" && "lat" in dropoffPosition
                ? dropoffPosition.lat
                : 0;
            const endLng =
              typeof dropoffPosition === "object" && "lng" in dropoffPosition
                ? dropoffPosition.lng
                : 0;

            let currentETA = destinationETA;
            const destinationInterval = setInterval(() => {
              if (currentETA > 0) {
                currentETA--;
                setDestinationETA(currentETA);
                const progress = 1 - currentETA / 15;
                const newLat = startLat + (endLat - startLat) * progress;
                const newLng = startLng + (endLng - startLng) * progress;
                setBusPosition([newLat, newLng]);
              } else {
                clearInterval(destinationInterval);
                setStatusMessage("You have arrived, please alight by");
                toast("You have arrived at your destination. Please alight.");
                // Show completion drawer after 5 seconds
                setTimeout(() => {
                  setIsDrawerOpen(true);
                }, 5000);
              }
            }, 1000);
          }
        } else {
          setBoardingTimeDisplay(displayTimeLeft);
        }
      }, 100);

      return () => clearInterval(boardingTimer);
    }
  }, [isBoarding, pickupPosition, dropoffPosition, destinationETA]);

  const isBookingAllowed =
    pickupPosition &&
    dropoffPosition &&
    JSON.stringify(pickupPosition) !== JSON.stringify(dropoffPosition);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[1.4043, 103.9022]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pickupPosition && <Marker position={pickupPosition} icon={pickupIcon} />}
          {dropoffPosition && <Marker position={dropoffPosition} icon={dropoffIcon} />}
          {busPosition && <Marker position={busPosition} icon={busIcon} />}
          {pickupPosition && dropoffPosition && (
            <Polyline positions={[pickupPosition, dropoffPosition]} color="blue" />
          )}
        </MapContainer>
      </div>

      <div className="absolute left-0 right-0 top-0 z-10 m-2 space-y-4 rounded-xl bg-white p-4">
        {!isBoarding && !showDestinationETA && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-400" />
            <div className="flex w-full flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Pickup</span>
              <Select
                onValueChange={(value: string) => handleLocationSelect(value, "pickup")}
                value={pickupLocation ?? undefined}
              >
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
        )}
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-red-500" />
          <div className="flex w-full flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Dropoff</span>
            <Select
              onValueChange={(value: string) => handleLocationSelect(value, "dropoff")}
              value={dropoffLocation ?? undefined}
            >
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
        {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
        {!isBoarding && !showDestinationETA && !isBookingConfirmed && (
          <Button
            onClick={swapLocations}
            disabled={!pickupPosition || !dropoffPosition}
            className="w-full"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Swap Locations
          </Button>
        )}
      </div>
      <div className="absolute bottom-32 left-2 z-10 flex h-14 w-14 flex-row items-center justify-center rounded-full bg-white">
        <BackButton />
      </div>
      <CardFooter className="absolute bottom-0 left-0 right-0 z-10 mx-2 flex items-center justify-between rounded-t-xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-start">
          <span className="text-muted-foreground">{statusMessage}</span>
          {!isBoarding && (timeRemaining > 0 || showDestinationETA) && (
            <div className="flex flex-row items-center gap-3">
              <span className="text-3xl font-bold">{etaTime}</span>
              <span className="flex flex-row items-center gap-1 text-muted-foreground">
                <Clock size={15} />
                {showDestinationETA ? destinationETA : timeRemaining} mins
              </span>
            </div>
          )}
          {isBoarding && (
            <div className="flex flex-row items-center gap-3">
              <span className="text-3xl font-bold">{etaTime}</span>
              <span className="flex flex-row items-center gap-1 text-muted-foreground">
                <Clock size={15} />
                {boardingTimeDisplay} min
              </span>
            </div>
          )}
        </div>
        {!isBookingConfirmed && isBookingAllowed && (
          <Button onClick={confirmBooking}>Confirm Booking</Button>
        )}
      </CardFooter>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={(state: boolean) => {
          setIsDrawerOpen(state);
          if (!state) {
            router.push("/");
          }
        }}
      >
        <DrawerContent className="mx-auto max-w-xl">
          <div className="relative flex h-full flex-col items-center justify-center p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => router.push("/")}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-6 text-xl font-semibold">Your ride has been completed</h3>
            <p className="mb-4 text-muted-foreground">How was the experience?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="icon"
                  className="hover:text-yellow-400"
                  onClick={() => {
                    setRating(star);
                    setTimeout(() => setIsDrawerOpen(false), 500);
                  }}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
