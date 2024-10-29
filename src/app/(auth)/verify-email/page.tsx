import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";
import { VerifyCode } from "./verify-code";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) redirect(Paths.Login);
  if (user.emailVerified) redirect(Paths.Dashboard);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Verification code was sent to <strong>{user.email}</strong>. Check your spam folder if you
          can't find the email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCode />
      </CardContent>
    </div>
  );
}
