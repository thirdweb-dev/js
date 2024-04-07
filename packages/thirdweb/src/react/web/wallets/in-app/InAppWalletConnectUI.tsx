import { useContext } from "react";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { ModalConfigCtx } from "../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { InAppWalletFormUIScreen } from "./InAppWalletFormUI.js";
import { InAppWalletOTPLoginUI } from "./InAppWalletOTPLoginUI.js";
import { InAppWalletSocialLogin } from "./InAppWalletSocialLogin.js";
import type { InAppWalletSelectUIState } from "./types.js";
import { useInAppWalletLocale } from "./useInAppWalletLocale.js";

/**
 *
 * @internal
 */
function InAppWalletConnectUI(props: {
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
}) {
  const { data } = useContext(ModalConfigCtx);
  const state = data as InAppWalletSelectUIState;
  const locale = useInAppWalletLocale();

  if (!locale) {
    return <LoadingScreen />;
  }

  if (state?.emailLogin) {
    return (
      <InAppWalletOTPLoginUI
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
      <InAppWalletSocialLogin
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
    <InAppWalletFormUIScreen
      select={() => {}}
      locale={locale}
      done={props.done}
      goBack={props.goBack}
      wallet={props.wallet}
    />
  );
}

export default InAppWalletConnectUI;
