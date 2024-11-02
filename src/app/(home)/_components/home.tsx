"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_TITLE } from "@/lib/constants";
import { Bus, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Route {
  pickup: string;
  dropoff: string;
}

interface BusLocation {
  x: number;
  y: number;
}

const generateRandomBusLocations = (count: number): BusLocation[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
};

export default function HomePage({ user }: { user: { email: string } }) {
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E2" },
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E6" },
    { pickup: "SIT PUNGGOL CAMPUS E6", dropoff: "PUNGGOL INTERCHANGE" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);

  useEffect(() => {
    const updateBusLocations = () => {
      setBusLocations(generateRandomBusLocations(3));
    };

    updateBusLocations();
    const interval = setInterval(updateBusLocations, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <>
      <div className="">
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Welcome {user.email}</h1>
              <p className="text-gray-500">Book a shuttle bus with {APP_TITLE}</p>
            </div>
          </header>

          <div className="relative h-40 rounded-xl bg-gray-100 p-4">
            {busLocations.map((location, index) => (
              <Bus
                key={index}
                className="absolute h-5 w-5 text-blue-500"
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            <div className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-1 text-xs font-medium">
              Current Buses
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search Pick Up Points"
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Fav 1
              </Button>
              <Button variant="outline" size="sm">
                Fav 2
              </Button>
              <Button variant="outline" size="sm">
                Fav 3
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRoutes.map((route, index) => (
              <Card key={index}>
                <Link href="/pickup" key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Clock className="mt-1 h-5 w-5 text-gray-400" />
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="font-medium">PICK-UP:</p>
                          <p className="text-sm text-gray-500">{route.pickup}</p>
                        </div>
                        <div>
                          <p className="font-medium">DROP-OFF:</p>
                          <p className="text-sm text-gray-500">{route.dropoff}</p>
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
