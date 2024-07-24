import {
  ThirdwebProvider,
  type WalletConfig,
  en,
  es,
  ja,
} from "@thirdweb-dev/react";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "constants/rpc";
import { THIRDWEB_API_HOST, THIRDWEB_DOMAIN } from "constants/urls";
import { StorageSingleton } from "lib/sdk";

const localeIdToObj = {
  "en-US": en(),
  "ja-JP": ja(),
  "es-ES": es(),
};

export function PreviewThirdwebProvider(props: {
  authEnabled: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  supportedWallets: WalletConfig<any>[];
  children: React.ReactNode;
  locale?: keyof typeof localeIdToObj;
}) {
  return (
    <ThirdwebProvider
      locale={props.locale ? localeIdToObj[props.locale] : undefined}
      activeChain="sepolia"
      supportedWallets={
        props.supportedWallets.length > 0 ? props.supportedWallets : undefined
      }
      clientId={DASHBOARD_THIRDWEB_CLIENT_ID}
      storageInterface={StorageSingleton}
      authConfig={
        props.authEnabled
          ? {
              domain: THIRDWEB_DOMAIN,
              authUrl: `${THIRDWEB_API_HOST}/v1/auth`,
            }
          : undefined
      }
    >
      {props.children}
    </ThirdwebProvider>
  );
}
