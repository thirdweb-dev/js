export const SERVICE_DEFINITIONS = {
  bundler: {
    // all actions allowed
    actions: [],
    description: "Bundler & Paymaster services",
    name: "bundler",
    title: "Account Abstraction",
  },
  chainsaw: {
    // all actions allowed
    actions: [],
    description: "Indexed data for any EVM chain",
    name: "chainsaw",
    title: "Chainsaw",
  },
  embeddedWallets: {
    // all actions allowed
    actions: [],
    description: "E-mail and social login wallets for easy web3 onboarding",
    name: "embeddedWallets",
    title: "In-App Wallets",
  },
  engineCloud: {
    // all actions allowed
    actions: [],
    description:
      "Transaction API and Server wallets with high transaction throughput and low latency",
    name: "engineCloud",
    title: "Engine Cloud",
  },
  insight: {
    // all actions allowed
    actions: [],
    description: "Indexed data for any EVM chain",
    name: "insight",
    title: "Insight",
  },
  nebula: {
    // all actions allowed
    actions: [],
    description:
      "Advanced blockchain reasoning and execution capabilities with AI",
    name: "nebula",
    title: "Nebula",
  },
  pay: {
    // all actions allowed
    actions: [],
    description:
      "Bridge, swap, and purchase cryptocurrencies and execute transactions with any fiat or tokens via cross-chain routing",
    name: "pay",
    title: "Universal Bridge",
  },
  relayer: {
    // all actions allowed
    actions: [],
    description: "Enable gasless transactions",
    name: "relayer",
    title: "Gasless Relayer",
  },
  rpc: {
    // all actions allowed
    actions: [],
    description: "Accelerated RPC Edge",
    name: "rpc",
    title: "RPC",
  },
  storage: {
    actions: [
      {
        description: "Download a file from Storage",
        name: "read",
        title: "Download",
      },
      {
        description: "Upload a file to Storage",
        name: "write",
        title: "Upload",
      },
    ],
    description: "IPFS Upload and Download",
    name: "storage",
    title: "Storage",
  },
} as const;

export const SERVICE_NAMES = Object.keys(
  SERVICE_DEFINITIONS,
) as (keyof typeof SERVICE_DEFINITIONS)[];

export const SERVICES = Object.values(SERVICE_DEFINITIONS);

export type ServiceName = (typeof SERVICE_NAMES)[number];

export type ServiceAction = {
  name: string;
  title: string;
  description?: string;
};

export type Service =
  (typeof SERVICE_DEFINITIONS)[keyof typeof SERVICE_DEFINITIONS];

export function getServiceByName(name: ServiceName) {
  return SERVICE_DEFINITIONS[name];
}
