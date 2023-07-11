// FIXME: Extract these into lib
import { ThirdwebService } from "./types";

export const THIRDWEB_SERVICES: ThirdwebService[] = [
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

export const findByName = (name: string) => {
  return THIRDWEB_SERVICES.find((srv) => srv.name === name);
};
