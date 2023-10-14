import type { BigNumberish } from "ethers";
import { SmartWalletConfig } from "../smart-wallet/types";

export type TokenBoundSmartWalletConfig = {
  tokenContract: string;
  tokenId: BigNumberish;
  accountImplementation?: string;
  salt?: BigNumberish;
} & Omit<SmartWalletConfig, "factoryAddress">;
