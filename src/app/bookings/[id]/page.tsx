import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <Button variant="outline" asChild>
          <Link href="/bookings">Back to Bookings</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking #{params.id}</CardTitle>
          <CardDescription>Scheduled for Today at 2:00 PM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Pickup Location</h3>
            <p className="text-sm">Downtown Station</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Destination</h3>
            <p className="text-sm">Airport Terminal 1</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Vehicle</h3>
            <p className="text-sm">Standard Bus - ABC123</p>
          </div>
          <Button
            variant="destructive"
            asChild
            className="mt-4"
          >
            <Link href={`/bookings/${params.id}/cancel`}>Cancel This Booking</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}