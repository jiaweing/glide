import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MapPin } from "lucide-react";

export default function BusPickupScreen() {
  return (
    <div>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">PICK-UP</CardTitle>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Select Pick-Up point</p>
        <div className="space-y-1">
          {["PUNGGOL INTERCHANGE", "NTU PUNGGOL CAMPUS MAIN ENTRANCE", "NTU PUNGGOL CAMPUS E4"].map(
            (location) => (
              <Button key={location} variant="outline" className="w-full justify-start text-left">
                {location}
              </Button>
            ),
          )}
        </div>
        <div className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">Map View</span>
          </div>
          {[Array(5)].map((_, i) => (
            <MapPin
              key={i}
              className="absolute text-red-500"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
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
      </CardContent>
      <CardFooter className="mx-6 mt-auto flex h-20 items-center justify-center rounded-3xl border p-0">
        <p className="text-sm font-medium">Next bus leaving campus in 9 minutes</p>
      </CardFooter>
    </div>
  );
}
