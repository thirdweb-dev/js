"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletEntryButton.js";
import { reservedScreens } from "../../ui/ConnectWallet/constants.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import type { LocaleId } from "../../ui/types.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { useInAppWalletLocale } from "./useInAppWalletLocale.js";

/**
 *
 * @internal
 */
function InAppWalletSelectionUI(props: {
  select: () => void;
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  recommendedWallets: Wallet[] | undefined;
  chain: Chain | undefined;
  localeId: LocaleId;
  size: "compact" | "wide";
}) {
  const { screen } = useScreenContext();
  const setData = useSetSelectionData();
  const locale = useInAppWalletLocale(props.localeId);

  // do not show the "selectUI" if
  // modal is compact or
  // it is being rendered in Safe wallet
  if (
    props.size === "wide" ||
    (screen !== reservedScreens.main && props.size === "compact")
  ) {
    return (
      <WalletEntryButton
        walletId={props.wallet.id}
        selectWallet={() => {
          setData({});
          props.select();
        }}
        client={props.client}
        connectLocale={props.connectLocale}
        recommendedWallets={props.recommendedWallets}
      />
    );
  }

  if (!locale) {
    return <LoadingScreen height="195px" />;
  }

  return (
    <ConnectWalletSocialOptions
      locale={locale}
      wallet={props.wallet}
      done={props.done}
      select={props.select}
      goBack={props.goBack}
      chain={props.chain}
      client={props.client}
      size={props.size}
    />
  );
}

export default InAppWalletSelectionUI;
