import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type {
  EngineAlert,
  EngineAlertRule,
  EngineNotificationChannel,
} from "@3rdweb-sdk/react/hooks/useEngine";

export function projectStub(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date().toISOString(),
    domains: [] as string[],
    id: id,
    updatedAt: new Date().toISOString(),
    teamId: teamId,
    slug: `project-${id}`,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    lastAccessedAt: null,
    image: null,
    services: [],
    walletAddresses: [],
    secretKeys: [],
  };

  return project;
}

export function teamStub(id: string, billingPlan: Team["billingPlan"]): Team {
  const team: Team = {
    id: `team-${id}-id`,
    billingPlan: billingPlan,
    supportPlan: billingPlan,
    billingStatus: "validPayment",
    name: `Team ${id}`,
    slug: `team-${id}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    billingEmail: "foo@example.com",
    growthTrialEligible: false,
    billingPlanVersion: 1,
    canCreatePublicChains: null,
    image: null,
    isOnboarded: true,
    enabledScopes: [
      "pay",
      "storage",
      "rpc",
      "bundler",
      "insight",
      "embeddedWallets",
      "relayer",
      "chainsaw",
    ],
    stripeCustomerId: "cus_1234567890",
    capabilities: {
      platform: {
        auditLogs: true,
        ecosystemWallets: true,
        seats: true,
      },
      rpc: {
        enabled: true,
        rateLimit: 1000,
      },
      storage: {
        enabled: true,
        download: {
          rateLimit: 1000,
        },
        upload: {
          totalFileSizeBytesLimit: 1_000_000_000,
          rateLimit: 1000,
        },
      },
      bundler: {
        enabled: true,
        rateLimit: 1000,
        mainnetEnabled: true,
      },
      insight: {
        enabled: true,
        rateLimit: 1000,
        webhooks: true,
      },
      embeddedWallets: {
        enabled: true,
        customAuth: true,
        customBranding: true,
        sms: {
          domestic: true,
          international: true,
        },
      },
      nebula: {
        enabled: true,
        rateLimit: 1000,
      },
      engineCloud: {
        enabled: true,
        rateLimit: 100,
        mainnetEnabled: true,
      },
      pay: {
        enabled: true,
        rateLimit: 1000,
      },
    },
    planCancellationDate: null,
    unthreadCustomerId: null,
    verifiedDomain: null,
  };

  return team;
}

export const teamsAndProjectsStub: Array<{ team: Team; projects: Project[] }> =
  [
    {
      team: teamStub("1", "free"),
      projects: [
        projectStub("t1p1", "team-1"),
        projectStub("t1p2", "team-1"),
        projectStub("t1p3", "team-1"),
        projectStub("t1p4", "team-1"),
      ],
    },
    {
      team: teamStub("2", "starter"),
      projects: [projectStub("t2p1", "team-2"), projectStub("t2p2", "team-2")],
    },
    {
      team: teamStub("3", "starter_legacy"),
      projects: [projectStub("t3p1", "team-3"), projectStub("t2p2", "team-2")],
    },
    {
      team: teamStub("3", "growth"),
      projects: [projectStub("t3p1", "team-3"), projectStub("t2p2", "team-2")],
    },
    {
      team: teamStub("4", "growth_legacy"),
      projects: [projectStub("t4p1", "team-4")],
    },
    {
      team: teamStub("5", "accelerate"),
      projects: [projectStub("t5p1", "team-5")],
    },
    {
      team: teamStub("6", "scale"),
      projects: [projectStub("t6p1", "team-6")],
    },
    {
      team: teamStub("7", "pro"),
      projects: [projectStub("t7p1", "team-7")],
    },
  ];

export function createEngineAlertRuleStub(
  id: string,
  overrides: Partial<EngineAlertRule> = {},
): EngineAlertRule {
  return {
    title: `Alert Rule ${id}`,
    routingKey: `alert.${id}`,
    description: `This is a description for alert rule ${id}`,
    id: `alert-rule-${id}`,
    createdAt: new Date(),
    pausedAt: null,
    ...overrides,
  };
}

export function createEngineNotificationChannelStub(
  id: string,
  overrides: Partial<EngineNotificationChannel> = {},
): EngineNotificationChannel {
  return {
    id: Math.random().toString(),
    subscriptionRoutes: [`alert.${id}`],
    type: "slack",
    value:
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    createdAt: new Date(),
    pausedAt: new Date(),
    ...overrides,
  };
}

export function createEngineAlertStub(
  id: string,
  overrides: Partial<EngineAlert> = {},
): EngineAlert {
  return {
    alertRuleId: `alert-rule-${id}`,
    endsAt: new Date(),
    id: Math.random().toString(),
    startsAt: new Date(),
    status: "pending",
    ...overrides,
  };
}

export function teamSubscriptionsStub(
  plan: "plan:starter" | "plan:growth" | "plan:custom",
  overrides?: {
    usage?: {
      storage?: {
        quantity: number;
        amount: number;
      };
      inAppWalletAmount?: {
        quantity: number;
        amount: number;
      };
      aaSponsorshipAmount?: {
        quantity: number;
        amount: number;
      };
      aaSponsorshipOpGrantAmount?: {
        quantity: number;
        amount: number;
      };
    };
    trialEnd?: string;
  },
): TeamSubscription[] {
  const planName =
    plan === "plan:starter"
      ? "Starter"
      : plan === "plan:growth"
        ? "Growth"
        : "Pro";

  const planCost =
    plan === "plan:starter" ? 0 : plan === "plan:growth" ? 9900 : 59900;
  const usage = overrides?.usage || {};
  const usageLinesTotalCost = Object.values(usage).reduce(
    (total, { amount }) => total + amount,
    0,
  );
  return [
    // plan
    {
      id: "sub-1",
      type: "PLAN",
      status: "active",
      currentPeriodStart: "2024-11-15T20:56:06.000Z",
      currentPeriodEnd: "2024-12-15T20:56:06.000Z",
      trialStart: null,
      trialEnd: overrides?.trialEnd || null,
      upcomingInvoice: {
        amount: planCost,
        currency: "usd",
        lines: [
          {
            amount: planCost,
            description: `1 × ${planName} Plan (at $0.00 / month)`,
            thirdwebSku: plan,
          },
        ],
      },
    },
    {
      id: "sub-2",
      type: "USAGE",
      status: "active",
      currentPeriodStart: "2024-11-15T20:56:15.000Z",
      currentPeriodEnd: "2024-12-15T20:56:06.000Z",
      trialStart: null,
      trialEnd: null,
      upcomingInvoice: {
        amount: usageLinesTotalCost,
        currency: "usd",
        lines: [
          // Storage
          {
            amount: usage.storage?.amount || 0,
            description: `${usage.storage?.quantity || 0} x Storage Pinning (Tier 1 at $0.00 / month)`,
            thirdwebSku: "usage:storage",
          },
          // In-App Wallets
          {
            amount: usage.inAppWalletAmount?.amount || 0,
            description: `${
              usage.inAppWalletAmount?.quantity || 0
            } x In-App Wallets (Tier 1 at $0.00 / month)`,
            thirdwebSku: "usage:in_app_wallet",
          },
          // AA Sponsorship
          {
            amount: usage.aaSponsorshipAmount?.amount || 0,
            description: `${
              usage.aaSponsorshipAmount?.quantity || 0
            } x AA Gas Sponsorship (at $0.011 / month)`,
            thirdwebSku: "usage:aa_sponsorship",
          },
          // OP Grant
          {
            amount: usage.aaSponsorshipOpGrantAmount?.amount || 0,
            description: `${
              usage.aaSponsorshipOpGrantAmount?.quantity || 0
            } x AA Gas Sponsorship (OP) (at $0.011 / month)`,
            thirdwebSku: "usage:aa_sponsorship_op_grant",
          },
        ],
      },
    },
  ];
}

export function randomLorem(length: number) {
  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ];

  return Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * loremWords.length);
    return loremWords[randomIndex];
  }).join(" ");
}

export function newAccountStub(overrides?: Partial<Account>): Account {
  return {
    email: undefined,
    name: undefined,
    id: "foo",
    isStaff: false,
    creatorWalletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    ...overrides,
  };
}
