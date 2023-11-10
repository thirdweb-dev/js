import { EmbeddedWallet } from "./EmbeddedWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedConnectionUI } from "./EmbeddedConnectionUI";
import { EmailSelectionUI } from "./EmbeddedSelectionUI";
import { AuthOption } from "../../types/embedded-wallet";
import { WalletConnectReceiverConfig } from "@thirdweb-dev/wallets";

export type EmbeddedWalletConfig = {
  auth?: {
    options: AuthOption[];
    redirectUrl?: string;
  };
} & WalletConnectReceiverConfig;

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  const selectUI = (props: SelectUIProps<EmbeddedWallet>) => (
    <EmailSelectionUI
      {...props}
      auth={
        config?.auth || {
          options: ["email"],
        }
      }
    />
  );

  return {
    id: EmbeddedWallet.id,
    meta: EmbeddedWallet.meta,
    create(options: WalletOptions) {
      return new EmbeddedWallet({
        ...options,
        ...config,
        clientId: options.clientId || "",
      });
    },
    selectUI: selectUI,
    connectUI: EmbeddedConnectionUI,
  };
};
