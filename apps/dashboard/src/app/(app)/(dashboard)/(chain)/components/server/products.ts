import type { ChainSupportedService } from "../../types/chain";
import { ConnectSDKIcon } from "./icons/ConnectSDKIcon";
import { ContractIcon } from "./icons/ContractIcon";
import { EngineIcon } from "./icons/EngineIcon";
import { InsightIcon } from "./icons/InsightIcon";
import { NebulaIcon } from "./icons/NebulaIcon";
import { PayIcon } from "./icons/PayIcon";
import { RPCIcon } from "./icons/RPCIcon";
import { SmartAccountIcon } from "./icons/SmartAccountIcon";

export const products = [
  {
    description: "Pre-built contracts & deployment tools",
    icon: ContractIcon,
    id: "contracts",
    link: "https://thirdweb.com/explore",
    name: "Contracts",
  },
  {
    description: "Client-side SDKs for wallets and blockchain interactions",
    icon: ConnectSDKIcon,
    id: "connect-sdk",
    link: "https://thirdweb.com/connect",
    name: "Connect SDK",
  },
  {
    description: "Performant and scalable RPC service",
    icon: RPCIcon,
    id: "rpc-edge",
    link: "https://portal.thirdweb.com/infrastructure/rpc-edge/overview",
    name: "RPC Edge",
  },
  {
    description: "Backend server that reads, writes, and deploys contracts",
    icon: EngineIcon,
    id: "engine",
    link: "https://thirdweb.com/engine",
    name: "Engine",
  },
  {
    description: "Account factory contracts, bundler & paymaster",
    icon: SmartAccountIcon,
    id: "account-abstraction",
    link: "https://portal.thirdweb.com/connect/account-abstraction/overview",
    name: "Account Abstraction",
  },
  {
    description: "Point of sale solution for bridging, onramping & swapping",
    icon: PayIcon,
    id: "pay",
    link: "https://portal.thirdweb.com/connect/pay/overview",
    name: "Universal Bridge",
  },
  {
    description: "Query, transform and analyze blockchain data",
    icon: InsightIcon,
    id: "insight",
    link: "https://thirdweb.com/insight",
    name: "Insight",
  },
  {
    description: "The most powerful AI for interacting with the blockchain",
    icon: NebulaIcon,
    id: "nebula",
    link: "https://thirdweb.com/nebula",
    name: "Nebula",
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
  description: string;
  link: string;
}>;
