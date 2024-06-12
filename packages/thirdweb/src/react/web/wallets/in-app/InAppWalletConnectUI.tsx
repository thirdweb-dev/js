"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import {
  useSelectionData,
  useSetSelectionData,
} from "../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { InAppWalletFormUIScreen } from "./InAppWalletFormUI.js";
import { InAppWalletOTPLoginUI } from "./InAppWalletOTPLoginUI.js";
import { InAppWalletPassKeyLogin } from "./InAppWalletPassKeyLogin.js";
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
  const data = useSelectionData();
  const setSelectionData = useSetSelectionData();
  const state = data as InAppWalletSelectUIState;
  const localeQuery = useInAppWalletLocale();
  const { connectModal } = useConnectUI();

  if (!localeQuery.data) {
    return <LoadingScreen />;
  }

  const goBackToMain =
    connectModal.size === "compact"
      ? props.goBack
      : () => {
          setSelectionData({});
        };

  const otpUserInfo = state?.emailLogin
    ? { email: state.emailLogin }
    : state?.phoneLogin
      ? { phone: state.phoneLogin }
      : undefined;

  if (otpUserInfo) {
    return (
      <InAppWalletOTPLoginUI
        userInfo={otpUserInfo}
        locale={localeQuery.data}
        done={props.done}
        goBack={goBackToMain}
        wallet={props.wallet}
      />
    );
  }

  if (state?.passkeyLogin) {
    return (
      <InAppWalletPassKeyLogin
        wallet={props.wallet}
        done={props.done}
        onBack={goBackToMain}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <InAppWalletSocialLogin
        socialAuth={state.socialLogin.type}
        locale={localeQuery.data}
        done={props.done}
        goBack={goBackToMain}
        wallet={props.wallet}
        state={state}
      />
    );
  }

  return (
    <InAppWalletFormUIScreen
      select={() => {}}
      locale={localeQuery.data}
      done={props.done}
      goBack={props.goBack}
      wallet={props.wallet}
    />
  );
}

export default InAppWalletConnectUI;
