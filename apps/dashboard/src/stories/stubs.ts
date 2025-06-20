import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type {
  EngineAlert,
  EngineAlertRule,
  EngineNotificationChannel,
} from "@3rdweb-sdk/react/hooks/useEngine";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";

export function projectStub(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date().toISOString(),
    domains: [] as string[],
    id: id,
    image: null,
    lastAccessedAt: null,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    secretKeys: [],
    services: [],
    slug: `project-${id}`,
    teamId: teamId,
    updatedAt: new Date().toISOString(),
    walletAddresses: [],
  };

  return project;
}

export function teamStub(id: string, billingPlan: Team["billingPlan"]): Team {
  const team: Team = {
    billingEmail: "foo@example.com",
    billingPlan: billingPlan,
    billingStatus: "validPayment",
    canCreatePublicChains: null,
    capabilities: {
      bundler: {
        enabled: true,
        mainnetEnabled: true,
        rateLimit: 1000,
      },
      embeddedWallets: {
        customAuth: true,
        customBranding: true,
        enabled: true,
        sms: {
          domestic: true,
          international: true,
        },
      },
      engineCloud: {
        enabled: true,
        mainnetEnabled: true,
        rateLimit: 100,
      },
      insight: {
        enabled: true,
        rateLimit: 1000,
        webhooks: true,
      },
      nebula: {
        enabled: true,
        rateLimit: 1000,
      },
      pay: {
        enabled: true,
        rateLimit: 1000,
      },
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
        download: {
          rateLimit: 1000,
        },
        enabled: true,
        upload: {
          rateLimit: 1000,
          totalFileSizeBytesLimit: 1_000_000_000,
        },
      },
    },
    createdAt: new Date().toISOString(),
    dedicatedSupportChannel: null,
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
    id: `team-${id}-id`,
    image: null,
    isOnboarded: true,
    name: `Team ${id}`,
    planCancellationDate: null,
    slug: `team-${id}`,
    stripeCustomerId: "cus_1234567890",
    supportPlan: billingPlan,
    unthreadCustomerId: null,
    updatedAt: new Date().toISOString(),
    verifiedDomain: null,
  };

  return team;
}

export const teamsAndProjectsStub: Array<{ team: Team; projects: Project[] }> =
  [
    {
      projects: [
        projectStub("t1p1", "team-1"),
        projectStub("t1p2", "team-1"),
        projectStub("t1p3", "team-1"),
        projectStub("t1p4", "team-1"),
      ],
      team: teamStub("1", "free"),
    },
    {
      projects: [projectStub("t2p1", "team-2"), projectStub("t2p2", "team-2")],
      team: teamStub("2", "starter"),
    },
    {
      projects: [projectStub("t3p1", "team-3"), projectStub("t2p2", "team-2")],
      team: teamStub("3", "growth"),
    },
    {
      projects: [projectStub("t4p1", "team-4")],
      team: teamStub("4", "growth_legacy"),
    },
    {
      projects: [projectStub("t5p1", "team-5")],
      team: teamStub("5", "accelerate"),
    },
    {
      projects: [projectStub("t6p1", "team-6")],
      team: teamStub("6", "scale"),
    },
    {
      projects: [projectStub("t7p1", "team-7")],
      team: teamStub("7", "pro"),
    },
  ];

export function createEngineAlertRuleStub(
  id: string,
  overrides: Partial<EngineAlertRule> = {},
): EngineAlertRule {
  return {
    createdAt: new Date(),
    description: `This is a description for alert rule ${id}`,
    id: `alert-rule-${id}`,
    pausedAt: null,
    routingKey: `alert.${id}`,
    title: `Alert Rule ${id}`,
    ...overrides,
  };
}

export function createEngineNotificationChannelStub(
  id: string,
  overrides: Partial<EngineNotificationChannel> = {},
): EngineNotificationChannel {
  return {
    createdAt: new Date(),
    id: Math.random().toString(),
    pausedAt: new Date(),
    subscriptionRoutes: [`alert.${id}`],
    type: "slack",
    value:
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
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
      currentPeriodEnd: "2024-12-15T20:56:06.000Z",
      currentPeriodStart: "2024-11-15T20:56:06.000Z",
      id: "sub-1",
      status: "active",
      trialEnd: overrides?.trialEnd || null,
      trialStart: null,
      type: "PLAN",
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
      currentPeriodEnd: "2024-12-15T20:56:06.000Z",
      currentPeriodStart: "2024-11-15T20:56:15.000Z",
      id: "sub-2",
      status: "active",
      trialEnd: null,
      trialStart: null,
      type: "USAGE",
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

export function newAccountStub(overrides?: Partial<Account>): Account {
  return {
    creatorWalletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    email: undefined,
    id: "foo",
    isStaff: false,
    name: undefined,
    ...overrides,
  };
}
