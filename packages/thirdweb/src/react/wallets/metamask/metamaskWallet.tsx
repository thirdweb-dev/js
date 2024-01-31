import { metamaskMetadata, metamaskWallet } from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";

/**
 * TODO
 * @example TODO
 * @returns TODO
 */
export const metamaskConfig = (): WalletConfig => {
  return {
    connect: metamaskWallet,
    metadata: metamaskMetadata,
  };
};
