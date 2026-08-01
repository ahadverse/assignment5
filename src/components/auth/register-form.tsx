"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import { RequiredMark } from "@/components/shared/required-mark";
import { useRegister } from "@/hooks/use-auth";
import { applyApiErrors } from "@/lib/form-errors";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const FIELDS = [
  "fullName",
  "email",
  "phone",
  "password",
  "confirmPassword",
  "role",
  "address",
] as const;

const roles = [
  {
    value: "CUSTOMER" as const,
    label: "Customer",
    description: "Browse and rent gear",
    icon: UserRound,
  },
  {
    value: "PROVIDER" as const,
    label: "Provider",
    description: "List and rent out gear",
    icon: Store,
  },
];

export function RegisterForm() {
  const signUp = useRegister();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      address: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await signUp.mutateAsync(values);
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, FIELDS);
      if (!matched)
        toast.error("Could not create your account", { description: message });
    }
  }

  const busy = isSubmitting || signUp.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field>
        <FieldLabel>
          I am a <RequiredMark />
        </FieldLabel>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => field.onChange(role.value)}
                  aria-pressed={field.value === role.value}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-all",
                    field.value === role.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/40 hover:bg-accent/50"
                  )}
                >
                  <role.icon
                    className={cn(
                      "size-5",
                      field.value === role.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <p className="mt-2 text-sm font-medium">{role.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        />
        <FieldError errors={[errors.role]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="fullName">
          Full name <RequiredMark />
        </FieldLabel>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Ahad Hossain"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
        <FieldError errors={[errors.fullName]} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
          <FieldLabel htmlFor="phone">
            Phone <RequiredMark />
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01700000000"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          <FieldError errors={[errors.phone]} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="password">
            Password <RequiredMark />
          </FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirm password <RequiredMark />
          </FieldLabel>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="address">
          Address <span className="text-muted-foreground">(optional)</span>
        </FieldLabel>
        <Input
          id="address"
          autoComplete="street-address"
          placeholder="Dhaka, Bangladesh"
          {...register("address")}
        />
        <FieldError errors={[errors.address]} />
      </Field>

      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
