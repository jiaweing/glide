/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_TITLE } from "@/lib/constants";
import { formatNameFromEmail } from "@/lib/utils";
import { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, MapPin, Search, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Route {
  pickup: string;
  dropoff: string;
}

interface BusLocation {
  lat: number;
  lng: number;
}

const generateRandomBusLocations = (center: LatLngTuple, count: number): BusLocation[] => {
  return Array.from({ length: count }, () => ({
    lat: center[0] + (Math.random() - 0.5) * 0.01,
    lng: center[1] + (Math.random() - 0.5) * 0.01,
  }));
};

const generateRandomBusPlate = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length)),
  ).join("");
  const randomNumbers = Array.from({ length: 4 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length)),
  ).join("");
  return `${randomLetters}${randomNumbers}`;
};

export default function Home({ user }: { user: { email: string } }) {
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E2" },
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E6" },
    { pickup: "SIT PUNGGOL CAMPUS E6", dropoff: "PUNGGOL INTERCHANGE" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>([1.4043, 103.9022]);

  // useEffect(() => {
  //   if (typeof window !== "undefined" && "geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //       setUserLocation([latitude, longitude]);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (userLocation) {
      const interval = setInterval(() => {
        setBusLocations(generateRandomBusLocations(userLocation, 3));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [userLocation]);

  const filteredRoutes = useMemo(() => {
    return recentRoutes.filter(
      (route) =>
        route.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.dropoff.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [recentRoutes, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const MapWithNoSSR = dynamic(() => import("./map-container"), {
    ssr: false,
  });

  return (
    <>
      <div className="">
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Welcome {formatNameFromEmail(user.email)}</h1>
              <p className="text-muted-foreground">Book a shuttle bus with {APP_TITLE}</p>
            </div>
          </header>

          <div className="relative z-10 h-[250px] overflow-hidden rounded-xl">
            {userLocation && (
              <MapWithNoSSR
                userLocation={userLocation}
                busLocations={busLocations}
                generateRandomBusPlate={generateRandomBusPlate}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Destinations"
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className="flex space-x-2">
              <Link href="/pickup">
                <Button variant="outline" size="sm">
                  <Star className="text-yellow-400" /> E4
                </Button>
              </Link>
              <Link href="/pickup">
                <Button variant="outline" size="sm">
                  <Star className="text-yellow-400" /> E6
                </Button>
              </Link>
              <Link href="/pickup">
                <Button variant="outline" size="sm">
                  <Star className="text-yellow-400" /> Punggol Int
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRoutes.map((route, index) => (
              <Card key={index}>
                <Link href="/pickup" key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="font-medium">PICK-UP:</p>
                          <p className="text-sm text-muted-foreground">{route.pickup}</p>
                        </div>
                        <div>
                          <p className="font-medium">DROP-OFF:</p>
                          <p className="text-sm text-muted-foreground">{route.dropoff}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MapPin className="h-5 w-5" />
                        <span className="sr-only">View on map</span>
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
