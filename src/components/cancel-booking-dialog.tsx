"use client"

import { Check, X } from "lucide-react"
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface CancelBookingDialogProps {
  bookingId: string
}

export function CancelBookingDialog({ bookingId }: CancelBookingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(true)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [showNotCancelled, setShowNotCancelled] = React.useState(false)
  const [reason, setReason] = React.useState("")

  const cancelReasons = [
    "Bus took too long",
    "Change of plans",
    "Wrong pickup location",
    "Bus not moving",
    "Unexpected emergency",
    "Weather conditions",
    "Could not board the bus",
    "Missed it",
  ]

  const handleCancel = () => {
    if (reason) {
      setShowConfirm(true)
    }
  }

  const handleConfirmCancel = () => {
    console.log("Confirming cancellation of booking:", bookingId, "with reason:", reason)
    setShowConfirm(false)
    setShowSuccess(true)
  }

  const handleClose = () => {
    setOpen(false)
    router.back()
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push("/")
  }

  const handleNotCancelledClose = () => {
    setShowNotCancelled(false)
    router.push("/bookings")
  }

  const handleChangeLocation = () => {
    setShowConfirm(false)
    setOpen(false)
    router.push(`/bookings/${bookingId}/change-location`)
  }

  const handleNoCancel = () => {
    setShowConfirm(false)
    setShowNotCancelled(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-lg p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-5 pb-4">
            <DialogTitle className="text-lg font-semibold">
              Why do you want to cancel?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Select reason for cancelling
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-6 w-6 rounded-md"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="px-4 pb-5">
            <RadioGroup
              value={reason}
              onValueChange={setReason}
              className="space-y-3"
            >
              {cancelReasons.map((item) => (
                <Label
                  key={item}
                  className={cn(
                    "flex cursor-pointer items-center rounded-md border bg-card p-4 hover:bg-accent",
                    reason === item && "border-primary"
                  )}
                >
                  <RadioGroupItem value={item} className="sr-only" />
                  <span className="text-sm font-medium leading-none">
                    {item}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="border-t bg-muted/50 p-4">
            <Button
              className="w-full"
              disabled={!reason}
              onClick={handleCancel}
            >
              Cancel Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to cancel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Penalties may apply if you abuse this feature. You may wish to change your pick-up or drop-off locations instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes
            </AlertDialogAction>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleChangeLocation}
            >
              Change Location
            </Button>
            <AlertDialogCancel 
              className="w-full text-primary"
              onClick={handleNoCancel}
            >
              No
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showSuccess} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-xs text-center p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-md"
            onClick={handleSuccessClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Your ride has been cancelled
              </h2>
              <p className="text-sm text-muted-foreground">
                Ride cancelled
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotCancelled} onOpenChange={handleNotCancelledClose}>
        <DialogContent className="max-w-xs text-center p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-md"
            onClick={handleNotCancelledClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Your ride was not cancelled.
              <br />
              Please wait for your bus.
            </h2>
            <p className="text-sm text-muted-foreground">
              Ride did not cancel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}