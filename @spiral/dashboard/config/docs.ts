import {DocsConfig} from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      id: "Pricing",
      title: "Pricing",
      href: "/pricing"
    },
    {
      id: "Docs",
      title: "Documentation",
      href: "/docs",
    }
  ],
  sidebarNav: [
    {
      id: "getting-started",
      title: "Getting Started",
      items: [
        {
          id: "tiktok-live-libraries",
          title: "1. Intro to TikTokLive",
          href: "/docs",
        },
        {
          id: "legality",
          title: "2. The Legality of Scraping",
          href: "/docs/legality"
        },
        {
          id: "signatures",
          title: "3. Why do you need us?",
          href: "/docs/signatures"

        }
      ],
    },
    {
      id: "sign-server-docs",
      title: "Sign Server Docs",
      items: [
        {
          id: "openapi-docs",
          title: "1. OpenAPI Docs",
          href: "/docs/openapi"
        },
        {
          id: "rate-limits",
          title: "2. Rate Limits",
          href: "/docs/sign-server/rate-limits"
        },
        {
          id: "custom-sign-servers",
          title: "3. Custom Sign Servers",
          href: "/docs/sign-server/custom-sign-servers"
        },
      ]
    },
    {
      id: "Using API Keys",
      title: "API Key Usage",
      items: [
        {
          id: "api-key-usage-python",
          title: "1. Python",
          href: "/docs/api-key-usage/python",
        },
        {
          id: "api-key-usage-node.js",
          title: "2. Node.js",
          href: "/docs/api-key-usage/nodejs",
        },
        {
          id: "api-key-usage-java",
          title: "3. Java",
          href: "/docs/api-key-usage/java",
        },
        {
          id: "api-key-usage-go",
          title: "4. Go",
          href: "/docs/api-key-usage/go",
        },
        {
          id: "api-key-usage-c-unity",
          title: "5. C# / Unity",
          href: "/docs/api-key-usage/csharp-unity",
        }
      ]
    }
  ],
};
