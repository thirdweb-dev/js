const accountSlug = "/account";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  name: "Teams & Accounts",
  links: [
    {
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
      ],
    },
    {
      name: "Teams",
      links: [
        {
          name: "Manage Teams",
          href: `${accountSlug}/teams/manage-teams`,
        },
        {
          name: "Manage Team Members",
          href: `${accountSlug}/teams/manage-team-members`,
        },
        {
          name: "Manage Billing",
          href: `${accountSlug}/billing/manage-billing`,
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
