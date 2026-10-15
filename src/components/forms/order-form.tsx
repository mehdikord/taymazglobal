"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { OrderConfirmation } from "@/components/products/product-order";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { submitOrder } from "@/lib/actions/orders";
import { createOrderFormSchema, type OrderFormValues } from "@/lib/validators/order";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import type { Product } from "@/types";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { formatProductPrice } from "@/lib/formatters/price";

type OrderFormProps = {
  product: Product;
  locale: AppLocale;
};

export function OrderForm({ product, locale }: OrderFormProps) {
  const forms = useTranslations("Order");
  const products = useTranslations("Products");
  const user = useAuthStore((state) => state.user);
  const addOrder = useOrderStore((state) => state.addOrder);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const schema = createOrderFormSchema({
    nameRequired: forms("validation.nameRequired"),
    phoneRequired: forms("validation.phoneRequired"),
    destinationRequired: forms("validation.destinationRequired"),
    emailInvalid: forms("validation.emailInvalid"),
    quantityInvalid: forms("validation.quantityInvalid"),
    termsRequired: forms("validation.termsRequired"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactName: user?.name ?? "",
      contactEmail: user?.email ?? "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    const result = await submitOrder({
      productSlug: product.slug,
      destination: data.destination,
      quantity: data.quantity,
      note: data.note,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      userId: user?.id,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const order = result.order;
    addOrder(order);
    setOrderNumber(order.orderNumber);
    toast.success(forms("successTitle"));
  };

  if (orderNumber) {
    return (
      <OrderConfirmation
        orderNumber={orderNumber}
        title={forms("successTitle")}
        description={forms("successDescription")}
        trackingHint={forms("trackingHint")}
        trackLabel={forms("trackCta")}
        homeLabel={forms("homeCta")}
      />
    );
  }

  const productTitle = getLocalizedText(product.title, locale);
  const priceLabel = formatProductPrice(product, locale, {
    inquiry: products("priceInquiry"),
    from: products("priceFrom"),
    perUnit: products("pricePerUnit"),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-2xl border bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">{forms("productLabel")}</p>
        <p className="mt-1 text-lg font-extrabold text-brand-navy">{productTitle}</p>
        <p className="mt-1 text-sm font-bold text-brand-red">{priceLabel}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order-name">{forms("fields.name")}</Label>
          <Input id="order-name" {...register("contactName")} aria-invalid={Boolean(errors.contactName)} />
          {errors.contactName && <p className="text-sm text-danger">{errors.contactName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-phone">{forms("fields.phone")}</Label>
          <Input id="order-phone" type="tel" {...register("contactPhone")} aria-invalid={Boolean(errors.contactPhone)} />
          {errors.contactPhone && <p className="text-sm text-danger">{errors.contactPhone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-email">{forms("fields.email")}</Label>
        <Input id="order-email" type="email" {...register("contactEmail")} aria-invalid={Boolean(errors.contactEmail)} />
        {errors.contactEmail && <p className="text-sm text-danger">{errors.contactEmail.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order-destination">{forms("fields.destination")}</Label>
          <Input id="order-destination" {...register("destination")} aria-invalid={Boolean(errors.destination)} />
          {errors.destination && <p className="text-sm text-danger">{errors.destination.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-quantity">{forms("fields.quantity")}</Label>
          <Input id="order-quantity" type="number" min={1} {...register("quantity")} />
          {errors.quantity && <p className="text-sm text-danger">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-note">{forms("fields.note")}</Label>
        <Textarea id="order-note" rows={4} {...register("note")} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="order-terms" {...register("termsAccepted")} aria-invalid={Boolean(errors.termsAccepted)} />
        <Label htmlFor="order-terms" className="text-sm leading-7 text-muted">
          {forms("fields.termsPrefix")}{" "}
          <Link href="/terms" className="font-bold text-brand-red hover:underline">
            {forms("fields.termsLink")}
          </Link>
        </Label>
      </div>
      {errors.termsAccepted && <p className="text-sm text-danger">{errors.termsAccepted.message}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? forms("submitting") : forms("submit")}
      </Button>
    </form>
  );
}
