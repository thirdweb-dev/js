"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import {
  useSelectionData,
  useSetSelectionData,
} from "../../providers/wallet-ui-states-provider.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { WalletAuth } from "../in-app/WalletAuth.js";
import { useInAppWalletLocale } from "../in-app/useInAppWalletLocale.js";
import type { ConnectWalletSelectUIState } from "../shared/ConnectWalletSocialOptions.js";
import { GuestLogin } from "../shared/GuestLogin.js";
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
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  walletConnect: { projectId?: string } | undefined;
  isLinking?: boolean;
}) {
  const data = useSelectionData();
  const setSelectionData = useSetSelectionData();
  const state = data as ConnectWalletSelectUIState;
  const localeId = props.connectLocale.id;
  const locale = useInAppWalletLocale(localeId);

  if (!locale) {
    return <LoadingScreen />;
  }

  const goBackToMain = () => {
    if (props.size === "compact") {
      props.goBack?.();
    }
    setSelectionData({});
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

  if (state?.walletLogin) {
    return (
      <WalletAuth
        meta={props.meta}
        chain={props.chain}
        inAppLocale={locale}
        walletConnect={props.walletConnect}
        wallet={props.wallet}
        client={props.client}
        size={props.size}
        done={done}
        onBack={goBackToMain || (() => setSelectionData({}))}
        locale={props.connectLocale}
        isLinking={state.walletLogin.linking}
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
    <EcosystemWalletFormUIScreen
      select={() => {}}
      locale={locale}
      done={done}
      goBack={props.goBack}
      wallet={props.wallet}
      chain={props.chain}
      client={props.client}
      size={props.size}
      connectLocale={props.connectLocale}
      meta={props.meta}
      isLinking={props.isLinking}
    />
  );
}

export default EcosystemWalletConnectUI;
