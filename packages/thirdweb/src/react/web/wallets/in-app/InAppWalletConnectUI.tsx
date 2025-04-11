"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  useSelectionData,
  useSetSelectionData,
} from "../../providers/wallet-ui-states-provider.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import type { ConnectWalletSelectUIState } from "../shared/ConnectWalletSocialOptions.js";
import { GuestLogin } from "../shared/GuestLogin.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { OTPLoginUI } from "../shared/OTPLoginUI.js";
import { PassKeyLogin } from "../shared/PassKeyLogin.js";
import { SocialLogin } from "../shared/SocialLogin.js";
import { InAppWalletFormUIScreen } from "./InAppWalletFormUI.js";
import { WalletAuth } from "./WalletAuth.js";
import { useInAppWalletLocale } from "./useInAppWalletLocale.js";

/**
 *
 * @internal
 */
function InAppWalletConnectUI(props: {
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
  size: "compact" | "wide";
  meta?: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
  isLinking?: boolean;
  walletConnect: { projectId?: string } | undefined;
}) {
  const data = useSelectionData();
  const setSelectionData = useSetSelectionData();
  const state = data as ConnectWalletSelectUIState;
  const localeId = props.connectLocale.id;
  const locale = useInAppWalletLocale(localeId);
  const { initialScreen } = useScreenContext();

  if (!locale) {
    return <LoadingScreen />;
  }

  // if the the modal starts out with the wallet's connect ui instead of wallet selector - going back to main screen requires staying on the same component and clearing the selection data
  // otherwise, we go back to the wallet selector by calling props.goBack
  const goBackToMain = () => {
    if (initialScreen === props.wallet) {
      setSelectionData({});
    } else {
      props.goBack?.();
      setSelectionData({});
    }
  };

  const done = () => {
    props.done();
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
        done={done}
        goBack={goBackToMain}
        wallet={props.wallet}
        chain={props.chain}
        client={props.client}
        size={props.size}
        isLinking={props.isLinking}
      />
    );
  }

  if (state?.passkeyLogin) {
    return (
      <PassKeyLogin
        locale={props.connectLocale}
        wallet={props.wallet}
        done={done}
        onBack={goBackToMain}
        chain={props.chain}
        client={props.client}
        size={props.size}
        isLinking={props.isLinking}
      />
    );
  }

  if (state?.walletLogin) {
    return (
      <WalletAuth
        meta={props.meta}
        inAppLocale={locale}
        walletConnect={props.walletConnect}
        wallet={props.wallet}
        client={props.client}
        size={props.size}
        chain={props.chain}
        done={done}
        onBack={goBackToMain || (() => setSelectionData({}))}
        locale={props.connectLocale}
        isLinking={state.walletLogin.linking}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <SocialLogin
        socialAuth={state.socialLogin.type}
        locale={locale}
        done={done}
        goBack={goBackToMain}
        wallet={props.wallet}
        state={state}
        chain={props.chain}
        client={props.client}
        size={props.size}
        connectLocale={props.connectLocale}
        isLinking={props.isLinking}
      />
    );
  }

  if (state?.guestLogin) {
    return (
      <GuestLogin
        locale={locale}
        done={done}
        goBack={goBackToMain}
        wallet={props.wallet}
        state={state}
        client={props.client}
        size={props.size}
        connectLocale={props.connectLocale}
      />
    );
  }

  return (
    <InAppWalletFormUIScreen
      select={() => {}}
      connectLocale={props.connectLocale}
      inAppWalletLocale={locale}
      done={done}
      goBack={props.goBack}
      wallet={props.wallet}
      client={props.client}
      meta={props.meta}
      size={props.size}
      chain={props.chain}
      isLinking={props.isLinking}
    />
  );
}

export default InAppWalletConnectUI;
