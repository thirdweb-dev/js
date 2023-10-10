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
  recommended?: boolean;
  // @default true - set false to disable
  email?: boolean;

  // @default { providers: ['google'] } - set false to disable
  oauthOptions?:
    | {
        providers: OAuthProvider[];
        redirectUrl: string;
      }
    | false;
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
    selectUI: selectUI,
    connectUI: EmbeddedConnectionUI,
    recommended: config?.recommended,
  };
};
