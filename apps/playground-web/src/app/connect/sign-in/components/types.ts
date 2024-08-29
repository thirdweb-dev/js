import type { LocaleId, ThemeOverrides } from "thirdweb/react";
import type { InAppWalletAuth, WalletId } from "thirdweb/wallets";

export type ConnectPlaygroundOptions = {
  modalSize: "compact" | "wide";
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  inAppWallet: {
    methods: InAppWalletAuth[];
    enabled: boolean;
  };
  walletIds: WalletId[];
  modalTitle: string | undefined;
  modalTitleIcon: string | undefined;
  localeId: LocaleId;
  enableAuth: boolean;
  enableAccountAbstraction: boolean;
  termsOfServiceLink: string | undefined;
  privacyPolicyLink: string | undefined;
  buttonLabel: string | undefined;
  ShowThirdwebBranding: boolean;
  requireApproval: boolean;
};
