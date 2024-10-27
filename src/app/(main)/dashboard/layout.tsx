import { VerificiationWarning } from "./_components/verificiation-warning";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="container">
      <main className="w-full space-y-4">
        <VerificiationWarning />
        <div>{children}</div>
      </main>
    </div>
  );
}
