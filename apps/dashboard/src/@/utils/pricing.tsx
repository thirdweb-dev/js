import type { Team } from "@/api/team/get-team";

type SelectivePlans = Exclude<
  Team["billingPlan"],
  // we will never show cards for these plans - so exclude it
  "accelerate" | "growth_legacy" | "free"
>;

export const TEAM_PLANS: Record<
  SelectivePlans,
  {
    title: string;
    isStartingPriceOnly?: boolean;
    price: number;
    subTitle: string | null;
    trialPeriodDays: number;
    description: string;
    features: Array<string | string[]>;
  }
> = {
  growth: {
    description: "Ideal for small scale teams and startups.",
    features: [
      "Custom In-App Wallet Auth",
      "Web, Mobile & Gaming SDKs",
      "Server Wallets",
      "Contract & Wallet APIs",
      "Account Abstraction",
      "Managed Infrastructure (RPC, IPFS, etc.)",
      "Audited smart contracts",
    ],
    price: 99,
    subTitle: null,
    title: "Growth",
    trialPeriodDays: 0,
  },
  pro: {
    description: "For large orgs with custom needs.",
    features: [
      "Dedicated Account Executive",
      "Slack & Telegram Support",
      "12hr Guaranteed Response",
      "No Rate Limits",
      "Custom Infrastructure Add-Ons",
      "Negotiated Volume Discounts",
    ],
    isStartingPriceOnly: true,
    price: 1499,
    subTitle: "Everything in Scale, plus:",
    title: "Pro",
    trialPeriodDays: 0,
  },
  scale: {
    description: "Ideal for mid-size businesses.",
    features: [
      "Email Support",
      "24hr Guaranteed Response",
      "Remove thirdweb branding",
      "Audit Logs",
      "Ecosystem Wallet Add-On",
      "Dedicated Infrastructure Add-Ons (RPC, Insight)",
    ],
    price: 499,
    subTitle: "Everything in Growth, plus:",
    title: "Scale",
    trialPeriodDays: 0,
  },
  starter: {
    description: "Ideal for individual developers who require basic features.",
    features: [
      "Community & AI Support",
      "Web, Mobile & Gaming SDKs",
      "Contract and Wallet APIs",
      "Audited smart contracts",
      "Managed Infrastructure (RPC, IPFS)",
      "Account Abstraction",
      "Engine Cloud",
    ],
    price: 5,
    subTitle: null,
    title: "Starter",
    trialPeriodDays: 0,
  },
};
