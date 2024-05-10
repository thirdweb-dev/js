import type { Wallet } from "../../../interfaces/wallet.js";

/**
 * @internal
 */
export function getInAppWalletCapabilities(args: {
  wallet: Wallet<"inApp" | "embedded">;
}) {
  const { wallet } = args;

  const chain = wallet.getChain();
  if (chain === undefined) {
    return {
      message: "No chain found",
    };
  }

  const account = wallet.getAccount();
  if (!account) {
    return {
      [chain.id]: {
        paymasterService: {
          supported: false,
        },
        atomicBatch: {
          supported: false,
        },
      },
      message: "No account connected",
    };
  }

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
