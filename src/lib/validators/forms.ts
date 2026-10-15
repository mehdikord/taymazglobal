import * as z from "zod";

export function createContactFormSchema(messages: {
  nameRequired: string;
  subjectRequired: string;
  messageRequired: string;
  messageTypeRequired: string;
  contactRequired: string;
  emailInvalid: string;
  privacyRequired: string;
}) {
  return z
    .object({
      name: z.string().trim().min(2, messages.nameRequired),
      subject: z.string().trim().min(3, messages.subjectRequired),
      messageType: z.string().min(1, messages.messageTypeRequired),
      message: z.string().trim().min(10, messages.messageRequired),
      phone: z.string().trim().optional(),
      email: z.string().trim().optional(),
      privacyAccepted: z.boolean().refine((value) => value === true, { message: messages.privacyRequired }),
    })
    .refine((data) => Boolean(data.phone?.length || data.email?.length), {
      message: messages.contactRequired,
      path: ["phone"],
    })
    .refine(
      (data) => !data.email?.length || z.string().email().safeParse(data.email).success,
      { message: messages.emailInvalid, path: ["email"] },
    );
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;

export function createServiceInquirySchema(messages: {
  nameRequired: string;
  phoneRequired: string;
  emailInvalid: string;
  privacyRequired: string;
}) {
  return z
    .object({
      name: z.string().trim().min(2, messages.nameRequired),
      phone: z.string().trim().min(6, messages.phoneRequired),
      email: z.string().trim().optional(),
      company: z.string().trim().optional(),
      country: z.string().trim().optional(),
      message: z.string().trim().optional(),
      privacyAccepted: z.boolean().refine((value) => value === true, { message: messages.privacyRequired }),
    })
    .refine(
      (data) => !data.email?.length || z.string().email().safeParse(data.email).success,
      { message: messages.emailInvalid, path: ["email"] },
    );
}

export type ServiceInquiryValues = z.infer<ReturnType<typeof createServiceInquirySchema>>;
