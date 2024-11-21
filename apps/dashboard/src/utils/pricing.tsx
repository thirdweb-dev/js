import type { Team } from "../@/api/team";

type NonFreeTeamPlan = Exclude<Team["billingPlan"], "free">;

export const TEAM_PLANS: Record<
  NonFreeTeamPlan,
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
    title: "Starter",
    price: 0,
    subTitle: null,
    trialPeriodDays: 0,
    description: "Ideal for hobbyists who require basic features.",
    features: [
      ["1,000 monthly active wallets", "then $0.02/wallet"],
      "Web, Mobile & Gaming SDKs",
      "Contract & Wallet APIs",
      "Audited smart contracts",
      "Community Support",
      "Blockchain infra (RPC, IPFS)",
    ],
  },
  growth: {
    price: 99,
    title: "Growth",
    subTitle: "Everything in Starter, plus:",
    trialPeriodDays: 0,
    description: "Ideal for scaling, production-grade applications.",
    features: [
      ["10,000 monthly active wallets", "then $0.02/wallet"],
      "Production grade infrastructure",
      "Prioritized support",
      "Custom branding",
      "User analytics",
      "Third party auth support",
      "Advanced paymaster rules",
    ],
  },
  pro: {
    price: "Custom",
    title: "Pro",
    subTitle: "Everything in Growth, plus:",
    trialPeriodDays: 0,
    description:
      "Ideal for teams that require more customization, SLAs, and support.",
    features: [
      "Custom rate limits for APIs & Infra",
      "Dedicated support channel",
      "Guaranteed support response time",
      "Direct access to solutions & engineering teams",
      "Enterprise grade SLAs",
    ],
  },
};
