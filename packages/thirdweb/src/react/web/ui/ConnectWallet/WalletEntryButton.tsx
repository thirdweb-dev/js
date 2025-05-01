"use client";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { InAppWalletCreationOptions } from "../../../../wallets/in-app/core/wallet/types.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { useWalletInfo } from "../../../core/utils/wallet.js";
import { Img } from "../components/Img.js";
import { Skeleton } from "../components/Skeleton.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container } from "../components/basic.js";
import { Text } from "../components/text.js";
import { StyledButton } from "../design-system/elements.js";
import type { ConnectLocale } from "./locale/types.js";

/**
 * @internal
 */
export function WalletEntryButton(props: {
  wallet: Wallet;
  selectWallet: () => void;
  connectLocale: ConnectLocale;
  recommendedWallets: Wallet[] | undefined;
  client: ThirdwebClient;
  isActive: boolean;
  badge: string | undefined;
}) {
  const { selectWallet, wallet } = props;
  const walletId = wallet.id;
  const isRecommended = props.recommendedWallets?.find(
    (w) => w.id === walletId,
  );

  const walletInfo = useWalletInfo(walletId);

  const walletName =
    getInstalledWalletProviders().find((p) => p.info.rdns === walletId)?.info
      .name || walletInfo.data?.name;

  const isInstalled = getInstalledWalletProviders().find(
    (p) => p.info.rdns === walletId,
  );

  const customMeta =
    wallet && walletId === "inApp"
      ? (wallet.getConfig() as InAppWalletCreationOptions)?.metadata
      : undefined;
  const nameOverride = customMeta?.name || walletName;
  const iconOverride = customMeta?.icon;

  return (
    <WalletButtonEl
      type="button"
      onClick={selectWallet}
      data-active={props.isActive}
    >
      {iconOverride ? (
        <Img
          client={props.client}
          src={iconOverride}
          alt={nameOverride}
          width={`${iconSize.xl}`}
          height={`${iconSize.xl}`}
        />
      ) : (
        <WalletImage id={walletId} size={iconSize.xl} client={props.client} />
      )}

      <Container flex="column" gap="xxs" expand>
        {nameOverride ? (
          <Text color="primaryText" weight={600}>
            {nameOverride}
          </Text>
        ) : (
          <Skeleton width="100px" height={fontSize.md} />
        )}
        {props.badge ? (
          <Text size="sm">{props.badge}</Text>
        ) : isRecommended ? (
          <Text size="sm">{props.connectLocale.recommended}</Text>
        ) : isInstalled ? (
          <Text size="sm">{props.connectLocale.installed}</Text>
        ) : null}
      </Container>
    </WalletButtonEl>
  );
}

export const WalletButtonEl = /* @__PURE__ */ StyledButton((_) => {
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
