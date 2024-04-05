import { EmbeddedWalletFormUIScreen } from "./EmbeddedWalletFormUI.js";
import type { EmbeddedWalletSelectUIState } from "./types.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { useEmbeddedWalletLocale } from "./useEmbeddedWalletLocale.js";
import { useContext } from "react";
import { ModalConfigCtx } from "../../providers/wallet-ui-states-provider.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { EmbeddedWalletOTPLoginUI } from "./EmbeddedWalletOTPLoginUI.js";
import { EmbeddedWalletSocialLogin } from "./EmbeddedWalletSocialLogin.js";

/**
 *
 * @internal
 */
function EmbeddedWalletConnectUI(props: {
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
}) {
  const { data } = useContext(ModalConfigCtx);
  const state = data as EmbeddedWalletSelectUIState;
  const locale = useEmbeddedWalletLocale();

  if (!locale) {
    return <LoadingScreen />;
  }

  if (state?.emailLogin) {
    return (
      <EmbeddedWalletOTPLoginUI
        email={state.emailLogin}
        locale={locale}
        done={props.done}
        goBack={props.goBack}
        wallet={props.wallet}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <EmbeddedWalletSocialLogin
        socialAuth={state.socialLogin.type}
        locale={locale}
        done={props.done}
        goBack={props.goBack}
        wallet={props.wallet}
        state={state}
      />
    );
  }

  return (
    <EmbeddedWalletFormUIScreen
      select={() => {}}
      locale={locale}
      done={props.done}
      goBack={props.goBack}
      wallet={props.wallet}
    />
  );
}

export default EmbeddedWalletConnectUI;
