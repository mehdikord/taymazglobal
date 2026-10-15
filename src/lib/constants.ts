export const SITE_NAME = "Taymaz Global";
export const SITE_URL = "https://taymazglobal.com";

export const MAIN_NAVIGATION = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/products", key: "products" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export const LEGAL_NAVIGATION = [
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
] as const;
