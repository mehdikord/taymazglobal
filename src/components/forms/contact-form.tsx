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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { submitContactMessage } from "@/lib/actions/leads";
import { createContactFormSchema, type ContactFormValues } from "@/lib/validators/forms";

export function ContactForm() {
  const forms = useTranslations("Forms");
  const contact = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);

  const schema = createContactFormSchema({
    nameRequired: forms("validation.nameRequired"),
    subjectRequired: forms("validation.subjectRequired"),
    messageRequired: forms("validation.messageRequired"),
    messageTypeRequired: forms("validation.messageTypeRequired"),
    contactRequired: forms("validation.contactRequired"),
    emailInvalid: forms("validation.emailInvalid"),
    privacyRequired: forms("validation.privacyRequired"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacyAccepted: false },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const result = await submitContactMessage(data);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSubmitted(true);
    reset();
    toast.success(forms("contact.successTitle"), { description: forms("contact.successDescription") });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-brand-navy-soft p-8 text-center">
        <h3 className="text-xl font-extrabold text-brand-navy">{forms("contact.successTitle")}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{forms("contact.successDescription")}</p>
        <p className="mt-2 text-sm text-muted">{contact("successAlternative")}</p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
          {forms("contact.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">{forms("fields.name")}</Label>
          <Input id="contact-name" {...register("name")} aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">{forms("fields.subject")}</Label>
          <Input id="contact-subject" {...register("subject")} aria-invalid={Boolean(errors.subject)} />
          {errors.subject && <p className="text-sm text-danger">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">{forms("fields.phone")}</Label>
          <Input id="contact-phone" type="tel" {...register("phone")} aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <p className="text-sm text-danger">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">{forms("fields.email")}</Label>
          <Input id="contact-email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-type">{forms("fields.messageType")}</Label>
        <Select id="contact-type" {...register("messageType")} aria-invalid={Boolean(errors.messageType)}>
          <option value="">{forms("fields.selectPlaceholder")}</option>
          <option value="consultation">{forms("messageTypes.consultation")}</option>
          <option value="partnership">{forms("messageTypes.partnership")}</option>
          <option value="support">{forms("messageTypes.support")}</option>
          <option value="other">{forms("messageTypes.other")}</option>
        </Select>
        {errors.messageType && <p className="text-sm text-danger">{errors.messageType.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">{forms("fields.message")}</Label>
        <Textarea id="contact-message" rows={5} {...register("message")} aria-invalid={Boolean(errors.message)} />
        {errors.message && <p className="text-sm text-danger">{errors.message.message}</p>}
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="contact-privacy" {...register("privacyAccepted")} aria-invalid={Boolean(errors.privacyAccepted)} />
        <Label htmlFor="contact-privacy" className="text-sm leading-7 text-muted">
          {forms("fields.privacyPrefix")}{" "}
          <Link href="/privacy" className="font-bold text-brand-red hover:underline">
            {forms("fields.privacyLink")}
          </Link>
        </Label>
      </div>
      {errors.privacyAccepted && <p className="text-sm text-danger">{errors.privacyAccepted.message}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? forms("submitting") : forms("contact.submit")}
      </Button>
    </form>
  );
}
