import {User, UserRole} from "@prisma/client";

import {Icons} from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
};

export type NavItem = {
  id: string;
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  id: string,
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  benefits: string[];
  description: string;
  limitations: string[];
  maxAlerts: number;
  maxApiKeys: number;
  maxWebSockets: number;
  planId: "free" | "developer" | "enterprise";
  allowedWebcastSignRoutes: {
    routeUrl: string,
    routeLabel: string,
    routeDesc?: string
  }[];
  prices: {
    monthly: number;
    monthlySale?: number;
  };
  rateLimits: {
    minute: number;
    hour: number;
    day: number;
  };
  stripeIds: {
    monthly: string | null;
    monthly_legacy?: string | null;
  }
  title: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
  stripeCurrentPeriodEnd: number;
  isPaid: boolean;
  interval: "month" | "year" | null;
  isCanceled?: boolean;
};

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};

// landing sections
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type PlatformLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  image: string;
  review: string;
};

export type IApiKeyWithPermissions = {
  scopes: number[],
  allowedWebcastSignRoutes: string[],
  id: number,
  name: string,
  value: string,
  created_at: string,
  updated_at: string,
  account_id: number
}
