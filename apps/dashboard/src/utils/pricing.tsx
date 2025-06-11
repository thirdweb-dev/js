import type { Team } from "@/api/team";

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
  starter: {
    price: 5,
    title: "Starter",
    subTitle: null,
    trialPeriodDays: 0,
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
  },
  growth: {
    price: 99,
    title: "Growth",
    subTitle: "Everything in Starter, plus:",
    trialPeriodDays: 0,
    description: "Ideal for teams building production-grade apps.",
    features: [
      "Email Support",
      "48hr Guaranteed Response",
      "Invite Team Members",
      "Custom In-App Wallet Auth",
    ],
  },
  scale: {
    price: 499,
    title: "Scale",
    description: "For funded startups and mid-size businesses.",
    subTitle: "Everything in Growth, plus:",
    trialPeriodDays: 0,
    features: [
      "Slack & Telegram Support",
      "24hr Guaranteed Response",
      "Remove thirdweb branding",
      "Audit Logs",
      [
        "Ecosystem Wallet Add-On",
        "Unlocks the ability to deploy your own ecosystem wallets.",
      ],
      [
        "Dedicated Infrastructure Add-Ons",
        "Dedicated RPC nodes, indexers, etc.",
      ],
    ],
  },
  pro: {
    price: 1499,
    isStartingPriceOnly: true,
    title: "Pro",
    subTitle: "Everything in Scale, plus:",
    trialPeriodDays: 0,
    description: "For large organizations with custom needs.",
    features: [
      "Dedicated Account Executive",
      "12hr Guaranteed Response",
      "No Rate Limits",
      ["Custom Infrastructure Add-Ons", "Infrastructure for custom chains."],
      ["Volume Discounts", "Negotiated volume discounts that fit your scale."],
    ],
  },
};
