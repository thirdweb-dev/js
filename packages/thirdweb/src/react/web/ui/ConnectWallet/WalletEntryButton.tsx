"use client";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { Skeleton } from "../components/Skeleton.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container } from "../components/basic.js";
import { Text } from "../components/text.js";
import { StyledButton } from "../design-system/elements.js";
import { useWalletInfo } from "../hooks/useWalletInfo.js";
import { useScreenContext } from "./Modal/screen.js";
import type { ConnectLocale } from "./locale/types.js";

/**
 * @internal
 */
export function WalletEntryButton(props: {
  walletId: WalletId;
  selectWallet: () => void;
  connectLocale: ConnectLocale;
  recommendedWallets: Wallet[] | undefined;
  client: ThirdwebClient;
}) {
  const { walletId, selectWallet } = props;
  const isRecommended = props.recommendedWallets?.find(
    (w) => w.id === walletId,
  );
  const { screen } = useScreenContext();
  const walletInfo = useWalletInfo(walletId);

  const walletName =
    getInstalledWalletProviders().find((p) => p.info.rdns === walletId)?.info
      .name || walletInfo.data?.name;

  const isInstalled = getInstalledWalletProviders().find(
    (p) => p.info.rdns === walletId,
  );

  return (
    <WalletButton
      type="button"
      onClick={selectWallet}
      data-active={
        screen && typeof screen === "object" && screen.id === walletId
      }
    >
      <WalletImage id={walletId} size={iconSize.xl} client={props.client} />

      <Container flex="column" gap="xxs" expand>
        {walletName ? (
          <Text color="primaryText" weight={600}>
            {walletName}
          </Text>
        ) : (
          <Skeleton width="100px" height={fontSize.md} />
        )}

        {isRecommended && (
          <Text size="sm">{props.connectLocale.recommended}</Text>
        )}

        {!isRecommended && isInstalled && (
          <Text size="sm">{props.connectLocale.installed}</Text>
        )}
      </Container>
    </WalletButton>
  );
}

export const WalletButton = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%",
    color: theme.colors.secondaryText,
    position: "relative",
    borderRadius: radius.md,
    padding: `${spacing.xs} ${spacing.xs}`,
    "&:hover": {
      backgroundColor: theme.colors.tertiaryBg,
      transform: "scale(1.01)",
    },
    '&[data-active="true"]': {
      backgroundColor: theme.colors.tertiaryBg,
    },
    transition: "background-color 200ms ease, transform 200ms ease",
  };
});
