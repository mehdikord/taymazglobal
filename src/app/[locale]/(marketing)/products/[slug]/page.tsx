import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/products/product-gallery";
import { ProductOrderCta, ProductStickyBar } from "@/components/products/product-order";
import { ProductSpecs } from "@/components/products/product-specs";
import { RelatedProducts } from "@/components/products/related-products";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import type { AppLocale } from "@/i18n/routing";
import { formatProductPrice } from "@/lib/formatters/price";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/repositories/products";

type ProductDetailPageProps = { params: Promise<{ locale: AppLocale; slug: string }> };

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: getLocalizedText(product.title, locale),
    description: getLocalizedText(product.summary, locale),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const products = await getTranslations({ locale, namespace: "Products" });
  const categoryTitle = product.categoryTitle
    ? getLocalizedText(product.categoryTitle, locale)
    : null;
  const related = await getRelatedProducts(product);
  const title = getLocalizedText(product.title, locale);
  const priceLabel = formatProductPrice(product, locale, {
    inquiry: products("priceInquiry"),
    from: products("priceFrom"),
    perUnit: products("pricePerUnit"),
  });

  return (
    <>
      <PageHero
        eyebrow={products("detailEyebrow")}
        title={title}
        description={getLocalizedText(product.summary, locale)}
        breadcrumbs={[
          { href: "/", label: products("breadcrumbHome") },
          { href: "/products", label: products("breadcrumbProducts") },
          { label: title },
        ]}
        breadcrumbLabel={products("breadcrumbLabel")}
      />

      <section className="py-12 sm:py-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ProductGallery media={product.media} locale={locale} videoLabel={products("videoPlaceholder")} />

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap gap-2">
              {categoryTitle && <Badge>{categoryTitle}</Badge>}
              <Badge variant="neutral">
                {product.type === "physical" ? products("typePhysical") : products("typeService")}
              </Badge>
              {product.featured && <Badge className="border-0 bg-brand-red text-white">{products("featured")}</Badge>}
            </div>

            <p className="text-2xl font-extrabold text-brand-navy">{priceLabel}</p>
            <p className="text-sm leading-8 text-muted">{getLocalizedText(product.description, locale)}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={getLocalizedText(tag, locale)} variant="neutral">
                  {getLocalizedText(tag, locale)}
                </Badge>
              ))}
            </div>

            <ProductOrderCta
              productSlug={product.slug}
              primaryLabel={products("orderCta")}
              secondaryLabel={products("inquiryCta")}
            />
          </div>
        </div>
      </section>

      <section className="border-t bg-surface py-12 sm:py-16">
        <div className="container-shell max-w-3xl">
          <ProductSpecs specs={product.specs} locale={locale} title={products("specsTitle")} />
        </div>
      </section>

      <RelatedProducts products={related} locale={locale} />

      <div className="pb-24 lg:pb-0">
        <ProductStickyBar
          productSlug={product.slug}
          title={title}
          priceLabel={priceLabel}
          orderLabel={products("orderCta")}
        />
      </div>
    </>
  );
}
