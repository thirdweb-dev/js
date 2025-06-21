const accountSlug = "/account";

import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      links: [
        {
          href: `${accountSlug}/create-account`,
          name: "Create Account",
        },
        {
          href: `${accountSlug}/link-accounts`,
          name: "Link Accounts",
        },
      ],
      name: "Account",
    },
    {
      links: [
        {
          href: `${accountSlug}/teams/manage-teams`,
          name: "Manage Teams",
        },
        {
          href: `${accountSlug}/teams/manage-team-members`,
          name: "Manage Team Members",
        },
        {
          href: `${accountSlug}/billing/manage-billing`,
          name: "Manage Billing",
        },
        {
          href: `${accountSlug}/teams/get-dedicated-support`,
          name: "Get Dedicated Support",
        },
      ],
      name: "Teams",
    },
    {
      links: [
        {
          href: `${accountSlug}/api-keys`,
          name: "Overview",
        },
        {
          href: `${accountSlug}/api-keys/create`,
          name: "Create API Key",
        },
        {
          href: `${accountSlug}/api-keys/use`,
          name: "Use API Key",
        },
        {
          href: `${accountSlug}/api-keys/edit-services`,
          name: "Edit enabled services",
        },
        {
          href: `${accountSlug}/api-keys/delete`,
          name: "Delete API Key",
        },
        {
          href: `${accountSlug}/api-keys/access`,
          name: "Access Restrictions",
        },
        {
          href: `${accountSlug}/api-keys/transfer-projects`,
          name: "Transfer Projects",
        },
      ],
      name: "Projects",
    },
    {
      href: `${accountSlug}/faq`,
      name: "FAQs",
    },
  ],
  name: "Teams & Accounts",
};
