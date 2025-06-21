import styled from "@emotion/styled";
import {
  CardStackIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import {
  useChainMetadata,
  useChainName,
} from "../../../../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../../../core/hooks/wallets/useActiveWallet.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import { useDisconnect } from "../../../../../../core/hooks/wallets/useDisconnect.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../../core/utils/defaultTokens.js";
import { LoadingScreen } from "../../../../../wallets/shared/LoadingScreen.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { TextDivider } from "../../../../components/TextDivider.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Text } from "../../../../components/text.js";
import { OutlineWalletIcon } from "../../../icons/OutlineWalletIcon.js";
import { formatTokenBalance } from "../../formatTokenBalance.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { FiatValue } from "./FiatValue.js";
import {
  type TokenBalance,
  useWalletsAndBalances,
} from "./fetchBalancesForWallet.js";
import { WalletRow } from "./WalletRow.js";

export function TokenSelectorScreen(props: {
  client: ThirdwebClient;
  sourceTokens: SupportedTokens | undefined;
  sourceSupportedTokens: SupportedTokens | undefined;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  tokenAmount: string;
  mode: PayUIOptions["mode"];
  hiddenWallets?: WalletId[];
  onSelectToken: (wallet: Wallet, token: TokenInfo, chain: Chain) => void;
  onConnect: () => void;
  onPayWithFiat: () => void;
  fiatSupported: boolean;
}) {
  const connectedWallets = useConnectedWallets();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const chainInfo = useChainMetadata(props.toChain);
  const theme = useCustomTheme();

  const walletsAndBalances = useWalletsAndBalances({
    client: props.client,
    mode: props.mode,
    sourceSupportedTokens: props.sourceSupportedTokens || [],
    toChain: props.toChain,
    toToken: props.toToken,
  });

  if (
    walletsAndBalances.isLoading ||
    chainInfo.isLoading ||
    !chainInfo.data ||
    !props.sourceSupportedTokens
  ) {
    return <LoadingScreen />;
  }

  const filteredWallets = Array.from(walletsAndBalances.data?.entries() || [])
    .filter(([w]) => !props.hiddenWallets?.includes(w.id))
    .filter(([, balances]) => {
      const hasEnoughBalance = balances.some((b) => b.balance.value > 0);
      return hasEnoughBalance;
    });

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "200px",
      }}
    >
      {filteredWallets.length === 0 ? (
        <Container flex="column" gap="xs" py="lg">
          <Text center color="secondaryText" size="xs">
            No suitable payment token found
            <br />
            in connected wallets
          </Text>
        </Container>
      ) : (
        <Container flex="column" gap="xs">
          <Text size="sm">Select payment token</Text>
          <Spacer y="xs" />
        </Container>
      )}
      <Container
        scrollY
        style={{
          maxHeight: "350px",
        }}
      >
        <Container flex="column" gap="sm">
          {filteredWallets.map(([w, balances]) => {
            const address = w.address;
            const wallet = connectedWallets.find(
              (w) => w.getAccount()?.address === address,
            );
            if (!wallet) return null;
            return (
              <WalletRowWithBalances
                address={address}
                balances={balances}
                client={props.client}
                key={w.id}
                onClick={(wallet, token, chain) => {
                  trackPayEvent({
                    chainId: chain.id,
                    client: props.client,
                    event: "choose_payment_method_token",
                    fromToken: isNativeToken(token) ? undefined : token.address,
                    toChainId: props.toChain.id,
                    toToken: isNativeToken(props.toToken)
                      ? undefined
                      : props.toToken.address,
                    walletAddress: activeAccount?.address,
                    walletType: activeWallet?.id,
                  });
                  props.onSelectToken(wallet, token, chain);
                }}
                wallet={wallet}
              />
            );
          })}
          {filteredWallets.length > 0 && <TextDivider text="OR" />}
          <Button
            bg="tertiaryBg"
            fullWidth
            onClick={() => {
              trackPayEvent({
                client: props.client,
                event: "choose_payment_method_another_wallet",
                toChainId: props.toChain.id,
                toToken: isNativeToken(props.toToken)
                  ? undefined
                  : props.toToken.address,
                walletAddress: activeAccount?.address,
                walletType: activeWallet?.id,
              });
              props.onConnect();
            }}
            style={{
              border: `1px solid ${theme.colors.borderColor}`,
              padding: spacing.sm,
            }}
            variant="secondary"
          >
            <Container
              center="y"
              color="secondaryIconColor"
              expand
              flex="row"
              gap="sm"
            >
              <OutlineWalletIcon size={iconSize.md} />
              <Text color="primaryText" size="sm">
                Pay with another wallet
              </Text>
            </Container>
          </Button>
          {props.fiatSupported && (
            <Button
              bg="tertiaryBg"
              fullWidth
              onClick={() => {
                trackPayEvent({
                  client: props.client,
                  event: "choose_payment_method_with_card",
                  toChainId: props.toChain.id,
                  toToken: isNativeToken(props.toToken)
                    ? undefined
                    : props.toToken.address,
                  walletAddress: activeAccount?.address,
                  walletType: activeWallet?.id,
                });
                props.onPayWithFiat();
              }}
              style={{
                border: `1px solid ${theme.colors.borderColor}`,
                padding: spacing.sm,
              }}
              variant="secondary"
            >
              <Container
                center="y"
                color="secondaryIconColor"
                expand
                flex="row"
                gap="sm"
              >
                <CardStackIcon height={iconSize.md} width={iconSize.md} />
                <Text color="primaryText" size="sm">
                  Pay with card
                </Text>
              </Container>
            </Button>
          )}
        </Container>
      </Container>
    </Container>
  );
}

function WalletRowWithBalances(props: {
  client: ThirdwebClient;
  address: string;
  wallet: Wallet;
  balances: TokenBalance[];
  onClick: (wallet: Wallet, token: TokenInfo, chain: Chain) => void;
  hideConnectButton?: boolean;
}) {
  const theme = useCustomTheme();
  const displayedBalances = props.balances;
  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const isActiveAccount = activeAccount?.address === props.address;

  return (
    <Container
      flex="column"
      style={{
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: radius.lg,
      }}
    >
      <Container
        bg="tertiaryBg"
        flex="row"
        gap="sm"
        style={{
          borderBottom: `1px solid ${theme.colors.borderColor}`,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          justifyContent: "space-between",
          padding: spacing.sm,
          paddingRight: spacing.xs,
        }}
      >
        <WalletRow {...props} />
        {!isActiveAccount && (
          <Button
            onClick={() => disconnect(props.wallet)}
            style={{
              color: theme.colors.secondaryText,
              padding: spacing.xxs,
            }}
            variant="ghost"
          >
            <Cross2Icon height={iconSize.sm} width={iconSize.sm} />
          </Button>
        )}
      </Container>
      <Container flex="column">
        {props.balances.length > 0 ? (
          displayedBalances.map((b, idx) => (
            <TokenBalanceRow
              client={props.client}
              key={`${b.token.address}-${b.chain.id}`}
              onClick={() => props.onClick(props.wallet, b.token, b.chain)}
              style={{
                borderBottom:
                  idx === displayedBalances.length - 1
                    ? "none"
                    : `1px solid ${theme.colors.borderColor}`,
                borderBottomLeftRadius:
                  idx === displayedBalances.length - 1 ? radius.lg : 0,
                borderBottomRightRadius:
                  idx === displayedBalances.length - 1 ? radius.lg : 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              tokenBalance={b}
              wallet={props.wallet}
            />
          ))
        ) : (
          <Container style={{ padding: spacing.sm }}>
            <Text color="secondaryText" size="sm">
              Insufficient Funds
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
  style?: React.CSSProperties;
}) {
  const { tokenBalance, wallet, onClick, client, style } = props;
  const chainInfo = useChainName(tokenBalance.chain);
  return (
    <StyledButton
      onClick={() => onClick(tokenBalance.token, wallet)}
      style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        minWidth: 0, // Needed for text truncation to work
      }}
      variant="secondary"
    >
      <Container
        center="y"
        flex="row"
        gap="sm"
        style={{
          flex: "1 1 50%",
          flexWrap: "nowrap",
          maxWidth: "50%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <TokenIcon
          chain={tokenBalance.chain}
          client={client}
          size="md"
          token={tokenBalance.token}
        />
        <Container flex="column" gap="4xs" style={{ minWidth: 0 }}>
          <Text
            color="primaryText"
            size="xs"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tokenBalance.token.symbol}
          </Text>
          {chainInfo && (
            <Text
              size="xs"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chainInfo.name}
            </Text>
          )}
        </Container>
      </Container>

      <Container
        center="y"
        color="secondaryText"
        flex="row"
        gap="4xs"
        style={{
          flex: "1 1 50%",
          flexWrap: "nowrap",
          justifyContent: "flex-end",
          maxWidth: "50%",
          minWidth: 0,
        }}
      >
        <Container
          color="secondaryText"
          flex="column"
          gap="4xs"
          style={{
            alignItems: "flex-end",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Text
            color="primaryText"
            size="xs"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formatTokenBalance(tokenBalance.balance, true, 2)}
          </Text>
          <FiatValue
            chain={tokenBalance.chain}
            client={client}
            size="xs"
            token={tokenBalance.token}
            tokenAmount={tokenBalance.balance.displayValue}
          />
        </Container>
        <ChevronRightIcon
          height={iconSize.md}
          style={{ flexShrink: 0 }}
          width={iconSize.md}
        />
      </Container>
    </StyledButton>
  );
}

const StyledButton = /* @__PURE__ */ styled(Button)((props) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    background: "transparent",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.sm,
    justifyContent: "space-between",
    padding: spacing.sm,
    paddingRight: spacing.xs,
    transition: "background 200ms ease, transform 150ms ease",
    ...props.style,
  };
});
