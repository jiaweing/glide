import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { Chat } from "../_components/chat";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Live Chat",
  description: "Talk to our customer support team",
};

export default async function ChatPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  return <Chat user={user} />;
}
