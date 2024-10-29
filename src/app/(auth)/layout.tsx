import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center justify-center border-x">
      {children}
    </div>
  );
};

export default AuthLayout;
