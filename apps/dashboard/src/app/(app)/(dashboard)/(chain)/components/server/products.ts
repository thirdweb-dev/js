import { BotIcon } from "lucide-react";
import { ConnectSDKIcon } from "@/icons/ConnectSDKIcon";
import { ContractIcon } from "@/icons/ContractIcon";
import { EngineIcon } from "@/icons/EngineIcon";
import { PayIcon } from "@/icons/PayIcon";
import { RPCIcon } from "@/icons/RPCIcon";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";
import type { ChainSupportedService } from "@/types/chain";

export const products = [
  {
    description: "Create, deploy and manage smart contracts",
    icon: ContractIcon,
    id: "contracts",
    link: "https://thirdweb.com/explore",
    name: "Contracts",
  },
  {
    description: "Create and manage crypto wallets",
    icon: ConnectSDKIcon,
    id: "connect-sdk",
    link: "https://thirdweb.com/connect",
    name: "Wallets",
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
    name: "Transactions",
  },
  {
    description: "Enable gas sponsorship for seamless transactions",
    icon: SmartAccountIcon,
    id: "account-abstraction",
    link: "https://portal.thirdweb.com/wallets/sponsor-gas",
    name: "Account Abstraction",
  },
  {
    description: "Enable payments in any token on any chain",
    icon: PayIcon,
    id: "pay",
    link: "https://portal.thirdweb.com/payments",
    name: "Payments",
  },
  {
    description: "The most powerful AI for interacting with the blockchain",
    icon: BotIcon,
    id: "nebula",
    link: "https://thirdweb.com/ai",
    name: "thirdweb AI",
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
  description: string;
  link: string;
}>;
