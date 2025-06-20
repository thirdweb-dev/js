import type { Wallet } from "../../interfaces/wallet.js";

/**
 * @internal
 */
export function smartWalletGetCapabilities(args: { wallet: Wallet }) {
  const { wallet } = args;

  const chain = wallet.getChain();
  if (chain === undefined) {
    return {
      message: `Can't get capabilities, no active chain found for wallet: ${wallet.id}`,
    };
  }

  const account = wallet.getAccount();

  const config = wallet.getConfig() ?? {};
  return {
    [chain.id]: {
      atomic: {
        status:
          account?.sendBatchTransaction !== undefined
            ? "supported"
            : "unsupported",
      },
      paymasterService: {
        supported: "sponsorGas" in config ? config.sponsorGas : false,
      },
    },
  };
}
