import type { ProviderInterface } from "@coinbase/wallet-sdk";
import type { CoinbaseWalletCreationOptions } from "./coinbase-web.js";

let _provider: ProviderInterface | undefined;

/**
 * @internal
 */
export async function getCoinbaseMobileProvider(
  options?: CoinbaseWalletCreationOptions,
): Promise<ProviderInterface> {
  if (!_provider) {
    // if explicitly set to smart wallet only, use the smart wallet provider
    const useSmartWallet = options?.walletConfig?.options === "smartWalletOnly";
    let mobileProvider: ProviderInterface;
    if (useSmartWallet) {
      mobileProvider = (await initSmartWalletProvider(
        options,
      )) as unknown as ProviderInterface;
    } else {
      // otherwise, use the coinbase app provider
      // TODO: remove this path once the new @mobile-wallet-protocol/client supports it
      mobileProvider = (await initCoinbaseAppProvider(
        options,
      )) as unknown as ProviderInterface;
      const ExpoLinking = await import("expo-linking");
      const { handleResponse } = await import("@coinbase/wallet-mobile-sdk");
      ExpoLinking.addEventListener("url", ({ url }) => {
        // @ts-expect-error - Passing a URL object to handleResponse crashes the function
        handleResponse(url);
      });
    }
    _provider = mobileProvider;
    return mobileProvider;
  }
  return _provider;
}

async function initSmartWalletProvider(
  options?: CoinbaseWalletCreationOptions,
) {
  const { EIP1193Provider, Wallets } = await import(
    "@mobile-wallet-protocol/client"
  );
  const appDeeplinkUrl = options?.mobileConfig?.callbackURL;
  if (!appDeeplinkUrl) {
    throw new Error(
      "callbackURL is required. Set it when creating the coinbase wallet. Ex: createWallet('com.coinbase.wallet', { mobileConfig: { callbackUrl: 'https://example.com' }}",
    );
  }
  const sdk = new EIP1193Provider({
    metadata: {
      chainIds: options?.chains?.map((c) => c.id),
      customScheme: appDeeplinkUrl,
      logoUrl: options?.appMetadata?.logoUrl,
      name: options?.appMetadata?.name || "thirdweb powered app",
    },
    wallet: Wallets.CoinbaseSmartWallet, // TODO support both smart and EOA once the SDK supports it
  });
  return sdk;
}

async function initCoinbaseAppProvider(
  options?: CoinbaseWalletCreationOptions,
) {
  const appDeeplinkUrl = options?.mobileConfig?.callbackURL;
  if (!appDeeplinkUrl) {
    throw new Error(
      "callbackURL is required. Set it when creating the coinbase wallet. Ex: createWallet('com.coinbase.wallet', { mobileConfig: { callbackUrl: 'https://example.com' }}",
    );
  }
  const { configure } = await import("@coinbase/wallet-mobile-sdk");
  configure({
    callbackURL: new URL(appDeeplinkUrl),
    hostPackageName: "org.toshi",
    hostURL: new URL("https://wallet.coinbase.com/wsegue"),
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
  const chain = options.chains?.[0];
  return new CoinbaseWalletMobileSDK({
    chainId: chain?.id,
    jsonRpcUrl: chain?.rpc,
  });
}
