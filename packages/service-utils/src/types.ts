export const SERVICE_NAMES = ["bundler", "rpc", "storage"] as const;

export const SERVICES: Service[] = [
  {
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
  {
    name: "rpc",
    title: "RPC",
    description: "Accelerated RPC Edge",
    // all actions allowed
    actions: [],
  },
  {
    name: "bundler",
    title: "Smart Wallets",
    description: "Bundler & Paymaster services",
    // all actions allowed
    actions: [],
  },
];

export type ServiceName = (typeof SERVICE_NAMES)[number];

export interface ServiceAction {
  name: string;
  title: string;
  description?: string;
}

export interface Service {
  name: ServiceName;
  title: string;
  description?: string;
  actions: ServiceAction[];
}
