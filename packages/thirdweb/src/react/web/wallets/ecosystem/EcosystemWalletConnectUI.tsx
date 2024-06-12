"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import {
  useSelectionData,
  useSetSelectionData,
} from "../../providers/wallet-ui-states-provider.js";
import { useConnectLocale } from "../in-app/useInAppWalletLocale.js";
import type { ConnectWalletSelectUIState } from "../shared/ConnectWalletSocialOptions.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { OTPLoginUI } from "../shared/OTPLoginUI.js";
import { PassKeyLogin } from "../shared/PassKeyLogin.js";
import { SocialLogin } from "../shared/SocialLogin.js";
import { EcosystemWalletFormUIScreen } from "./EcosystemWalletFormUI.js";

/**
 *
 * @internal
 */
function EcosystemWalletConnectUI(props: {
  wallet: Wallet<EcosystemWalletId>;
  done: () => void;
  goBack?: () => void;
}) {
  const data = useSelectionData();
  const setSelectionData = useSetSelectionData();
  const state = data as ConnectWalletSelectUIState;
  const locale = useConnectLocale();
  const { connectModal } = useConnectUI();

  if (!locale) {
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
      <OTPLoginUI
        userInfo={otpUserInfo}
        locale={locale}
        done={props.done}
        goBack={goBackToMain}
        wallet={props.wallet}
      />
    );
  }

  if (state?.passkeyLogin) {
    return (
      <PassKeyLogin
        wallet={props.wallet}
        done={props.done}
        onBack={goBackToMain}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <SocialLogin
        socialAuth={state.socialLogin.type}
        locale={locale}
        done={props.done}
        goBack={goBackToMain}
        wallet={props.wallet}
        state={state}
      />
    );
  }

  return (
    <EcosystemWalletFormUIScreen
      select={() => {}}
      locale={locale}
      done={props.done}
      goBack={props.goBack}
      wallet={props.wallet}
    />
  );
}

export default EcosystemWalletConnectUI;
