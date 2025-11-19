import { BotIcon, CoinsIcon, FuelIcon, HardDriveIcon } from "lucide-react";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { PayIcon } from "@/icons/PayIcon";
import { RPCIcon } from "@/icons/RPCIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import type { ChainSupportedService } from "@/types/chain";

export const services = [
  {
    icon: CoinsIcon,
    id: "contracts",
    link: "https://thirdweb.com/token",
    name: "Tokens",
  },
  {
    icon: WalletProductIcon,
    id: "connect-sdk",
    link: "https://thirdweb.com/wallets",
    name: "User Wallets",
  },
  {
    icon: RPCIcon,
    id: "rpc-edge",
    link: "https://thirdweb.com/rpc",
    name: "RPC",
  },
  {
    icon: HardDriveIcon,
    id: "engine",
    link: "https://thirdweb.com/wallets",
    name: "Server Wallets",
  },
  {
    icon: FuelIcon,
    id: "account-abstraction",
    link: "https://thirdweb.com/wallets",
    name: "Gas Sponsorship",
  },
  {
    icon: BridgeIcon,
    id: "pay",
    link: "https://thirdweb.com/monetize/bridge",
    name: "Bridge",
  },
  {
    icon: BotIcon,
    id: "nebula",
    link: "https://thirdweb.com/ai",
    name: "AI",
  },
  {
    icon: PayIcon,
    id: "account-abstraction",
    link: "https://thirdweb.com/x402",
    name: "x402",
  },
  {
    icon: InsightIcon,
    id: "insight",
    link: "https://thirdweb.com/gateway",
    name: "Indexer",
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
  link: string;
}>;
