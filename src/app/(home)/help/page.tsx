import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { Help } from "../_components/help";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Help Center",
  description: "Frequently asked questions and support",
};

export default async function HelpPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  return <Help user={user} />;
}
