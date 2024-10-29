import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";
import { SendResetEmail } from "./send-reset-email";

export const metadata = {
  title: "Forgot Password",
  description: "Forgot Password Page",
};

export default async function ForgotPasswordPage() {
  const { user } = await validateRequest();

  if (user) redirect(Paths.Dashboard);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Password reset link will be sent to your email</CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetEmail />
      </CardContent>
    </div>
  );
}
