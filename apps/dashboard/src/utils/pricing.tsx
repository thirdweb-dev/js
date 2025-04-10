import type { Team } from "../@/api/team";

type SelectivePlans = Exclude<
  Team["billingPlan"],
  // we will never show cards for these plans - so exclude it
  "pro" | "growth_legacy" | "free" | "starter_legacy"
>;

export const TEAM_PLANS: Record<
  SelectivePlans,
  {
    title: string;
    price: string | number;
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
    description: "Ideal for hobbyists who require basic features.",
    features: [
      "$25 Usage Credits",
      "Community Support",
      "Web, Mobile & Gaming SDKs",
      "Contract and Wallet APIs",
      "Audited smart contracts",
      "Account Abstraction",
      "Blockchain Infra (RPC, IPFS)",
    ],
  },
  growth: {
    price: 75,
    title: "Growth",
    subTitle: "Everything in Starter, plus:",
    trialPeriodDays: 0,
    description: "Ideal for scalable production-grade apps.",
    features: [
      "$100 Usage Credits",
      "Email support",
      "SMS Onboarding",
      "30d User Analytics",
      "Gas grant for transactions",
    ],
  },
  accelerate: {
    price: 250,
    title: "Accelerate",
    subTitle: "Everything in Growth, plus:",
    trialPeriodDays: 0,
    description: "For funded startups and mid-size businesses.",
    features: [
      "$250 Usage Credits",
      "Custom Wallet Branding & Auth",
      "Dedicated Engine Server",
      "24hr Guaranteed Support",
      "90d User Analytics",
    ],
  },
  scale: {
    price: 500,
    title: "Scale",
    description: "For large organizations with custom needs.",
    subTitle: "Everything in Accelerate, plus:",
    trialPeriodDays: 0,
    features: [
      "$400 Usage Credits",
      "12hr Guaranteed Response",
      "Slack Channel Support",
      "Whitelabel Infra Support",
      "Ultra-high Rate Limits",
      "Ecosystem Wallets",
    ],
  },
};
