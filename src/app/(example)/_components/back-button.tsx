"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = async () => {
  const router = useRouter();

  return (
    <ArrowLeft
      className="absolute left-4 top-4 h-6 w-6 cursor-pointer text-muted-foreground"
      onClick={() => router.back()}
    />
  );
};
