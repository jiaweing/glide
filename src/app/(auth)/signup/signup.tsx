"use client";

import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth/actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export function Signup() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up to start booking shuttle buses</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">School Email</Label>
            <Input
              id="email"
              required
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

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err: string) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
          <div>
            <Link href={"/login"}>
              <span className="p-0 text-xs font-medium underline-offset-4 hover:underline">
                I want to login instead
              </span>
            </Link>
          </div>

          <SubmitButton className="w-full" aria-label="submit-btn">
            Sign Up
          </SubmitButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
