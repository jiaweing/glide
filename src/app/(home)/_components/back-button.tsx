"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <ArrowLeft
      className="absolute left-4 top-4 h-6 w-6 cursor-pointer text-muted-foreground"
      onClick={() => router.back()}
    />
  );
};
