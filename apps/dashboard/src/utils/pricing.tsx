import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { Link, Text } from "tw-components";

export const CONTACT_US_URL =
  "https://meetings.hubspot.com/sales-thirdweb/thirdweb-pro";

export const PLANS: {
  [T in AccountPlan]: {
    title: string;
    price: string | number;
    subTitle: string | null;
    trialPeriodDays: number;
    description: string;
    features: Array<string | string[]>;
  };
} = {
  [AccountPlan.Free]: {
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
  [AccountPlan.Growth]: {
    price: 99,
    title: "Growth",
    subTitle: "Everything in Starter, plus:",
    trialPeriodDays: 0,
    description: "Ideal for production-grade applications.",
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
  [AccountPlan.Pro]: {
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
  [AccountPlan.Enterprise]: {
    price: "$$$",
    title: "Enterprise",
    subTitle: "Everything in Pro, plus:",
    trialPeriodDays: 0,
    description: "Contact our Sales team to get you onboarded.",
    features: [],
  },
};

interface PricingItem {
  title: string;
  starter: string | string[];
  growth: string | string[];
  pro: string | string[];
  hint?: string;
  learnMore?: string;
}
interface PricingSection {
  title: string;
  items: PricingItem[];
}

export const PRICING_SECTIONS: PricingSection[] = [
  {
    title: "Usage based pricing:",
    items: [
      {
        title: "Monthly Active In-App Wallets",
        starter: ["1,000", "then $0.02/wallet"],
        growth: ["10,000", "then $0.02/wallet"],
        pro: "Custom",
      },
      {
        title: "Account Abstraction infrastructure",
        hint: "Premium on top of gas sent through relayer and paymaster.",
        starter: "10%",
        growth: "10%",
        pro: "Custom",
      },
      {
        title: "Decentralized storage pinning",
        starter: ["1GB", "then $0.10/GB"],
        growth: ["5GB", "then $0.10/GB"],
        pro: "Custom",
      },
    ],
  },
  {
    title: "Features:",
    items: [
      {
        title: "Support Channel",
        starter: "Community + AI",
        growth: "Prioritized support",
        pro: "Dedicated",
      },
      {
        title: "Guaranteed Support Response Time",
        starter: "N/A",
        growth: "48 business hours",
        pro: "Custom",
      },
      {
        title: "Rate Limits on RPC & IPFS gateway",
        starter: "100 requests/sec",
        growth: "500 requests/sec",
        pro: "Custom",
      },
      {
        title: "Custom branding for emails",
        starter: "N/A",
        growth: "checkmark",
        pro: "checkmark",
      },
      {
        title: "Custom auth for in-app wallets",
        starter: "N/A",
        growth: "checkmark",
        pro: "checkmark",
      },
      {
        title: "User analytics",
        starter: "N/A",
        growth: "checkmark",
        pro: "checkmark",
      },
      {
        title: "Global paymaster sponsorship rules",
        starter: "checkmark",
        growth: "checkmark",
        pro: "checkmark",
      },
      {
        title: "Server based sponsorship rules",
        starter: "N/A",
        growth: "checkmark",
        pro: "checkmark",
      },
      {
        title: "SLAs",
        starter: "N/A",
        growth: "N/A",
        pro: "checkmark",
      },
    ],
  },
];

export const FAQ_GENERAL = [
  {
    title: "How do I get started?",
    description: (
      <Text>
        thirdweb Starter plan is completely usage based. Simply connect your
        wallet to start using thirdweb platform. You only need to create an
        account with your email address and add payment method when you&apos;re
        approaching your monthly free usage credits (so that we can send you
        billing updates if you go over).
      </Text>
    ),
  },
  {
    title: "Which plan is right for me?",
    description: (
      <Text>
        If you are looking for production grade infrastructure, advanced
        customizations, and higher limits for transactions, Growth tier is the
        right choice. If you are looking for dedicated solutions and support
        SLAs, we recommend signing up for the Pro plan.
      </Text>
    ),
  },
  {
    title: "Do I need to talk to the sales team for the Growth plan?",
    description: (
      <Text>
        Nope! You can self serve and upgrade to the Growth plan in the Dashboard
        under{" "}
        <Link href="/dashboard/settings/billing" color="blue.500">
          Billing
        </Link>{" "}
        whenever you are ready!
      </Text>
    ),
  },
  {
    title: "Will I be able to see my usage history?",
    description: (
      <Text>
        You can review your usage history at any time on the Dashboard by
        visiting the{" "}
        <Link href="/dashboard/settings/usage" color="blue.500">
          Usage
        </Link>{" "}
        tab under Settings.
      </Text>
    ),
  },
  {
    title: "How is pricing calculated for in-app wallets?",
    description: (
      <Text>
        In-App wallets are billed based on &quot;Monthly active wallets&quot;.
      </Text>
    ),
  },
  {
    title: "What is a Monthly Active Wallet?",
    description: (
      <Text>
        A Monthly Active Wallet is defined as a wallet where a user logs in
        during the billing period.
      </Text>
    ),
  },
  {
    title: "Do you have an implementation fee?",
    description: (
      <Text>
        No, we do not have any implementation fees for any of our plans.
      </Text>
    ),
  },
];

export const FAQ_PRICING = [
  {
    title: "RPC requests",
    description: (
      <Text>
        When your app makes requests to the blockchain, and you use
        thirdweb&apos;s built-in infrastructure, it will count as a RPC request.
      </Text>
    ),
  },
  {
    title: "Storage gateway",
    description: (
      <Text>
        When your app downloads files from IPFS, and you use thirdweb&apos;s
        built-in infrastructure, it will count as a storage gateway request.
      </Text>
    ),
  },
  {
    title: "Storage pinning",
    description: (
      <Text>
        When your app uploads files to IPFS, and you use thirdweb&apos;s
        built-in infrastructure, it will count towards your storage pinning
        limit.
      </Text>
    ),
  },
  {
    title: "Monthly Active Wallet",
    description: (
      <Text>
        When a user logs in during a 30-day period in using the in-app wallet
        service, they are counted as a monthly active wallet.
      </Text>
    ),
  },
];
