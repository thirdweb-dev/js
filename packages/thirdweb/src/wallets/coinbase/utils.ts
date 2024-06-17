import type { ProviderInterface } from "@coinbase/wallet-sdk";

export async function showCoinbasePopup(provider: ProviderInterface) {
  // biome-ignore lint/suspicious/noExplicitAny: based on the latest CB SDK - scary but works
  await (provider as any)?.communicator?.waitForPopupLoaded();
}
