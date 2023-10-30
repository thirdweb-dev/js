import { EmbeddedWallet } from "./EmbeddedWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedConnectionUI } from "./EmbeddedConnectionUI";
import { EmailSelectionUI } from "./EmbeddedSelectionUI";

type AuthOption = "google" | "email";

export type EmbeddedWalletConfig = {
  auth?: {
    options: AuthOption[];
    redirectUrl: string;
  };
};

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  const selectUI = (props: SelectUIProps<EmbeddedWallet>) => (
    <EmailSelectionUI
      {...props}
      auth={
        config?.auth || {
          options: ["email", "google"],
          redirectUrl: config?.auth?.redirectUrl || "", // TODO (ews): is this valid? might need to default to email only?
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
        clientId: options.clientId || "",
      });
    },
    selectUI: selectUI,
    connectUI: EmbeddedConnectionUI,
  };
};
