export const SERVICE_DEFINITIONS = {
  storage: {
    name: "storage",
    title: "Storage",
    description: "IPFS Upload and Download",
    actions: [
      {
        name: "read",
        title: "Download",
        description: "Download a file from Storage",
      },
      {
        name: "write",
        title: "Upload",
        description: "Upload a file to Storage",
      },
    ],
  },
  rpc: {
    name: "rpc",
    title: "RPC",
    description: "Accelerated RPC Edge",
    // all actions allowed
    actions: [],
  },
  bundler: {
    name: "bundler",
    title: "Account Abstraction",
    description: "Bundler & Paymaster services",
    // all actions allowed
    actions: [],
  },
  relayer: {
    name: "relayer",
    title: "Gasless Relayer",
    description: "Enable gasless transactions",
    // all actions allowed
    actions: [],
  },
  embeddedWallets: {
    name: "embeddedWallets",
    title: "In-App Wallets",
    description: "E-mail and social login wallets for easy web3 onboarding",
    // all actions allowed
    actions: [],
  },
  pay: {
    name: "pay",
    title: "Pay",
    description: "Pay for a blockchain transaction with any currency",
    // all actions allowed
    actions: [],
  },
  chainsaw: {
    name: "chainsaw",
    title: "Chainsaw",
    description: "Indexed data for any EVM chain",
    // all actions allowed
    actions: [],
  },
  insight: {
    name: "insight",
    title: "Insight",
    description: "Insight services",
    // all actions allowed
    actions: [],
  },
  nebula: {
    name: "nebula",
    title: "Nebula",
    description:
      "Advanced blockchain reasoning and execution capabilities with AI",
    // all actions allowed
    actions: [],
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
