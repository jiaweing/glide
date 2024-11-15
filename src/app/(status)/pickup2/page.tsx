import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import Status from "../components/status";
import Status2 from "../components/status2";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Booking Status",
  description: "Track the status of your booking",
};

export default async function HelpPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  return <Status2 user={user} />;
}
