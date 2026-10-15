"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, CheckCircle2, FileText, Handshake, Headset, Mail, MessageSquareText, Phone, Send, ShieldCheck, Tag, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import { submitContactMessage } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";
import { createContactFormSchema, type ContactFormValues } from "@/lib/validators/forms";

const MESSAGE_TYPES = [
  { value: "consultation", icon: Briefcase },
  { value: "partnership", icon: Handshake },
  { value: "support", icon: Headset },
  { value: "other", icon: MessageSquareText },
] as const;

export function ContactForm() {
  const forms = useTranslations("Forms");
  const contact = useTranslations("Contact");
  const reduce = useReducedMotion() ?? false;
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
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", subject: "", messageType: "", message: "", phone: "", email: "", privacyAccepted: false },
  });

  const messageType = useWatch({ control, name: "messageType" });
  const message = useWatch({ control, name: "message" }) ?? "";

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

  const number = (value: number) => value.toLocaleString("en-US");

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="success"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          className="contact-success"
        >
          <span className="contact-success-icon">
            <CheckCircle2 className="size-9" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl font-extrabold text-brand-navy">{forms("contact.successTitle")}</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-muted">{forms("contact.successDescription")}</p>
          <p className="mt-1 text-sm text-muted">{contact("successAlternative")}</p>
          <button type="button" onClick={() => setSubmitted(false)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-navy/15 px-4 text-sm font-bold text-brand-navy transition hover:bg-brand-navy-soft focus-ring">
            {forms("contact.sendAnother")}
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" initial={false} exit={reduce ? undefined : { opacity: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* message type */}
          <fieldset>
            <legend className="contact-label">{forms("fields.messageType")}</legend>
            <p className="mt-0.5 text-xs text-muted">{contact("typeHint")}</p>
            <input type="hidden" {...register("messageType")} />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MESSAGE_TYPES.map(({ value, icon: Icon }) => {
                const active = messageType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setValue("messageType", value, { shouldValidate: true, shouldDirty: true })}
                    className={cn("contact-type focus-ring", active && "contact-type-active")}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {forms(`messageTypes.${value}`)}
                  </button>
                );
              })}
            </div>
            {errors.messageType ? <p className="contact-error">{errors.messageType.message}</p> : null}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="contact-label">{forms("fields.name")}</label>
              <div className={cn("contact-field", errors.name && "contact-field-error")}>
                <User className="contact-field-icon" aria-hidden="true" />
                <input id="contact-name" autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} className="contact-input" />
              </div>
              {errors.name ? <p className="contact-error">{errors.name.message}</p> : null}
            </div>
            <div>
              <label htmlFor="contact-subject" className="contact-label">{forms("fields.subject")}</label>
              <div className={cn("contact-field", errors.subject && "contact-field-error")}>
                <Tag className="contact-field-icon" aria-hidden="true" />
                <input id="contact-subject" {...register("subject")} aria-invalid={Boolean(errors.subject)} className="contact-input" />
              </div>
              {errors.subject ? <p className="contact-error">{errors.subject.message}</p> : null}
            </div>
          </div>

          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className="contact-label">{forms("fields.phone")}</label>
                <div className={cn("contact-field", errors.phone && "contact-field-error")}>
                  <Phone className="contact-field-icon" aria-hidden="true" />
                  <input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" {...register("phone")} aria-invalid={Boolean(errors.phone)} className="contact-input text-start" />
                </div>
                {errors.phone ? <p className="contact-error">{errors.phone.message}</p> : null}
              </div>
              <div>
                <label htmlFor="contact-email" className="contact-label">{forms("fields.email")}</label>
                <div className={cn("contact-field", errors.email && "contact-field-error")}>
                  <Mail className="contact-field-icon" aria-hidden="true" />
                  <input id="contact-email" type="email" inputMode="email" autoComplete="email" dir="ltr" {...register("email")} aria-invalid={Boolean(errors.email)} className="contact-input text-start" />
                </div>
                {errors.email ? <p className="contact-error">{errors.email.message}</p> : null}
              </div>
            </div>
            {!errors.phone && !errors.email ? <p className="mt-2 text-[11px] font-semibold text-slate-400">{contact("contactHint")}</p> : null}
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="contact-message" className="contact-label">{forms("fields.message")}</label>
              <span className="text-[11px] font-semibold tabular-nums text-slate-400">{contact("charCount", { count: number(message.length) })}</span>
            </div>
            <div className={cn("contact-field contact-field-textarea", errors.message && "contact-field-error")}>
              <FileText className="contact-field-icon" aria-hidden="true" />
              <textarea id="contact-message" rows={5} {...register("message")} aria-invalid={Boolean(errors.message)} className="contact-input contact-textarea" />
            </div>
            {errors.message ? <p className="contact-error">{errors.message.message}</p> : null}
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
            <input type="checkbox" {...register("privacyAccepted")} aria-invalid={Boolean(errors.privacyAccepted)} className="contact-checkbox mt-1" />
            <span>
              {forms("fields.privacyPrefix")}{" "}
              <Link href="/privacy" className="font-bold text-brand-red underline decoration-brand-red/30 underline-offset-4 hover:decoration-brand-red">{forms("fields.privacyLink")}</Link>
            </span>
          </label>
          {errors.privacyAccepted ? <p className="contact-error -mt-4">{errors.privacyAccepted.message}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={isSubmitting} className="contact-submit group focus-ring">
              {isSubmitting ? forms("submitting") : forms("contact.submit")}
              <Send className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </button>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="size-4 text-emerald-500" aria-hidden="true" />
              {contact("secure")}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
