"use client";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { ConnectLocale } from "../shared/locale/types.js";

export type InAppWalletFormUIProps = {
  select: () => void;
  locale: ConnectLocale;
  done: () => void;
  wallet: Wallet<"inApp">;
  goBack?: () => void;
};

/**
 * @internal
 */
export function InAppWalletFormUIScreen(props: InAppWalletFormUIProps) {
  const locale = props.locale.emailLoginScreen;
  const { connectModal, client } = useConnectUI();
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
          <ModalHeader
            onBack={onBack}
            title={
              <>
                {!connectModal.titleIcon ? null : (
                  <Img
                    src={connectModal.titleIcon}
                    width={iconSize.md}
                    height={iconSize.md}
                    client={client}
                  />
                )}
                <ModalTitle>{connectModal.title ?? locale.title}</ModalTitle>
              </>
            }
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
