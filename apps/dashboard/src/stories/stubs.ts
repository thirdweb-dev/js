import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import type { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";

function projectStub(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date(),
    domains: [] as string[],
    id: id,
    updatedAt: new Date(),
    teamId: teamId,
    redirectUrls: [] as string[],
    slug: `project-${id}`,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    lastAccessedAt: null,
    deletedAt: null,
    bannedAt: null,
  };

  return project;
}

export function teamStub(
  id: string,
  billingPlan: "free" | "pro" | "growth",
): Team {
  const team: Team = {
    id: `team-${id}-id`,
    billingPlan: billingPlan,
    billingStatus: "validPayment",
    name: `Team ${id}`,
    slug: `team-${id}`,
    bannedAt: null,
    createdAt: new Date().toISOString(),
    deletedAt: null,
    updatedAt: new Date().toISOString(),
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
      team: teamStub("2", "growth"),
      projects: [projectStub("t2p1", "team-2"), projectStub("t2p2", "team-2")],
    },
    {
      team: teamStub("3", "pro"),
      projects: [projectStub("t3p1", "team-3")],
    },
  ];

function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function createApiKeyStub() {
  const embeddedWalletService: ApiKeyService = {
    id: "embeddedWallets",
    name: "embeddedWallets", // important
    targetAddresses: [],
    actions: [],
  };

  const secretKey = generateRandomString(86);

  const apiKeyStub: ApiKey = {
    id: "api-key-id-foo",
    name: "xyz",
    key: generateRandomString(31),
    accountId: "account-id-foo",
    bundleIds: ["bundle-id-foo", "bundle-id-bar"],
    createdAt: new Date().toISOString(),
    creatorWalletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    domains: ["example1.com", "example2.com"],
    secretMasked: `${secretKey.slice(0, 3)}...${secretKey.slice(-4)}`,
    walletAddresses: ["0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37"],
    redirectUrls: [],
    revokedAt: "",
    lastAccessedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    services: [embeddedWalletService],
    secret: secretKey,
  };

  return apiKeyStub;
}
