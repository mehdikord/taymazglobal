import { Briefcase, Coins, Box, Headphones, Globe, Map, Package, Search, Shield, Ship, Truck, type LucideIcon } from "lucide-react";

import type { Service } from "@/types";

const SERVICE_ICONS: Record<Service["icon"], LucideIcon> = {
  globe: Globe,
  ship: Ship,
  package: Package,
  shield: Shield,
  truck: Truck,
  map: Map,
  search: Search,
  briefcase: Briefcase,
  coins: Coins,
  box: Box,
  headset: Headphones,
};

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS) as Service["icon"][];

export function getServiceIcon(icon: Service["icon"]): LucideIcon {
  return SERVICE_ICONS[icon];
}
