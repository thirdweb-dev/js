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
import { Container } from "../components/basic.js";
import { Img } from "../components/Img.js";
import { Skeleton } from "../components/Skeleton.js";
import { Text } from "../components/text.js";
import { WalletImage } from "../components/WalletImage.js";
import { StyledButton } from "../design-system/elements.js";
import { InAppWalletIcon } from "./in-app-wallet-icon.js";
import type { ConnectLocale } from "./locale/types.js";

/**
 * @internal
 */
export function WalletEntryButton(props: {
  className?: string;
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
  let nameOverride = customMeta?.name || walletName;
  const iconOverride = customMeta?.icon;

  // change "Social Login" to name of the login method if only 1 method is enabled
  if (wallet.id === "inApp") {
    const config = wallet.getConfig() as InAppWalletCreationOptions;
    if (config?.auth?.options.length === 1) {
      const name = config.auth?.options[0];
      if (name) {
        nameOverride = uppercaseFirstLetter({ text: name });
      }
    }
  }

  return (
    <WalletButtonEl
      className={props.className}
      data-active={props.isActive}
      onClick={selectWallet}
      type="button"
    >
      {iconOverride ? (
        <Img
          alt=""
          client={props.client}
          height={`${iconSize.xl}`}
          src={iconOverride}
          width={`${iconSize.xl}`}
        />
      ) : wallet.id === "inApp" ? (
        <InAppWalletIcon
          client={props.client}
          wallet={wallet as Wallet<"inApp">}
        />
      ) : (
        <WalletImage client={props.client} id={walletId} size={iconSize.xl} />
      )}

      <Container expand flex="column" gap="xxs">
        {nameOverride ? (
          <Text color="primaryText" weight={500}>
            {nameOverride}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="100px" />
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
    "&:hover": {
      backgroundColor: theme.colors.tertiaryBg,
      transform: "scale(1.01)",
    },
    '&[data-active="true"]': {
      backgroundColor: theme.colors.tertiaryBg,
    },
    alignItems: "center",
    borderRadius: radius.md,
    boxSizing: "border-box",
    color: theme.colors.secondaryText,
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
    padding: `${spacing.xs} ${spacing.xs}`,
    transition: "background-color 200ms ease, transform 200ms ease",
    width: "100%",
  };
});

function uppercaseFirstLetter(props: { text: string }) {
  return props.text.charAt(0).toUpperCase() + props.text.slice(1);
}
