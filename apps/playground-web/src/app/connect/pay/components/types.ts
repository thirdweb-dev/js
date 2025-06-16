import type { Chain } from "thirdweb";
import type { LocaleId, ThemeOverrides, TokenInfo } from "thirdweb/react";
import type { WalletId } from "thirdweb/wallets";

export type PayEmbedPlaygroundOptions = {
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  payOptions: {
    mode?: "fund_wallet" | "direct_payment" | "transaction";
    title: string | undefined;
    image: string | undefined;

    // fund_wallet mode options
    buyTokenAddress: string | undefined;
    buyTokenAmount: string | undefined;
    buyTokenChain: Chain | undefined;
    buyTokenInfo?: TokenInfo;
    buyWithCrypto?: boolean;
    buyWithFiat?: boolean;

    // direct_payment mode options
    sellerAddress?: string;

    // transaction mode options
    transactionData?: string; // Simplified for demo; could be more complex in real implementation
  };
  connectOptions: {
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
};
