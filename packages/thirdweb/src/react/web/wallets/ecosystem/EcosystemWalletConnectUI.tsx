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
import type { LocaleId } from "../../ui/types.js";
import { useInAppWalletLocale } from "../in-app/useInAppWalletLocale.js";
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
  client: ThirdwebClient;
  chain: Chain | undefined;
  localeId: LocaleId;
  connectLocale: ConnectLocale;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
}) {
  const data = useSelectionData();
  const setSelectionData = useSetSelectionData();
  const state = data as ConnectWalletSelectUIState;
  const locale = useInAppWalletLocale(props.localeId);

  if (!locale) {
    return <LoadingScreen />;
  }

  const goBackToMain =
    props.size === "compact"
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
        chain={props.chain}
        client={props.client}
        size={props.size}
      />
    );
  }

  if (state?.passkeyLogin) {
    return (
      <PassKeyLogin
        wallet={props.wallet}
        done={props.done}
        onBack={goBackToMain}
        chain={props.chain}
        client={props.client}
        size={props.size}
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
        chain={props.chain}
        client={props.client}
        size={props.size}
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
      chain={props.chain}
      client={props.client}
      size={props.size}
      connectLocale={props.connectLocale}
      meta={props.meta}
    />
  );
}

export default EcosystemWalletConnectUI;
