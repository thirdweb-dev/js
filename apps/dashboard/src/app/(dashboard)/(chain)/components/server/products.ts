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
  },
  {
    name: "Connect SDK",
    id: "connect-sdk",
    icon: ConnectSDKIcon,
  },
  {
    name: "RPC Edge",
    id: "rpc-edge",
    icon: RPCIcon,
  },
  {
    name: "Engine",
    id: "engine",
    icon: EngineIcon,
  },
  {
    name: "Account Abstraction",
    id: "account-abstraction",
    icon: SmartAccountIcon,
  },
  {
    name: "Pay",
    id: "pay",
    icon: PayIcon,
  },
  {
    name: "Faucet",
    id: "faucet",
    icon: PayIcon,
  },
] satisfies Array<{
  name: string;
  id: ChainSupportedService;
  icon: React.FC<{ className?: string }>;
}>;
