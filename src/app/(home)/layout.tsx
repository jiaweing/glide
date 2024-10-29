import { type ReactNode } from "react";
import { Header } from "../(example)/_components/header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen max-w-screen-sm border-x">
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
