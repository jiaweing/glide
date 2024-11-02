"use client";

import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth/actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export function Login() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
        <CardDescription>Use your school email to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">School Email</Label>
            <Input
              required
              id="email"
              placeholder="2301008@sit.singaporetech.edu.sg"
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="********"
            />
          </div>

          <div className="flex flex-wrap justify-between">
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/signup"}>I want to register an account</Link>
            </Button>
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/reset-password"}>Forgot password?</Link>
            </Button>
          </div>

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={String(err)}>
                  {String(err)}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
          <SubmitButton className="w-full" aria-label="submit-btn">
            Log In
          </SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
