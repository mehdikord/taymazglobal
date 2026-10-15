import * as z from "zod";

export function createOrderFormSchema(messages: {
  nameRequired: string;
  phoneRequired: string;
  destinationRequired: string;
  emailInvalid: string;
  quantityInvalid: string;
  termsRequired: string;
}) {
  return z
    .object({
      contactName: z.string().trim().min(2, messages.nameRequired),
      contactPhone: z.string().trim().min(6, messages.phoneRequired),
      contactEmail: z.string().trim().optional(),
      destination: z.string().trim().min(2, messages.destinationRequired),
      quantity: z.coerce.number().positive(messages.quantityInvalid).optional().or(z.literal(NaN).transform(() => undefined)),
      note: z.string().trim().optional(),
      termsAccepted: z.boolean().refine((value) => value === true, { message: messages.termsRequired }),
    })
    .refine(
      (data) => !data.contactEmail?.length || z.string().email().safeParse(data.contactEmail).success,
      { message: messages.emailInvalid, path: ["contactEmail"] },
    );
}

export type OrderFormValues = z.infer<ReturnType<typeof createOrderFormSchema>>;
