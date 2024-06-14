"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container } from "../../ui/components/basic.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { ConnectLocale } from "../shared/locale/types.js";
import { EcosystemWalletHeader } from "./EcosystemWalletHeader.js";

export type EcosystemWalletFormUIProps = {
  select: () => void;
  done: () => void;
  locale: ConnectLocale;
  wallet: Wallet<EcosystemWalletId>;
  goBack?: () => void;
};

/**
 * @internal
 */
export function EcosystemWalletFormUIScreen(props: EcosystemWalletFormUIProps) {
  const { client, connectModal } = useConnectUI();
  const isCompact = connectModal.size === "compact";
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
            client={client}
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
        (connectModal.showThirdwebBranding !== false ||
          connectModal.termsOfServiceUrl ||
          connectModal.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={connectModal.termsOfServiceUrl}
          privacyPolicyUrl={connectModal.privacyPolicyUrl}
        />

        {connectModal.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
}
