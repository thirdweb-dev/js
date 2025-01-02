import styled from "@emotion/styled";
import { useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { shortenAddress } from "../../../../../../utils/address.js";
import type { Wallet } from "../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import {
  type fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../../core/design-system/index.js";
import { useChainName } from "../../../../../core/hooks/others/useChainQuery.js";
import type { TokenInfo } from "../../../../../core/utils/defaultTokens.js";
import { useEnsAvatar, useEnsName } from "../../../../../core/utils/wallet.js";
import { Img } from "../../../components/Img.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { Blobbie } from "../../Blobbie.js";
import { formatTokenBalance } from "../formatTokenBalance.js";
import type { TokenBalance } from "./swap/PaymentSelectionScreen.js";

export function WalletRowWithBalances(props: {
  client: ThirdwebClient;
  address: string;
  wallet: Wallet;
  balances: TokenBalance[];
  onClick: (wallet: Wallet, token: TokenInfo, chain: Chain) => void;
}) {
  const theme = useCustomTheme();
  const [showAll, setShowAll] = useState(false);
  const maxDisplayedBalances = 3;
  const displayedBalances = showAll
    ? props.balances
    : props.balances.slice(0, maxDisplayedBalances);

  return (
    <Container
      bg="tertiaryBg"
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${theme.colors.borderColor}`,
      }}
    >
      <Container style={{ padding: spacing.sm }}>
        <WalletRow {...props} />
      </Container>
      <div style={{ borderTop: `1px solid ${theme.colors.borderColor}` }} />
      <Container flex="column">
        {props.balances.length > 0 ? (
          <>
            {displayedBalances.map((b) => (
              <TokenBalanceRow
                client={props.client}
                onClick={() => props.onClick(props.wallet, b.token, b.chain)}
                key={`${b.token.address}-${b.chain.id}`}
                tokenBalance={b}
                wallet={props.wallet}
              />
            ))}
            {props.balances.length > maxDisplayedBalances && (
              <StyledButton
                variant="secondary"
                onClick={() => setShowAll(!showAll)}
                style={{
                  justifyContent: "start",
                }}
              >
                <Text size="xs">{showAll ? "Show less" : "Show more"}</Text>
              </StyledButton>
            )}
          </>
        ) : (
          <Container style={{ padding: spacing.sm }}>
            <Text size="sm" color="secondaryText">
              Not enough funds
            </Text>
          </Container>
        )}
      </Container>
    </Container>
  );
}

function TokenBalanceRow(props: {
  client: ThirdwebClient;
  tokenBalance: TokenBalance;
  wallet: Wallet;
  onClick: (token: TokenInfo, wallet: Wallet) => void;
}) {
  const { tokenBalance, wallet, onClick, client } = props;
  const chainInfo = useChainName(tokenBalance.chain);
  return (
    <StyledButton
      onClick={() => onClick(tokenBalance.token, wallet)}
      variant="secondary"
    >
      <TokenIcon
        token={tokenBalance.token}
        chain={tokenBalance.chain}
        size="md"
        client={client}
      />
      <Container flex="column" gap="3xs">
        <Text size="xs" color="primaryText">
          {tokenBalance.token.symbol}
        </Text>
        {chainInfo && <Text size="xs">{chainInfo.name}</Text>}
      </Container>
      <div style={{ flex: 1 }} />
      <Container flex="row" center="y" gap="3xs">
        <Text size="xs" color="secondaryText">
          {formatTokenBalance(tokenBalance.balance, true)}
        </Text>
      </Container>
    </StyledButton>
  );
}

export function WalletRow(props: {
  client: ThirdwebClient;
  address: string;
  iconSize?: keyof typeof iconSize;
  textSize?: keyof typeof fontSize;
  walletId?: WalletId;
}) {
  const { client, address } = props;
  const walletId = props.walletId;
  const theme = useCustomTheme();
  const ensNameQuery = useEnsName({
    client,
    address,
  });
  const addressOrENS = ensNameQuery.data || shortenAddress(address);
  const ensAvatarQuery = useEnsAvatar({
    client,
    ensName: ensNameQuery.data,
  });
  return (
    <Container flex="row" center="y" gap="sm" color="secondaryText">
      {ensAvatarQuery.data ? (
        <Img
          src={ensAvatarQuery.data}
          width={props.iconSize ? iconSize[props.iconSize] : iconSize.md}
          height={props.iconSize ? iconSize[props.iconSize] : iconSize.md}
          style={{
            borderRadius: "100%",
            overflow: "hidden",
            border: `1px solid ${theme.colors.borderColor}`,
          }}
          client={props.client}
        />
      ) : walletId ? (
        <WalletImage
          id={walletId}
          size={props.iconSize || iconSize.md}
          client={props.client}
        />
      ) : (
        <Container
          style={{
            width: iconSize.md,
            height: iconSize.md,
            borderRadius: "100%",
            overflow: "hidden",
            border: `1px solid ${theme.colors.borderColor}`,
          }}
        >
          <Blobbie address={props.address} size={Number(iconSize.md)} />
        </Container>
      )}

      <Text size={props.textSize || "sm"} color="primaryText">
        {addressOrENS || shortenAddress(props.address)}
      </Text>
    </Container>
  );
}

const StyledButton = /* @__PURE__ */ styled(Button)((_) => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: spacing.sm,
    gap: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
  };
});
