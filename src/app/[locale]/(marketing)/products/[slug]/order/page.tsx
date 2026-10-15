import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductOrderGuard } from "@/components/products/product-order-guard";
import { PageHero } from "@/components/shared/page-hero";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getProductBySlug } from "@/lib/repositories/products";

type ProductOrderPageProps = { params: Promise<{ locale: AppLocale; slug: string }> };

export async function generateMetadata({ params }: ProductOrderPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const products = await getTranslations({ locale, namespace: "Products" });
  return {
    title: `${products("orderTitle")} — ${getLocalizedText(product.title, locale)}`,
    description: products("orderDescription"),
  };
}

export default async function ProductOrderPage({ params }: ProductOrderPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const products = await getTranslations({ locale, namespace: "Products" });
  const title = getLocalizedText(product.title, locale);

  return (
    <>
      <PageHero
        eyebrow={products("orderEyebrow")}
        title={products("orderTitle")}
        description={products("orderDescription")}
        breadcrumbs={[
          { href: "/", label: products("breadcrumbHome") },
          { href: "/products", label: products("breadcrumbProducts") },
          { href: `/products/${product.slug}`, label: title },
          { label: products("orderBreadcrumb") },
        ]}
        breadcrumbLabel={products("breadcrumbLabel")}
      />
      <section className="py-12 sm:py-16">
        <div className="container-shell max-w-2xl">
          <ProductOrderGuard product={product} locale={locale} />
        </div>
      </section>
    </>
  );
}
