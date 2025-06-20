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
  growth: {
    description: "Ideal for teams building production-grade apps.",
    features: [
      "Email Support",
      "48hr Guaranteed Response",
      "Invite Team Members",
      "Custom In-App Wallet Auth",
    ],
    price: 99,
    subTitle: "Everything in Starter, plus:",
    title: "Growth",
    trialPeriodDays: 0,
  },
  pro: {
    description: "For large organizations with custom needs.",
    features: [
      "Dedicated Account Executive",
      "12hr Guaranteed Response",
      "No Rate Limits",
      ["Custom Infrastructure Add-Ons", "Infrastructure for custom chains."],
      ["Volume Discounts", "Negotiated volume discounts that fit your scale."],
    ],
    isStartingPriceOnly: true,
    price: 1499,
    subTitle: "Everything in Scale, plus:",
    title: "Pro",
    trialPeriodDays: 0,
  },
  scale: {
    description: "For funded startups and mid-size businesses.",
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
