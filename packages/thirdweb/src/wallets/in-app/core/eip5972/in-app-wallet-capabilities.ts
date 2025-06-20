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
      : config?.executionMode
        ? config.executionMode.mode === "EIP4337" &&
          config.executionMode.smartAccount &&
          "sponsorGas" in config.executionMode.smartAccount
          ? config.executionMode.smartAccount.sponsorGas
          : config.executionMode.mode === "EIP7702"
            ? config.executionMode.sponsorGas
            : false
        : false;

  return {
    [chain.id]: {
      atomic: {
        status:
          account?.sendBatchTransaction !== undefined
            ? "supported"
            : "unsupported",
      },
      paymasterService: {
        supported: sponsorGas,
      },
    },
  };
}
