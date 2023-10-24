import { EmbeddedWallet } from "./EmbeddedWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedConnectionUI } from "./EmbeddedConnectionUI";
import { EmailSelectionUI } from "./EmbeddedSelectionUI";
import { AuthProvider } from "@paperxyz/embedded-wallet-service-sdk";

type OAuthProvider = "google"; // currently we only have one

export type EmbeddedWalletConfig = {
  // @default true - set false to disable
  email?: boolean;

  oauthOptions?:
    | {
        providers: OAuthProvider[];
        redirectUrl: string;
      }
    | false;

  custom_auth?: boolean;
};

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  const selectUI = (props: SelectUIProps<EmbeddedWallet>) => (
    <EmailSelectionUI
      {...props}
      oauthOptions={
        config?.oauthOptions
          ? {
              providers: [AuthProvider.GOOGLE],
              redirectUrl: config.oauthOptions.redirectUrl,
            }
          : undefined
      }
      custom_auth={config?.custom_auth}
      // you cannot disable both email and oauth
      email={!config?.oauthOptions && !config?.email ? true : config?.email}
    />
  );

  return {
    id: EmbeddedWallet.id,
    meta: EmbeddedWallet.meta,
    create(options: WalletOptions) {
      return new EmbeddedWallet({
        ...options,
        clientId: options.clientId || "",
      });
    },
    selectUI: config?.custom_auth ? undefined : selectUI,
    connectUI: EmbeddedConnectionUI,
  };
};
