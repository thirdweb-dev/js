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
    title: "Smart Wallets",
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
    title: "Embedded Wallets",
    description: "E-mail and social login wallets for easy web3 onboarding",
    // all actions allowed
    actions: [],
  },
  checkout: {
    name: "checkout",
    title: "Checkouts",
    description: "Payments for easy web3 onboarding",
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
