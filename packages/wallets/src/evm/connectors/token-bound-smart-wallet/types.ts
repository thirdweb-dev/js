import type { BigNumberish } from "ethers";
import { SmartWalletConfig } from "../smart-wallet/types";

export type TokenBoundSmartWalletConfig = {
  tokenContract: string;
  tokenId: BigNumberish;
  accountImplementation: string; // TODO provide default implementation published by us
  salt?: BigNumberish;
} & SmartWalletConfig;
