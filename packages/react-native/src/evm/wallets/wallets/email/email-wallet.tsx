import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";
import { EmailWallet } from "./EmailWallet";
import {
  SelectUIProps,
  WalletConfig,
  WalletOptions,
} from "@thirdweb-dev/react-core";
import { EmailConnectionUI } from "./EmailConnectionUI";
import { EmailSelectionUI } from "./EmailSelectionUI";

type EmailConfig = Omit<PaperWalletAdditionalOptions, "chain" | "chains">;

export const emailWallet = (config: EmailConfig): WalletConfig<EmailWallet> => {
  const selectUI = (props: SelectUIProps<EmailWallet>) => (
    <EmailSelectionUI {...props} clientId={config.paperClientId} />
  );

  return {
    id: EmailWallet.id,
    meta: EmailWallet.meta,
    create(options: WalletOptions) {
      return new EmailWallet({ ...options, ...config });
    },
    selectUI: selectUI,
    connectUI: EmailConnectionUI,
  };
};
