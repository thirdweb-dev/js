import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";
import { EmbeddedWallet } from "./EmbeddedWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmbeddedConnectionUI } from "./EmbeddedConnectionUI";
import { EmailSelectionUI } from "./EmbeddedSelectionUI";

type embeddedConfig = Omit<PaperWalletAdditionalOptions, "chain" | "chains">;

export const embeddedWallet = (
  config: embeddedConfig,
): WalletConfig<EmbeddedWallet> => {
  const selectUI = (props: SelectUIProps<EmbeddedWallet>) => (
    <EmailSelectionUI {...props} clientId={config.clientId} />
  );

  return {
    id: EmbeddedWallet.id,
    meta: EmbeddedWallet.meta,
    create(options: WalletOptions) {
      return new EmbeddedWallet({ ...options, ...config });
    },
    selectUI: selectUI,
    connectUI: EmbeddedConnectionUI,
  };
};
