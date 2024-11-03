import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center justify-center bg-background md:my-4 md:rounded-xl md:border md:border-x md:shadow-lg">
      {children}
    </div>
  );
};

export default AuthLayout;
