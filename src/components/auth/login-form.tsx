"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import { RequiredMark } from "@/components/shared/required-mark";
import { useLogin } from "@/hooks/use-auth";
import { applyApiErrors } from "@/lib/form-errors";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? undefined;
  const login = useLogin(redirect);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login.mutateAsync(values);
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, FIELDS);
      if (!matched) toast.error("Could not sign in", { description: message });
    }
  }

  const busy = isSubmitting || login.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field>
        <FieldLabel htmlFor="email">
          Email <RequiredMark />
        </FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">
          Password <RequiredMark />
        </FieldLabel>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Your password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to GearUp?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
