import type { SideBar } from "@/components/Layouts/DocLayout";

const engineSlug = "/engine";

export const sidebar: SideBar = {
  name: "Engine",
  links: [
    {
      name: "Overview",
      href: "/engine",
    },
    {
      name: "Get Started",
      href: `${engineSlug}/get-started`,
    },
    {
      name: "Production Checklist",
      href: `${engineSlug}/production-checklist`,
    },
    {
      name: "Self-Host",
      href: `${engineSlug}/self-host`,
    },
    {
      name: "Features",
      links: [
        {
          name: "Backend Wallets",
          href: `${engineSlug}/features/backend-wallets`,
        },
        {
          name: "Contracts",
          href: `${engineSlug}/features/contracts`,
        },
        {
          name: "Admins",
          href: `${engineSlug}/features/admins`,
        },
        {
          name: "Access Tokens",
          href: `${engineSlug}/features/access-tokens`,
        },
        {
          name: "Webhooks",
          href: `${engineSlug}/features/webhooks`,
        },
        {
          name: "Cancelling Transactions",
          href: `${engineSlug}/features/cancelling-transactions`,
        },
        {
          name: "Preventing Duplicate Transactions",
          href: `${engineSlug}/features/preventing-duplicate-transactions`,
        },
        {
          name: "Custom Chains",
          href: `${engineSlug}/features/custom-chains`,
        },
        {
          name: "Account Abstraction",
          href: `${engineSlug}/features/account-abstraction`,
        },
        {
          name: "Relayers",
          href: `${engineSlug}/features/relayers`,
        },
        {
          name: "Gasless Transactions",
          href: `${engineSlug}/features/gasless-transactions`,
        },
        {
          name: "Contract Subscriptions",
          href: `${engineSlug}/features/contract-subscriptions`,
        },
        {
          name: "Alert Notifications",
          href: `${engineSlug}/features/alert-notifications`,
        },
        {
          name: "Security",
          href: `${engineSlug}/features/security`,
        },
      ],
    },
    {
      name: "Guides",
      links: [
        { name: "Airdrop NFTs", href: `${engineSlug}/guides/airdrop-nfts` },
        { name: "NFT Checkout", href: `${engineSlug}/guides/nft-checkout` },
      ],
    },
    {
      name: "API Reference",
      href: "https://thirdweb-engine.apidocumentation.com/",
    },
    {
      name: "Typescript SDK",
      href: `${engineSlug}/references/typescript`,
    },
    {
      name: "Security",
      href: `${engineSlug}/security`,
    },
    {
      name: "FAQ",
      href: `${engineSlug}/faq`,
    },
    {
      name: "Troubleshooting",
      href: `${engineSlug}/troubleshooting`,
    },
  ],
};
