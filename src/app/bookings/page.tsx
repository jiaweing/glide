import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <Button asChild>
          <Link href="/">Book New Ride</Link>
        </Button>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking #12345</CardTitle>
            <CardDescription>Scheduled for Today at 2:00 PM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">From: Downtown Station</p>
                <p className="text-sm font-medium">To: Airport Terminal 1</p>
              </div>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/bookings/12345/cancel">Cancel Booking</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
