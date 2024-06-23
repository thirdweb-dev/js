"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import type { ConnectButton_connectModalOptions } from "../../ui/ConnectWallet/ConnectButtonProps.js";
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
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
};

/**
 * @internal
 */
export function EcosystemWalletFormUIScreen(props: EcosystemWalletFormUIProps) {
  const isCompact = props.connectModal.size === "compact";
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
        (props.connectModal.showThirdwebBranding !== false ||
          props.connectModal.termsOfServiceUrl ||
          props.connectModal.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={props.connectModal.termsOfServiceUrl}
          privacyPolicyUrl={props.connectModal.privacyPolicyUrl}
          locale={props.connectLocale.agreement}
        />

        {props.connectModal.showThirdwebBranding !== false && (
          <PoweredByThirdweb />
        )}
      </Container>
    </Container>
  );
}
