import { CancelBookingDialog } from "@/components/cancel-booking-dialog"

export default function CancelPage({ params }: { params: { id: string } }) {
  return <CancelBookingDialog bookingId={params.id} />
}