const accountSlug = "/account";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  name: "Account",
  links: [
    {
      name: "Create Account",
      href: `${accountSlug}/create-account`,
    },
    {
      name: "Link Accounts",
      href: `${accountSlug}/link-accounts`,
    },
    {
      name: "Billing",
      links: [
        {
          name: "Manage Billing",
          href: `${accountSlug}/billing/manage-billing`,
        },
        {
          name: "View Usage",
          href: `${accountSlug}/billing/view-usage`,
        },
        {
          name: "Credits",
          href: `${accountSlug}/billing/credits`,
        },
        {
          name: "Upgrade Plan",
          href: `${accountSlug}/billing/upgrade-plan`,
        },
        {
          name: "Manage Team",
          href: `${accountSlug}/billing/manage-team`,
        },
      ],
    },
    {
      name: "Projects",
      links: [
        {
          name: "Overview",
          href: `${accountSlug}/api-keys`,
        },
        {
          name: "Create API Key",
          href: `${accountSlug}/api-keys/create`,
        },
        {
          name: "Use API Key",
          href: `${accountSlug}/api-keys/use`,
        },
        {
          name: "Edit enabled services",
          href: `${accountSlug}/api-keys/edit-services`,
        },
        {
          name: "Delete API Key",
          href: `${accountSlug}/api-keys/delete`,
        },
        {
          name: "Access Restrictions",
          href: `${accountSlug}/api-keys/access`,
        },
        {
          name: "Transfer Projects",
          href: `${accountSlug}/api-keys/transfer-projects`,
        },
      ],
    },
    {
      name: "FAQs",
      href: `${accountSlug}/faq`,
    },
  ],
};
