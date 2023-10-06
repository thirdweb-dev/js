import { EmbeddedWallet } from "./EmbeddedWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedConnectionUI } from "./EmbeddedConnectionUI";
import { EmailSelectionUI } from "./EmbeddedSelectionUI";
import { OauthOptions } from "../../connectors/embedded-wallet/types";
import { AuthProvider } from "@paperxyz/embedded-wallet-service-sdk";

export type EmbeddedWalletConfig = {
  recommended?: boolean;
  oauthOptions?: Omit<OauthOptions, "providers">;
};

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  const selectUI = (props: SelectUIProps<EmbeddedWallet>) => (
    <EmailSelectionUI
      {...props}
      oauthOptions={{
        providers: [AuthProvider.GOOGLE],
        redirectUrl: config?.oauthOptions?.redirectUrl || "",
      }}
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
