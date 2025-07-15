import { defineChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { injectedProvider } from "../../wallets/injected/mipdStore.js";
import type { WalletId } from "../../wallets/wallet-types.js";

/**
 * Connect an external wallet like Metamask, Coinbase, etc.
 * @param options - Options including the client, wallet id, and chain id
 * @returns Promise that resolves to the wallet instance
 * @example
 * ```typescript
 * import { Wallets } from "thirdweb/v2";
 *
 * const wallet = await Wallets.connectExternalWallet({
 *   client: thirdwebClient,
 *   walletId: "io.metamask",
 *   chainId: 1,
 * });
 * ```
 * @wallet
 */
export async function connectExternalWallet(options: {
  client: ThirdwebClient;
  walletId: WalletId;
  chainId: number;
}) {
  const { createWallet } = await import("../../wallets/create-wallet.js");
  const w = createWallet(options.walletId);
  if (injectedProvider(options.walletId)) {
    await w.connect({
      client: options.client,
      chain: defineChain(options.chainId),
    });
  } else {
    await w.connect({
      client: options.client,
      chain: defineChain(options.chainId),
      walletConnect: {
        showQrModal: true,
      },
    });
  }
  return w;
}
