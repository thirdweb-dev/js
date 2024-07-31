import { configure, handleResponse } from "@coinbase/wallet-mobile-sdk";
import type { ProviderInterface } from "@coinbase/wallet-sdk";
import { Linking } from "react-native";
import type { Chain } from "../../chains/types.js";
import type { COINBASE } from "../constants.js";
import type { CreateWalletArgs } from "../wallet-types.js";

let _provider: ProviderInterface | undefined;

/**
 * @internal
 */
export async function getCoinbaseMobileProvider(
  options?: CreateWalletArgs<typeof COINBASE>[1],
): Promise<ProviderInterface> {
  if (!_provider) {
    const callbackURL = new URL(
      options?.mobileConfig?.callbackURL || "https://thirdweb.com/wsegue",
    );
    const mobileProvider: ProviderInterface = (await initMobileProvider({
      chain: options?.chains ? options.chains[0] : undefined,
      ...options?.mobileConfig,
    })) as unknown as ProviderInterface;
    _provider = mobileProvider;
    Linking.addEventListener("url", ({ url }) => {
      const incomingUrl = new URL(url);
      if (
        callbackURL &&
        incomingUrl.host === callbackURL.host &&
        incomingUrl.protocol === callbackURL.protocol &&
        incomingUrl.hostname === callbackURL.hostname
      ) {
        // @ts-expect-error - Passing a URL object to handleResponse crashes the function
        handleResponse(url);
      }
    });
    return mobileProvider;
  }
  return _provider;
}

async function initMobileProvider(args: {
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
    await import(
      // @ts-ignore this is only visible from RN
      "@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider"
    )
  ).WalletMobileSDKEVMProvider;
  if (
    typeof CoinbaseWalletMobileSDK !== "function" &&
    // @ts-ignore this is only visible from RN
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
