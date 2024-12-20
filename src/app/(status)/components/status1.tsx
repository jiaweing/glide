"use client";

import { BackButton } from "@/app/(home)/_components/back-button";
import { Help } from "@/app/(home)/_components/help";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { AlertCircle, ArrowUpDown, Clock, MapPin, Star, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
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
  { name: "SIT PUNGGOL CAMPUS E6", lat: 1.415, lng: 103.91 },
];

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
  const searchParams = useSearchParams();
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasChangedDropoff, setHasChangedDropoff] = useState(false);
  const [showChangeAlert, setShowChangeAlert] = useState(false);
  const [pendingDropoffChange, setPendingDropoffChange] = useState<string | null>(null);
  const [isCancelDrawerOpen, setIsCancelDrawerOpen] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const destinationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const cancelReasons = [
    "Bus took too long",
    "Change of plans",
    "Wrong pickup location",
    "Bus not moving",
    "Unexpected emergency",
    "Weather conditions",
    "Could not board the bus",
    "Missed it",
  ];

  useEffect(() => {
    const pickup = searchParams.get("pickup");
    const dropoff = searchParams.get("dropoff");

    if (pickup) {
      handleLocationSelect(pickup, "pickup");
    }
    if (dropoff) {
      handleLocationSelect(dropoff, "dropoff");
    }
  }, [searchParams]);

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
    if (!location) return;

    const newPosition: LatLngExpression = { lat: location.lat, lng: location.lng };

    if (type === "pickup") {
      if (value === dropoffLocation) {
        setErrorMessage("Pickup and dropoff locations cannot be the same");
        return;
      }
      setPickupPosition(newPosition);
      setPickupLocation(value);
      setErrorMessage(null);
    } else {
      if (value === pickupLocation) {
        setErrorMessage("Pickup and dropoff locations cannot be the same");
        return;
      }

      if (isBookingConfirmed) {
        if (hasChangedDropoff) {
          toast.error("You can only change the dropoff location once");
          return;
        }
        setPendingDropoffChange(value);
        setShowChangeAlert(true);
        return;
      }

      setDropoffPosition(newPosition);
      setDropoffLocation(value);
      setErrorMessage(null);
    }
  };

  const startDestinationMovement = (startPos: LatLngExpression, endPos: LatLngExpression) => {
    if (destinationIntervalRef.current) {
      clearInterval(destinationIntervalRef.current);
    }

    let currentETA = 15;
    setDestinationETA(currentETA);

    const startLat = Array.isArray(startPos) ? startPos[0] : startPos.lat;
    const startLng = Array.isArray(startPos) ? startPos[1] : startPos.lng;
    const endLat = Array.isArray(endPos) ? endPos[0] : endPos.lat;
    const endLng = Array.isArray(endPos) ? endPos[1] : endPos.lng;

    destinationIntervalRef.current = setInterval(() => {
      if (currentETA > 0) {
        currentETA--;
        setDestinationETA(currentETA);
        const progress = 1 - currentETA / 15;
        const newLat = startLat + (endLat - startLat) * progress;
        const newLng = startLng + (endLng - startLng) * progress;
        setBusPosition([newLat, newLng]);
      } else {
        if (destinationIntervalRef.current) {
          clearInterval(destinationIntervalRef.current);
        }
        setStatusMessage("You have arrived, please alight by");
        toast("You have arrived at your destination. Please alight.");
        setTimeout(() => {
          setIsDrawerOpen(true);
        }, 5000);
      }
    }, 1000);
  };

  const confirmDropoffChange = () => {
    if (!pendingDropoffChange) return;

    const location = locations.find((loc) => loc.name === pendingDropoffChange);
    if (!location) return;

    const newPosition: LatLngExpression = { lat: location.lat, lng: location.lng };
    setDropoffPosition(newPosition);
    setDropoffLocation(pendingDropoffChange);
    setHasChangedDropoff(true);
    setShowChangeAlert(false);
    setPendingDropoffChange(null);
    toast.success("Dropoff location updated successfully");

    if (showDestinationETA && busPosition) {
      setStatusMessage("You will arrive at " + pendingDropoffChange);
      startDestinationMovement(busPosition, newPosition);
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

  useEffect(() => {
    if (isBoarding) {
      const startTime = Date.now();
      const simulatedDuration = 5000;
      const displayDuration = 60000;

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
          if (pickupPosition && dropoffPosition) {
            startDestinationMovement(pickupPosition, dropoffPosition);
          }
        } else {
          setBoardingTimeDisplay(displayTimeLeft);
        }
      }, 100);

      return () => clearInterval(boardingTimer);
    }
  }, [isBoarding, pickupPosition, dropoffPosition]);

  useEffect(() => {
    return () => {
      if (destinationIntervalRef.current) {
        clearInterval(destinationIntervalRef.current);
      }
    };
  }, []);

  const handleCancelBooking = () => {
    setIsCancelDrawerOpen(true);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setIsCancelDrawerOpen(false);
    setShowCancelWarning(true);
  };

  const confirmCancellation = () => {
    setShowCancelWarning(false);
    toast.success("Booking cancelled successfully");
    router.push("/");
  };

  const isBookingAllowed = pickupPosition && dropoffPosition && pickupLocation !== dropoffLocation;

  return (
    <div className="relative h-screen w-full">
      {/* <div className="absolute inset-0 z-0">
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
      </div> */}

      <div className="absolute left-0 right-0 top-0 z-10 m-2 space-y-4 rounded-xl bg-white p-4">
        {!isBoarding && !showDestinationETA && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-400" />
            <div className="flex w-full flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Pickup</span>
              <Select
                disabled={isBookingConfirmed}
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

      <CardFooter className="absolute bottom-0 left-0 right-0 z-10 mx-2 flex flex-col gap-4 p-0">
        <div className="w-full">
          <div className="h-14 w-14 rounded-full bg-white">
            <BackButton />
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-t-xl bg-white p-6 shadow-lg">
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
          <div className="flex flex-col gap-2">
            {!isBookingConfirmed && isBookingAllowed && (
              <Button onClick={confirmBooking}>Confirm Booking</Button>
            )}
            {(showDestinationETA || isBoarding) && (
              <Button onClick={() => setIsHelpOpen(true)}>
                <AlertCircle size={20} /> Report Issue
                <Drawer open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                  <DrawerContent className="mx-auto max-w-xl">
                    <div className="p-6">
                      <Help user={user} />
                    </div>
                  </DrawerContent>
                </Drawer>
              </Button>
            )}
            {isBookingConfirmed && !showDestinationETA && !isBoarding && (
              <Button variant="destructive" onClick={handleCancelBooking}>
                <X size={20} /> Cancel
              </Button>
            )}
          </div>
        </div>
      </CardFooter>

      <AlertDialog open={showChangeAlert} onOpenChange={setShowChangeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Dropoff Location</AlertDialogTitle>
            <AlertDialogDescription>
              You can only change the dropoff location once during your trip. Are you sure you want
              to change it now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowChangeAlert(false);
                setPendingDropoffChange(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDropoffChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer open={isCancelDrawerOpen} onOpenChange={setIsCancelDrawerOpen}>
        <DrawerContent className="mx-auto max-w-xl">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Why do you want to cancel?</h3>
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <Button
                  key={reason}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleReasonSelect(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={showCancelWarning} onOpenChange={setShowCancelWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              Penalties may apply if you abuse this feature. You may wish to change your pick-up or
              drop-off locations instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelWarning(false)}>No</AlertDialogCancel>
            <Button
              variant="default"
              onClick={() => {
                setShowCancelWarning(false);
                setDropoffPosition(null);
                setDropoffLocation(null);
              }}
            >
              Change Location
            </Button>
            <AlertDialogAction onClick={confirmCancellation}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
