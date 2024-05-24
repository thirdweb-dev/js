"use client";
import type { Wallet } from "../../../../exports/wallets.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useEcosystem } from "../../../core/hooks/others/useEcosystem.js";
// import { localWalletMetadata } from "../../../../wallets/local/index._ts";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { Img } from "../components/Img.js";
import { Skeleton } from "../components/Skeleton.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container } from "../components/basic.js";
import { Text } from "../components/text.js";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledButton } from "../design-system/elements.js";
import { fontSize, iconSize, radius, spacing } from "../design-system/index.js";
import { useWalletInfo } from "../hooks/useWalletInfo.js";
import { useScreenContext } from "./Modal/screen.js";
import { genericWalletIcon } from "./icons/dataUris.js";

type WalletEntryButtonProps = {
  selectWallet: () => void;
} & (
  | {
      walletId?: never;
      wallet: Wallet;
    }
  | {
      walletId: WalletId;
      wallet?: never;
    }
);

/**
 * @internal
 */
export function WalletEntryButton(props: WalletEntryButtonProps) {
  let { walletId, selectWallet, wallet } = props;
  if (walletId === undefined) {
    walletId = (wallet as Wallet).id; // this is guaranteed to exist based on the type definition
  }
  const { connectLocale, recommendedWallets, client } = useConnectUI();
  const isRecommended = recommendedWallets?.find((w) => w.id === walletId);
  const { screen } = useScreenContext();
  const walletInfo = useWalletInfo(walletId);

  const walletConfig = wallet?.getConfig();
  const integratorId =
    walletConfig && "integratorId" in walletConfig
      ? walletConfig.integratorId
      : undefined;

  const { data: ecosystemData, isFetched: ecosystemFetched } = useEcosystem({
    integratorId,
  }); // this will only run if we have an integrator ID

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
      {integratorId ? (
        <Img
          client={client}
          src={
            ecosystemFetched
              ? ecosystemData?.imageUrl || genericWalletIcon
              : undefined
          }
          fallbackImage={genericWalletIcon}
          width={iconSize.xl}
          height={iconSize.xl}
          loading="eager"
          style={{
            borderRadius: radius.md,
          }}
        />
      ) : (
        <WalletImage id={walletId} size={iconSize.xl} client={client} />
      )}

      <Container flex="column" gap="xxs" expand>
        {/* If we have an integrator ID, wait for that data to be fetched */}
        {(integratorId && ecosystemFetched) || (!integratorId && walletName) ? (
          <Text color="primaryText" weight={600}>
            {ecosystemData?.name || walletName}
          </Text>
        ) : (
          <Skeleton width="100px" height={fontSize.md} />
        )}

        {isRecommended && <Text size="sm">{connectLocale.recommended}</Text>}

        {!isRecommended && isInstalled && (
          <Text size="sm">{connectLocale.installed}</Text>
        )}
      </Container>
    </WalletButton>
  );
}

export const WalletButton = /* @__PURE__ */ StyledButton(() => {
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
