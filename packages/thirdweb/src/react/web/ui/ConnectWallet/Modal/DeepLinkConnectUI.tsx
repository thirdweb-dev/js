"use client";
import { keyframes } from "@emotion/react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { InjectedSupportedWalletIds } from "../../../../../wallets/__generated__/wallet-ids.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../../wallets/wallet-info.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, radius } from "../../../../core/design-system/index.js";
import type { InjectedWalletLocale } from "../../../wallets/injected/locale/types.js";
import { WalletImage } from "../../components/WalletImage.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { ButtonLink } from "../../components/buttons.js";
import { StyledDiv } from "../../design-system/elements.js";

/**
 * @internal
 */
export const DeepLinkConnectUI = (props: {
  onGetStarted: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<InjectedSupportedWalletIds>;
  walletInfo: WalletInfo;
  deepLinkPrefix: string;
  onBack?: () => void;
  client: ThirdwebClient;
}) => {
  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.walletInfo.name} />
      </Container>

      <Container flex="row" center="x" animate="fadein" py="3xl">
        <PulsatingContainer>
          <WalletImage id={props.wallet.id} client={props.client} size={"80"} />
        </PulsatingContainer>
      </Container>

      <Container p="lg">
        <ButtonLink
          fullWidth
          variant="accent"
          href={`${props.deepLinkPrefix}${window.location
            .toString()
            .replace("https://", "")}`}
          gap="xs"
        >
          Continue in {props.walletInfo.name}
          <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
        </ButtonLink>
      </Container>
    </Container>
  );
};

const pulseAnimation = keyframes`
0% {
  transform: scale(0.9);
}
100% {
  opacity: 0;
  transform: scale(1.4);
}
`;

const PulsatingContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    position: "relative",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      background: theme.colors.accentText,
      animation: `${pulseAnimation} 2s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite`,
      zIndex: -1,
      borderRadius: radius.xl,
    },
  };
});
