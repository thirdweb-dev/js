"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container } from "../../ui/components/basic.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";
import { EcosystemWalletHeader } from "./EcosystemWalletHeader.js";

export type EcosystemWalletFormUIProps = {
  select: () => void;
  done: () => void;
  locale: InAppWalletLocale;
  wallet: Wallet<EcosystemWalletId>;
  goBack?: () => void;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
};

/**
 * @internal
 */
export function EcosystemWalletFormUIScreen(props: EcosystemWalletFormUIProps) {
  const isCompact = props.size === "compact";
  const { initialScreen, screen } = useScreenContext();

  const onBack =
    screen === props.wallet && initialScreen === props.wallet
      ? undefined
      : props.goBack;

  return (
    <Container
      fullHeight
      flex="column"
      p="lg"
      animate="fadein"
      style={{
        minHeight: "250px",
      }}
    >
      {isCompact ? (
        <>
          <EcosystemWalletHeader
            client={props.client}
            onBack={onBack}
            wallet={props.wallet}
          />
          <Spacer y="lg" />
        </>
      ) : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <ConnectWalletSocialOptions {...props} />
      </Container>

      {isCompact &&
        (props.meta.showThirdwebBranding !== false ||
          props.meta.termsOfServiceUrl ||
          props.meta.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={props.meta.termsOfServiceUrl}
          privacyPolicyUrl={props.meta.privacyPolicyUrl}
          locale={props.connectLocale.agreement}
        />

        {props.meta.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
}
