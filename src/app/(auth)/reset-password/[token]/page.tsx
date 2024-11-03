import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPassword } from "./reset-password";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password Page",
};

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPassword token={params.token} />
      </CardContent>
    </div>
  );
}
