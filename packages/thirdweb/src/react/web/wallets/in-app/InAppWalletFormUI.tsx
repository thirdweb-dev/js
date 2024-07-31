"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../core/design-system/index.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { ConnectWalletSocialOptions } from "../shared/ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";

export type InAppWalletFormUIProps = {
  select: () => void;
  inAppWalletLocale: InAppWalletLocale;
  connectLocale: ConnectLocale;
  done: () => void;
  wallet: Wallet<"inApp">;
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
};

/**
 * @internal
 */
export function InAppWalletFormUIScreen(props: InAppWalletFormUIProps) {
  const isCompact = props.size === "compact";
  const { initialScreen, screen } = useScreenContext();

  const isInitialScreen =
    screen === props.wallet && initialScreen === props.wallet;

  const onBack = isInitialScreen ? undefined : props.goBack;

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
      {isCompact &&
        (isInitialScreen ? (
          <>
            <ModalHeader
              onBack={onBack}
              leftAligned={true}
              title={
                <>
                  {!props.meta.titleIconUrl ? null : (
                    <Img
                      src={props.meta.titleIconUrl}
                      width={iconSize.md}
                      height={iconSize.md}
                      client={props.client}
                    />
                  )}
                  <ModalTitle>
                    {props.meta.title ??
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
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <ConnectWalletSocialOptions
          {...props}
          locale={props.inAppWalletLocale}
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
        />

        {props.meta.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
}
