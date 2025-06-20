"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  useSelectionData,
  useSetSelectionData,
} from "../../providers/wallet-ui-states-provider.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import type { ConnectWalletSelectUIState } from "../shared/ConnectWalletSocialOptions.js";
import { GuestLogin } from "../shared/GuestLogin.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { OTPLoginUI } from "../shared/OTPLoginUI.js";
import { PassKeyLogin } from "../shared/PassKeyLogin.js";
import { SocialLogin } from "../shared/SocialLogin.js";
import { InAppWalletFormUIScreen } from "./InAppWalletFormUI.js";
import { useInAppWalletLocale } from "./useInAppWalletLocale.js";
import { WalletAuth } from "./WalletAuth.js";

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

  // if the modal starts out with the wallet's connect ui instead of wallet selector - going back to main screen requires staying on the same component and clearing the selection data
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
        chain={props.chain}
        client={props.client}
        done={done}
        goBack={goBackToMain}
        isLinking={props.isLinking}
        locale={locale}
        size={props.size}
        userInfo={otpUserInfo}
        wallet={props.wallet}
      />
    );
  }

  if (state?.passkeyLogin) {
    return (
      <PassKeyLogin
        chain={props.chain}
        client={props.client}
        done={done}
        isLinking={props.isLinking}
        locale={props.connectLocale}
        onBack={goBackToMain}
        size={props.size}
        wallet={props.wallet}
      />
    );
  }

  if (state?.walletLogin) {
    return (
      <WalletAuth
        chain={props.chain}
        client={props.client}
        done={done}
        inAppLocale={locale}
        isLinking={state.walletLogin.linking}
        locale={props.connectLocale}
        meta={props.meta}
        onBack={goBackToMain || (() => setSelectionData({}))}
        size={props.size}
        wallet={props.wallet}
        walletConnect={props.walletConnect}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <SocialLogin
        chain={props.chain}
        client={props.client}
        connectLocale={props.connectLocale}
        done={done}
        goBack={goBackToMain}
        isLinking={props.isLinking}
        locale={locale}
        size={props.size}
        socialAuth={state.socialLogin.type}
        state={state}
        wallet={props.wallet}
      />
    );
  }

  if (state?.guestLogin) {
    return (
      <GuestLogin
        client={props.client}
        connectLocale={props.connectLocale}
        done={done}
        goBack={goBackToMain}
        locale={locale}
        size={props.size}
        state={state}
        wallet={props.wallet}
      />
    );
  }

  return (
    <InAppWalletFormUIScreen
      chain={props.chain}
      client={props.client}
      connectLocale={props.connectLocale}
      done={done}
      goBack={props.goBack}
      inAppWalletLocale={locale}
      isLinking={props.isLinking}
      meta={props.meta}
      select={() => {}}
      size={props.size}
      wallet={props.wallet}
    />
  );
}

export default InAppWalletConnectUI;
