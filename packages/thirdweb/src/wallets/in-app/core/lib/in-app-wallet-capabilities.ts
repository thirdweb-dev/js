import type { Wallet } from "../../../interfaces/wallet.js";

/**
 * @internal
 */
export function inAppWalletGetCapabilities(args: {
  wallet: Wallet<"inApp" | "embedded">;
}) {
  const { wallet } = args;

  const chain = wallet.getChain();
  if (chain === undefined) {
    return {
      message: `Can't get capabilities, no active chain found for wallet: ${wallet.id}`,
    };
  }

  const account = wallet.getAccount();

  const config = wallet.getConfig();
  const sponsorGas =
    config?.smartAccount && "sponsorGas" in config.smartAccount
      ? config.smartAccount.sponsorGas
      : false;

  return {
    [chain.id]: {
      paymasterService: {
        supported: sponsorGas,
      },
      atomicBatch: {
        supported: account?.sendBatchTransaction !== undefined,
      },
    },
  };
}
