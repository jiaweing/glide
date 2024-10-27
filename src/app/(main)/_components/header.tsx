import { UserDropdown } from "@/app/(main)/_components/user-dropdown";
import { validateRequest } from "@/lib/auth/validate-request";

export const Header = async () => {
  const { user } = await validateRequest();

  return (
    <header className="sticky top-0 z-10 bg-background/80 p-0 backdrop-blur-sm">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        {user ? <UserDropdown email={user.email} avatar={user.avatar} className="ml-auto" /> : null}
      </div>
    </header>
  );
};
