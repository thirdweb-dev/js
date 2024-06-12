"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletEntryButton.js";
import { reservedScreens } from "../../ui/ConnectWallet/constants.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { InAppWalletFormUI } from "./InAppWalletFormUI.js";
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
}) {
  const { screen } = useScreenContext();
  const { connectModal } = useConnectUI();
  const setData = useSetSelectionData();
  const localeQuery = useInAppWalletLocale();

  // do not show the "selectUI" if
  // modal is compact or
  // it is being rendered in Safe wallet
  if (
    connectModal.size === "wide" ||
    (screen !== reservedScreens.main && connectModal.size === "compact")
  ) {
    return (
      <WalletEntryButton
        walletId={props.wallet.id}
        selectWallet={() => {
          setData({});
          props.select();
        }}
      />
    );
  }

  if (!localeQuery.data) {
    return <LoadingScreen height="195px" />;
  }

  return (
    <InAppWalletFormUI
      locale={localeQuery.data}
      wallet={props.wallet}
      done={props.done}
      select={props.select}
      goBack={props.goBack}
    />
  );
}

export default InAppWalletSelectionUI;
