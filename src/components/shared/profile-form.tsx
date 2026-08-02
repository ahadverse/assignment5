"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RequiredMark } from "@/components/shared/required-mark";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/auth-store";
import { applyApiErrors } from "@/lib/form-errors";
import { initials } from "@/lib/format";
import { roleLabels } from "@/lib/navigation";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import type { User } from "@/types";

const FIELDS = ["fullName", "phone", "address", "profilePicture"] as const;

export function ProfileForm({ user: initialUser }: { user: User }) {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser ?? initialUser;
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone,
      address: user.address ?? "",
      profilePicture: user.profilePicture ?? "",
    },
  });

  async function submit(values: ProfileValues) {
    try {
      await updateProfile.mutateAsync({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address || undefined,
        profilePicture: values.profilePicture || undefined,
      });
    } catch (error) {
      const { matched, message } = applyApiErrors(error, setError, FIELDS);
      if (!matched) setError("fullName", { type: "server", message });
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
        <Avatar size="lg">
          {user.profilePicture ? (
            <AvatarImage src={user.profilePicture} alt={user.fullName} />
          ) : null}
          <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.email}</p>
          <Badge variant="secondary" className="mt-1.5 text-[11px]">
            {roleLabels[user.role]}
          </Badge>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="space-y-5 rounded-xl border bg-card p-5 sm:p-6"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">
              Full name <RequiredMark />
            </FieldLabel>
            <Input
              id="fullName"
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
            />
            <FieldError errors={[errors.fullName]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">
              Phone <RequiredMark />
            </FieldLabel>
            <Input
              id="phone"
              type="tel"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Textarea
            id="address"
            rows={3}
            placeholder="Where you're based"
            {...register("address")}
          />
          <FieldError errors={[errors.address]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="profilePicture">Profile picture URL</FieldLabel>
          <Input
            id="profilePicture"
            placeholder="https://images.example.com/me.jpg"
            aria-invalid={Boolean(errors.profilePicture)}
            {...register("profilePicture")}
          />
          <FieldError errors={[errors.profilePicture]} />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
