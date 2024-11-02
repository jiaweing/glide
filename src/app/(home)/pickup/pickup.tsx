"use client";

import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MapPin } from "lucide-react";
import { useState } from "react";

export default function Pickup() {
  const [pinPositions, setPinPositions] = useState(generateRandomPinPositions());

  function generateRandomPinPositions() {
    return Array.from({ length: 1 }, () => ({
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
    }));
  }

  function handleLocationClick() {
    setPinPositions(generateRandomPinPositions());
  }

  return (
    <div className="h-screen">
      <CardHeader className="flex flex-row items-center justify-between rounded-lg border">
        <div>
          <CardTitle className="text-lg font-bold">PICK-UP</CardTitle>
          <p className="text-sm text-muted-foreground">Select Pick-Up point</p>
        </div>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </CardHeader>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground">Nearby</p>
        <div className="space-y-1">
          {["PUNGGOL INTERCHANGE", "NTU PUNGGOL CAMPUS MAIN ENTRANCE", "NTU PUNGGOL CAMPUS E4"].map(
            (location) => (
              <Button
                key={location}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={handleLocationClick}
              >
                {location}
              </Button>
            ),
          )}
        </div>
        <div className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <span className="text-muted-foreground">Map View</span> */}
          </div>
          {pinPositions.map((position, i) => (
            <MapPin
              key={i}
              className="absolute text-red-500"
              style={{
                top: position.top,
                left: position.left,
              }}
            />
          ))}
          <MapPin
            className="absolute text-blue-500"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
      <CardFooter className="mt-4 flex h-20 items-center justify-center rounded-3xl border p-0">
        <p className="text-sm font-medium">Next bus leaving campus in 9 minutes</p>
      </CardFooter>
    </div>
  );
}
