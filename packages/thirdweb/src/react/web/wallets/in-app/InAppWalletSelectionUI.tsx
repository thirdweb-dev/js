"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { reservedScreens } from "../../ui/ConnectWallet/constants.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletEntryButton.js";
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
  size: "compact" | "wide";
  // If true, all options will be disabled. Used for things like requiring TOS approval.
  disabled?: boolean;
}) {
  const { screen } = useScreenContext();
  const setData = useSetSelectionData();
  const locale = useInAppWalletLocale(props.connectLocale.id);

  // do not show the "selectUI" if
  // modal is compact or
  // it is being rendered in Safe wallet
  if (
    props.size === "wide" ||
    (screen !== reservedScreens.main && props.size === "compact")
  ) {
    return (
      <WalletEntryButton
        badge={undefined}
        client={props.client}
        connectLocale={props.connectLocale}
        isActive={screen === props.wallet}
        recommendedWallets={props.recommendedWallets}
        selectWallet={() => {
          setData({});
          props.select();
        }}
        wallet={props.wallet}
      />
    );
  }

  if (!locale) {
    return <LoadingScreen height="195px" />;
  }

  return (
    <ConnectWalletSocialOptions
      chain={props.chain}
      client={props.client}
      disabled={props.disabled}
      done={props.done}
      goBack={props.goBack}
      locale={locale}
      select={props.select}
      size={props.size}
      wallet={props.wallet}
    />
  );
}

export default InAppWalletSelectionUI;
