import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import Home from "./_components/home";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Home",
  description: "Manage your bookings here",
};

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return <Home user={user} />;
}
