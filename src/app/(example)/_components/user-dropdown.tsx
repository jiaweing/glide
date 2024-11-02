"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const UserDropdown = ({
  email,
  avatar,
  className,
}: {
  email: string;
  avatar?: string | null;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Link href="/settings">
        <Avatar>
          <AvatarImage src="avatar" />
          <AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {/* <Menu className="mt-2 text-muted-foreground" /> */}
      </Link>
    </div>
  );
};
