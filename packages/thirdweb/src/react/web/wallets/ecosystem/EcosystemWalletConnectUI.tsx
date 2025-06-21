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
import { useInAppWalletLocale } from "../in-app/useInAppWalletLocale.js";
import { WalletAuth } from "../in-app/WalletAuth.js";
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
    <EcosystemWalletFormUIScreen
      chain={props.chain}
      client={props.client}
      connectLocale={props.connectLocale}
      done={done}
      goBack={props.goBack}
      isLinking={props.isLinking}
      locale={locale}
      meta={props.meta}
      select={() => {}}
      size={props.size}
      wallet={props.wallet}
    />
  );
}

export default EcosystemWalletConnectUI;
