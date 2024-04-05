import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { reservedScreens } from "../../ui/ConnectWallet/constants.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { EmbeddedWalletFormUI } from "./EmbeddedWalletFormUI.js";
import { useEmbeddedWalletLocale } from "./useEmbeddedWalletLocale.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useContext } from "react";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../providers/wallet-ui-states-provider.js";
import type { EmbeddedWalletSelectUIState } from "./types.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletEntryButton.js";

/**
 *
 * @internal
 */
function EmbeddedWalletSelectionUI(props: {
  select: () => void;
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
}) {
  const { screen } = useScreenContext();
  const { modalSize } = useContext(ModalConfigCtx);
  const locale = useEmbeddedWalletLocale();
  const setModalConfig = useContext(SetModalConfigCtx);

  function saveState(data: EmbeddedWalletSelectUIState) {
    setModalConfig((p) => ({
      ...p,
      data,
    }));
  }

  // do not show the "selectUI" if
  // modal is compact or
  // it is being rendered in Safe wallet
  if (
    modalSize === "wide" ||
    (screen !== reservedScreens.main && modalSize === "compact")
  ) {
    return (
      <WalletEntryButton
        walletId={props.wallet.id}
        selectWallet={() => {
          saveState({});
          props.select();
        }}
      />
    );
  }

  if (!locale) {
    return <LoadingScreen height="195px" />;
  }

  return (
    <EmbeddedWalletFormUI
      locale={locale}
      wallet={props.wallet}
      done={props.done}
      select={props.select}
      goBack={props.goBack}
    />
  );
}

export default EmbeddedWalletSelectionUI;
