import { configure } from "@coinbase/wallet-mobile-sdk";
import type { Chain } from "../../chains/types.js";

export async function initMobileProvider(args: {
  chain?: Chain;
  callbackURL?: string;
  hostURL?: string;
  hostPackageName?: string;
}) {
  configure({
    callbackURL: new URL(args.callbackURL || "https://thirdweb.com/wsegue"),
    hostURL: new URL(args.hostURL || "https://wallet.coinbase.com/wsegue"),
    hostPackageName: args.hostPackageName || "org.toshi",
  });
  let CoinbaseWalletMobileSDK = (
    await import("@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider")
  ).WalletMobileSDKEVMProvider;
  if (
    typeof CoinbaseWalletMobileSDK !== "function" &&
    // @ts-expect-error This import error is not visible to TypeScript
    typeof CoinbaseWalletMobileSDK.default === "function"
  ) {
    CoinbaseWalletMobileSDK = (
      CoinbaseWalletMobileSDK as unknown as {
        default: typeof CoinbaseWalletMobileSDK;
      }
    ).default;
  }
  return new CoinbaseWalletMobileSDK({
    jsonRpcUrl: args.chain?.rpc,
    chainId: args.chain?.id,
  });
}
