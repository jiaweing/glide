"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";

interface Route {
  pickup: string;
  dropoff: string;
}

export default function HomePage({ user }: { user: { email: string } }) {
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E2" },
    { pickup: "PUNGGOL INTERCHANGE", dropoff: "SIT PUNGGOL CAMPUS E6" },
    { pickup: "SIT PUNGGOL CAMPUS E6", dropoff: "PUNGGOL INTERCHANGE" },
  ]);

  // const promises = Promise.all([
  //   api.post.myPosts.query({ page, perPage }),
  //   api.stripe.getPlan.query(),
  // ]);

  return (
    <>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Welcome {user.email}</h1>
            <p className="text-sm text-gray-500">Book a shuttle bus</p>
          </div>
        </div>

        <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100">
          <p className="text-gray-400">Current buses locations</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Search Pick Up Points"
            className="w-full py-2 pl-10 pr-4"
          />
        </div>

        <div className="flex space-x-2">
          {[1, 2, 3].map((num) => (
            <Button key={num} variant="outline" className="flex-1">
              Fav {num}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {recentRoutes.map((route, index) => (
            <div key={index} className="flex items-start space-x-3 text-sm">
              <Clock className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <div className="flex items-center font-semibold">
                  <MapPin className="mr-1 h-4 w-4" />
                  PICK-UP:
                </div>
                <p className="ml-5 text-gray-600">{route.pickup}</p>
                <div className="mt-1 flex items-center font-semibold">
                  <MapPin className="mr-1 h-4 w-4" />
                  DROP-OFF:
                </div>
                <p className="ml-5 text-gray-600">{route.dropoff}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
