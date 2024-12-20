"use client";

import { ExclamationTriangleIcon } from "@/components/icons";
import { LoadingButton } from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { APP_TITLE } from "@/lib/constants";
import { formatNameFromEmail } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function Settings({ user }: { user: { email: string } }) {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <div className="">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Name</label>
              <div className="text-sm">{formatNameFromEmail(user.email)}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="text-sm">{user.email}</div>
            </div>
          </div>
          <hr />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account</h2>
            <nav className="space-y-1">
              {/* <Link
                href="#"
                className="disabled flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm opacity-50 transition-colors hover:bg-muted"
              >
                Previous Activities
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="#"
                className="disabled flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm opacity-50 transition-colors hover:bg-muted"
              >
                Favourite Locations
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link> */}
              <Link
                href="/help"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                Help Center (FAQ)
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              {/* <Link
                href="#"
                className="disabled flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm opacity-50 transition-colors hover:bg-muted"
              >
                Manage Account
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link> */}
              <SignoutConfirmation />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

const SignoutConfirmation = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast("Signed out successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          icon: <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />,
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Link
          href="#"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-destructive"
        >
          Sign Out
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Sign out from {APP_TITLE}?</AlertDialogTitle>
          <AlertDialogDescription>You will be redirected to the login page.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton loading={isLoading} onClick={handleSignout}>
            Continue
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
