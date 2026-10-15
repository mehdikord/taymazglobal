export type LocalizedText = {
  fa: string;
  en: string;
  tr: string;
  ru: string;
};

export type NavigationItem = {
  href: string;
  label: string;
};

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export type AsyncState = "idle" | "loading" | "success" | "error";

export type OrderStatus =
  | "pending"
  | "reviewing"
  | "preparing"
  | "inProgress"
  | "completed"
  | "cancelled";

export type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type Service = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  icon: "globe" | "ship" | "package" | "shield" | "truck" | "map" | "search" | "briefcase" | "coins" | "box" | "headset";
  benefits: LocalizedText[];
  steps: LocalizedText[];
  countries: LocalizedText[];
  tags: LocalizedText[];
  featured: boolean;
  faq: FaqItem[];
};

export type Office = {
  id: string;
  city: LocalizedText;
  country: LocalizedText;
  address: LocalizedText;
  phone: string;
  email: string;
  hours: LocalizedText;
  isHeadOffice: boolean;
};

export type StatItem = {
  value: string;
  label: LocalizedText;
};

export type TransportMode = "sea" | "air" | "road" | "rail";

export type CountryMarket = {
  code: string;
  name: LocalizedText;
  region: LocalizedText;
  /** Main trade city shown on the map. */
  city: LocalizedText;
  lat: number;
  lon: number;
  timeZone: string;
  /** Approximate transit from the Istanbul hub (0 = hub itself). */
  transitDays: number;
  modes: TransportMode[];
  sectors: LocalizedText[];
};

export type ProcessStep = {
  step: number;
  title: LocalizedText;
  description: LocalizedText;
  /** Typical duration label, e.g. "24 hours". */
  duration: LocalizedText;
  /** Concrete deliverables of the step. */
  details: LocalizedText[];
};

export type Advantage = {
  title: LocalizedText;
  description: LocalizedText;
  /** Short proof point shown as a badge, e.g. "40+ countries". */
  badge: LocalizedText;
};

export type HomeTeaser = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  href: string;
  category: LocalizedText;
  imageUrl?: string;
};

export type ProductType = "physical" | "service";
export type PriceType = "fixed" | "inquiry" | "range";

export type ProductSpec = {
  label: LocalizedText;
  value: LocalizedText;
};

export type ProductMedia = {
  id: string;
  type: "image" | "video";
  alt: LocalizedText;
  gradient: string;
  imageUrl?: string;
};

export type ProductCategory = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  gradient: string;
  accent: string;
};

export type Product = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  type: ProductType;
  categorySlug: string;
  categoryTitle?: LocalizedText;
  price?: number;
  priceMax?: number;
  priceType: PriceType;
  currency?: "USD" | "EUR" | "TRY";
  tags: LocalizedText[];
  specs: ProductSpec[];
  featured: boolean;
  media: ProductMedia[];
};

export type ProductFilters = {
  q?: string;
  category?: string;
  type?: ProductType;
  price?: "fixed" | "inquiry";
};

export type CommerceOrderStatus = "pending_approval" | "preparing" | "in_transit" | "completed" | "cancelled";

export type OrderLog = {
  status: CommerceOrderStatus;
  timestamp: string;
  note?: LocalizedText;
};

export type CommerceOrder = {
  id: string;
  orderNumber: string;
  userId?: string;
  productSlug: string;
  productTitle: LocalizedText;
  destination: string;
  quantity?: number;
  note?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  status: CommerceOrderStatus;
  trackingCode?: string | null;
  logs: OrderLog[];
  createdAt: string;
};

export type CreateOrderInput = {
  productSlug: string;
  destination: string;
  quantity?: number;
  note?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  userId?: string;
};

export type PortfolioGalleryItem = {
  id: string;
  alt: LocalizedText;
  gradient: string;
  imageUrl?: string;
};

export type PortfolioMetric = {
  value: string;
  label: LocalizedText;
};

export type PortfolioItem = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  serviceSlug: string;
  serviceName?: LocalizedText;
  country: LocalizedText;
  year: number;
  route: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  outcome: LocalizedText;
  metrics: PortfolioMetric[];
  gallery: PortfolioGalleryItem[];
  featured: boolean;
  gradient: string;
};

export type PortfolioFilters = {
  service?: string;
  country?: string;
  year?: number;
};

export type TeamDepartment = "leadership" | "operations" | "customs" | "sales" | "logistics";

export type TeamMember = {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  department: TeamDepartment;
  bio: LocalizedText;
  linkedIn?: string;
  order: number;
  accent: string;
};

export type LegalSection = {
  id: string;
  title: LocalizedText;
  paragraphs: LocalizedText[];
};
