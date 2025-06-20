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
import { Container, ModalHeader } from "../../components/basic.js";
import { ButtonLink } from "../../components/buttons.js";
import { WalletImage } from "../../components/WalletImage.js";
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
  let link = window.location.toString();
  if (props.wallet.id === "io.metamask") {
    link = link.replace("https://", "");
  } else {
    link = encodeURIComponent(link);
  }
  const deeplink = `${props.deepLinkPrefix}${link}?ref=${link}`;
  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.walletInfo.name} />
      </Container>

      <Container animate="fadein" center="x" flex="row" py="3xl">
        <PulsatingContainer>
          <WalletImage client={props.client} id={props.wallet.id} size="80" />
        </PulsatingContainer>
      </Container>

      <Container p="lg">
        <ButtonLink fullWidth gap="xs" href={deeplink} variant="accent">
          Continue in {props.walletInfo.name}
          <ExternalLinkIcon height={iconSize.sm} width={iconSize.sm} />
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
    "&::before": {
      animation: `${pulseAnimation} 2s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite`,
      background: theme.colors.accentText,
      borderRadius: radius.xl,
      bottom: 0,
      content: '""',
      display: "block",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: -1,
    },
    position: "relative",
  };
});
