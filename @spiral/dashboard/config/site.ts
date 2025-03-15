import {SidebarNavItem, SiteConfig} from "types";
import {env} from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Euler Spiral",
  description: "Build enterprise 3rd-party integrations with realtime live data access.",
  url: site_url,
  ogImage: `${site_url}/_static/og_new.jpg`,
  mailSupport: "support@eulerstream.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    id: "legal",
    title: "Legal Notices",
    items: [
      {id: "legal", title: "Terms of Service", href: "/terms"},
      {id: "privacy", title: "Privacy Policy", href: "/privacy"}
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      {id: "discord-comm", title: "Discord Community", href: "/discord"},
      {id: "email-link", title: "E-Mail", href: `mailto:${siteConfig.mailSupport}`},
    ],
  },
  {
    id: "docs",
    title: "Documentation",
    items: [
      {
        id: "docs-link",
        title: "Documenation",
        href: "/docs"
      }
    ]
  }
];
