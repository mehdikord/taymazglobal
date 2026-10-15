import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
import { getServiceSlugs } from "@/lib/repositories/services";
import { getProductSlugs } from "@/lib/repositories/products";
import { getPortfolioSlugs } from "@/lib/repositories/portfolio";

type Sitemap = MetadataRoute.Sitemap;

/** Always generated at request time so the build never needs the database and the sitemap stays fresh. */
export const dynamic = "force-dynamic";

async function safeSlugs(loader: () => Promise<string[]>): Promise<string[]> {
  try {
    return await loader();
  } catch (error) {
    console.error("[sitemap] failed to load slugs", error);
    return [];
  }
}

export default async function sitemap(): Promise<Sitemap> {
  const locales = routing.locales;
  const now = new Date();

  // Static routes
  const staticRoutes: string[] = [
    "",
    "/services",
    "/products",
    "/portfolio",
    "/team",
    "/about",
    "/contact",
    "/track",
    "/privacy",
    "/terms",
  ];

  // Dynamic slugs — از پایگاه داده
  const [serviceSlugs, productSlugs, portfolioSlugs] = await Promise.all([
    safeSlugs(getServiceSlugs),
    safeSlugs(getProductSlugs),
    safeSlugs(getPortfolioSlugs),
  ]);

  const urls: Sitemap = [];

  // Static pages — همه locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${route}`]),
          ),
        },
      });
    }
  }

  // Services detail — همه locales
  for (const locale of locales) {
    for (const slug of serviceSlugs) {
      urls.push({
        url: `${SITE_URL}/${locale}/services/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/services/${slug}`]),
          ),
        },
      });
    }
  }

  // Products detail
  for (const locale of locales) {
    for (const slug of productSlugs) {
      urls.push({
        url: `${SITE_URL}/${locale}/products/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/products/${slug}`]),
          ),
        },
      });
    }
  }

  // Portfolio detail
  for (const locale of locales) {
    for (const slug of portfolioSlugs) {
      urls.push({
        url: `${SITE_URL}/${locale}/portfolio/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/portfolio/${slug}`]),
          ),
        },
      });
    }
  }

  return urls;
}
