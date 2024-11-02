import { type ReactNode } from "react";
import { Header } from "../(example)/_components/header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-background md:my-4 md:rounded-xl md:border md:border-x md:shadow-lg">
      <Header />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default MainLayout;
