import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a GearUp account to rent equipment or list your own gear.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-muted-foreground">
          Join GearUp to rent equipment or start listing your own.
        </p>
      </div>

      <RegisterForm />
    </>
  );
}
