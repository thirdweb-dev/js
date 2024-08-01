import type { ChainSupportedService } from "../../types/chain";
import { ConnectSDKIcon } from "./icons/ConnectSDKIcon";
import { ContractIcon } from "./icons/ContractIcon";
import { EngineIcon } from "./icons/EngineIcon";
import { PayIcon } from "./icons/PayIcon";
import { RPCIcon } from "./icons/RPCIcon";
import { SmartAccountIcon } from "./icons/SmartAccountIcon";

export const products = [
  {
    name: "Contracts",
    id: "contracts",
    icon: ContractIcon,
    description: "Pre-built contracts & deployment tools",
  },
  {
    name: "Connect SDK",
    id: "connect-sdk",
    icon: ConnectSDKIcon,
    description: "Client-side SDKs for wallets and blockchain interactions",
  },
  {
    name: "RPC Edge",
    id: "rpc-edge",
    icon: RPCIcon,
    description: "Performant and scalable RPC service",
  },
  {
    name: "Engine",
    id: "engine",
    icon: EngineIcon,
    description: "Backend server that reads, writes, and deploys contracts",
  },
  {
    name: "Account Abstraction",
    id: "account-abstraction",
    icon: SmartAccountIcon,
    description: "Account factory contracts, bundler & paymaster",
  },
  {
    name: "Pay",
    id: "pay",
    icon: PayIcon,
    description: "Point of sale solution for bridging, onramping & swapping",
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
  description: string;
}>;
