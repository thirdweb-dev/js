"use client";
import { useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";
import { EcosystemWalletHeader } from "./EcosystemWalletHeader.js";

type EcosystemWalletFormUIProps = {
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
    requireApproval?: boolean;
  };
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
  isLinking?: boolean;
};

/**
 * @internal
 */
export function EcosystemWalletFormUIScreen(props: EcosystemWalletFormUIProps) {
  const isCompact = props.size === "compact";
  const { initialScreen, screen } = useScreenContext();
  // This is only used when requireApproval is true to accept the TOS
  const [isApproved, setIsApproved] = useState(false);

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
      {props.isLinking ? (
        <ModalHeader
          title={props.connectLocale.manageWallet.linkProfile}
          onBack={onBack}
        />
      ) : (
        <EcosystemWalletHeader
          client={props.client}
          onBack={isCompact ? onBack : undefined}
          wallet={props.wallet}
        />
      )}
      <Spacer y="lg" />

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <ConnectWalletSocialOptions
          disabled={props.meta.requireApproval && !isApproved}
          {...props}
        />
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
          requireApproval={props.meta.requireApproval}
          onApprove={() => {
            setIsApproved(!isApproved);
          }}
          isApproved={isApproved}
        />

        {props.meta.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
}
