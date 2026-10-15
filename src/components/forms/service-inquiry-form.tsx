"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { submitServiceInquiry } from "@/lib/actions/leads";
import { createServiceInquirySchema, type ServiceInquiryValues } from "@/lib/validators/forms";

type ServiceInquiryFormProps = {
  serviceSlug: string;
};

export function ServiceInquiryForm({ serviceSlug }: ServiceInquiryFormProps) {
  const forms = useTranslations("Forms");
  const [submitted, setSubmitted] = useState(false);

  const schema = createServiceInquirySchema({
    nameRequired: forms("validation.nameRequired"),
    phoneRequired: forms("validation.phoneRequired"),
    emailInvalid: forms("validation.emailInvalid"),
    privacyRequired: forms("validation.privacyRequired"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceInquiryValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacyAccepted: false },
  });

  const onSubmit = async (data: ServiceInquiryValues) => {
    const result = await submitServiceInquiry({ serviceSlug, ...data });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSubmitted(true);
    reset();
    toast.success(forms("inquiry.successTitle"), { description: forms("inquiry.successDescription") });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-brand-navy-soft p-6">
        <h3 className="text-lg font-extrabold text-brand-navy">{forms("inquiry.successTitle")}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{forms("inquiry.successDescription")}</p>
        <Button className="mt-4" variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          {forms("inquiry.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="inquiry-name">{forms("fields.name")}</Label>
        <Input id="inquiry-name" {...register("name")} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-phone">{forms("fields.phone")}</Label>
          <Input id="inquiry-phone" type="tel" {...register("phone")} aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <p className="text-sm text-danger">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-email">{forms("fields.email")}</Label>
          <Input id="inquiry-email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-company">{forms("fields.company")}</Label>
          <Input id="inquiry-company" {...register("company")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-country">{forms("fields.country")}</Label>
          <Input id="inquiry-country" {...register("country")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inquiry-message">{forms("fields.message")}</Label>
        <Textarea id="inquiry-message" rows={4} {...register("message")} />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="inquiry-privacy" {...register("privacyAccepted")} aria-invalid={Boolean(errors.privacyAccepted)} />
        <Label htmlFor="inquiry-privacy" className="text-sm leading-7 text-muted">
          {forms("fields.privacyPrefix")}{" "}
          <Link href="/privacy" className="font-bold text-brand-red hover:underline">
            {forms("fields.privacyLink")}
          </Link>
        </Label>
      </div>
      {errors.privacyAccepted && <p className="text-sm text-danger">{errors.privacyAccepted.message}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? forms("submitting") : forms("inquiry.submit")}
      </Button>
    </form>
  );
}
