import { NebulaIcon } from "../../../../../nebula-app/(app)/icons/NebulaIcon";
import type { ChainSupportedService } from "../../types/chain";
import { ConnectSDKIcon } from "./icons/ConnectSDKIcon";
import { ContractIcon } from "./icons/ContractIcon";
import { EngineIcon } from "./icons/EngineIcon";
import { InsightIcon } from "./icons/InsightIcon";
import { PayIcon } from "./icons/PayIcon";
import { RPCIcon } from "./icons/RPCIcon";
import { SmartAccountIcon } from "./icons/SmartAccountIcon";

export const products = [
  {
    name: "Contracts",
    id: "contracts",
    icon: ContractIcon,
    description: "Pre-built contracts & deployment tools",
    link: "https://thirdweb.com/explore",
  },
  {
    name: "Connect SDK",
    id: "connect-sdk",
    icon: ConnectSDKIcon,
    description: "Client-side SDKs for wallets and blockchain interactions",
    link: "https://thirdweb.com/connect",
  },
  {
    name: "RPC Edge",
    id: "rpc-edge",
    icon: RPCIcon,
    description: "Performant and scalable RPC service",
    link: "https://portal.thirdweb.com/infrastructure/rpc-edge/overview",
  },
  {
    name: "Engine",
    id: "engine",
    icon: EngineIcon,
    description: "Backend server that reads, writes, and deploys contracts",
    link: "https://thirdweb.com/engine",
  },
  {
    name: "Account Abstraction",
    id: "account-abstraction",
    icon: SmartAccountIcon,
    description: "Account factory contracts, bundler & paymaster",
    link: "https://portal.thirdweb.com/connect/account-abstraction/overview",
  },
  {
    name: "Universal Bridge",
    id: "pay",
    icon: PayIcon,
    description: "Point of sale solution for bridging, onramping & swapping",
    link: "https://portal.thirdweb.com/connect/pay/overview",
  },
  {
    name: "Insight",
    id: "insight",
    icon: InsightIcon,
    description: "Query, transform and analyze blockchain data",
    link: "https://thirdweb.com/insight",
  },
  {
    name: "Nebula",
    id: "nebula",
    icon: NebulaIcon,
    description: "The most powerful AI for interacting with the blockchain",
    link: "https://thirdweb.com/nebula",
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
  description: string;
  link: string;
}>;
