"use client";
import { useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../core/design-system/index.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Img } from "../../ui/components/Img.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";

type InAppWalletFormUIProps = {
  select: () => void;
  inAppWalletLocale: InAppWalletLocale;
  connectLocale: ConnectLocale;
  done: () => void;
  wallet: Wallet<"inApp">;
  goBack?: () => void;
  size: "compact" | "wide";
  meta?: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    requireApproval?: boolean;
  };
  client: ThirdwebClient;
  chain: Chain | undefined;
  isLinking?: boolean;
};

/**
 * @internal
 */
export function InAppWalletFormUIScreen(props: InAppWalletFormUIProps) {
  const isCompact = props.size === "compact";
  const { initialScreen, screen } = useScreenContext();
  // This is only used when requireApproval is true to accept the TOS
  const [isApproved, setIsApproved] = useState(false);

  const isInitialScreen =
    screen === props.wallet && initialScreen === props.wallet;

  const onBack = isInitialScreen && !props.isLinking ? undefined : props.goBack;

  return (
    <Container
      animate="fadein"
      flex="column"
      fullHeight
      p="lg"
      style={{
        minHeight: "250px",
      }}
    >
      {isCompact &&
        (isInitialScreen ? (
          <>
            <ModalHeader
              leftAligned={!props.isLinking}
              onBack={onBack}
              title={
                <>
                  {!props.meta?.titleIconUrl ? null : (
                    <Img
                      client={props.client}
                      height={iconSize.md}
                      src={props.meta?.titleIconUrl}
                      width={iconSize.md}
                    />
                  )}
                  <ModalTitle>
                    {props.meta?.title ??
                      props.inAppWalletLocale.emailLoginScreen.title}
                  </ModalTitle>
                </>
              }
            />
            <Spacer y="lg" />
          </>
        ) : (
          <ModalHeader onBack={onBack} title={props.inAppWalletLocale.signIn} />
        ))}
      <Container
        center="y"
        expand
        flex="column"
        p={isCompact ? undefined : "lg"}
      >
        <ConnectWalletSocialOptions
          {...props}
          disabled={props.meta?.requireApproval && !isApproved}
          locale={props.inAppWalletLocale}
        />
      </Container>

      {isCompact &&
        (props.meta?.showThirdwebBranding !== false ||
          props.meta?.termsOfServiceUrl ||
          props.meta?.privacyPolicyUrl) && <Spacer y="xl" />}
      <Container flex="column" gap="lg">
        <TOS
          isApproved={isApproved}
          locale={props.connectLocale.agreement}
          onApprove={() => {
            setIsApproved(!isApproved);
          }}
          privacyPolicyUrl={props.meta?.privacyPolicyUrl}
          requireApproval={props.meta?.requireApproval}
          termsOfServiceUrl={props.meta?.termsOfServiceUrl}
        />

        {props.meta?.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
}
