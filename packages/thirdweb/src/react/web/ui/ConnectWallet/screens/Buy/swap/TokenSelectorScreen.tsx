import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { shortenAddress } from "../../../../../../../utils/address.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import { getWalletBalance } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  type fontSize,
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
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../../core/utils/defaultTokens.js";
import {
  useEnsAvatar,
  useEnsName,
} from "../../../../../../core/utils/wallet.js";
import { LoadingScreen } from "../../../../../wallets/shared/LoadingScreen.js";
import { Img } from "../../../../components/Img.js";
import { TextDivider } from "../../../../components/TextDivider.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { WalletImage } from "../../../../components/WalletImage.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { Blobbie } from "../../../Blobbie.js";
import { OutlineWalletIcon } from "../../../icons/OutlineWalletIcon.js";
import type { ConnectLocale } from "../../../locale/types.js";
import { formatTokenBalance } from "../../formatTokenBalance.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { FiatValue } from "./FiatValue.js";
import type { TokenBalance } from "./PaymentSelectionScreen.js";

export function TokenSelectorScreen(props: {
  client: ThirdwebClient;
  sourceTokens: SupportedTokens | undefined;
  sourceSupportedTokens: SupportedTokens | undefined;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  fromToken: ERC20OrNativeToken;
  fromChain: Chain;
  tokenAmount: string;
  mode: PayUIOptions["mode"];
  hiddenWallets?: WalletId[];
  onSelect: (wallet: Wallet, token: TokenInfo, chain: Chain) => void;
  onBack: () => void;
  onConnect: () => void;
  modalTitle?: string;
  connectLocale: ConnectLocale;
}) {
  const connectedWallets = useConnectedWallets();
  const activeAccount = useActiveAccount();
  const chainInfo = useChainMetadata(props.toChain);
  const theme = useCustomTheme();
  const locale = props.connectLocale.sendFundsScreen;

  const walletsAndBalances = useQuery({
    queryKey: [
      "wallets-and-balances",
      props.sourceSupportedTokens,
      props.toChain.id,
      props.toToken,
      props.tokenAmount,
      props.mode,
      activeAccount?.address,
      connectedWallets.map((w) => w.getAccount()?.address),
    ],
    queryFn: async () => {
      // in parallel, get the balances of all the wallets on each of the sourceSupportedTokens
      const walletBalanceMap = new Map<Wallet, TokenBalance[]>();

      const balancePromises = connectedWallets.flatMap((wallet) => {
        const account = wallet.getAccount();
        if (!account) return [];
        walletBalanceMap.set(wallet, []);

        // inject the destination token too since it can be used as well to pay/transfer
        const toToken = isNativeToken(props.toToken)
          ? {
              address: NATIVE_TOKEN_ADDRESS,
              name: chainInfo.data?.nativeCurrency.name || "",
              symbol: chainInfo.data?.nativeCurrency.symbol || "",
              icon: chainInfo.data?.icon?.url,
            }
          : props.toToken;

        const tokens = {
          ...props.sourceSupportedTokens,
          [props.toChain.id]: [
            toToken,
            ...(props.sourceSupportedTokens?.[props.toChain.id] || []),
          ],
        };

        return Object.entries(tokens).flatMap(([chainId, tokens]) => {
          return tokens.map(async (token) => {
            try {
              const chain = getCachedChain(Number(chainId));
              const balance = await getWalletBalance({
                address: account.address,
                chain,
                tokenAddress: isNativeToken(token) ? undefined : token.address,
                client: props.client,
              });

              // show the token if:
              // - its not the destination token and balance is greater than 0
              // - its the destination token and balance is greater than the token amount AND we the account is not the default account in fund_wallet mode
              const shouldInclude =
                token.address === toToken.address &&
                chain.id === props.toChain.id
                  ? props.mode === "fund_wallet" &&
                    account.address === activeAccount?.address
                    ? false
                    : Number(balance.displayValue) > Number(props.tokenAmount)
                  : balance.value > 0n;

              if (shouldInclude) {
                const existingBalances = walletBalanceMap.get(wallet) || [];
                existingBalances.push({ balance, chain, token });
                existingBalances.sort((a, b) => {
                  if (
                    a.chain.id === props.toChain.id &&
                    a.token.address === toToken.address
                  )
                    return -1;
                  if (
                    b.chain.id === props.toChain.id &&
                    b.token.address === toToken.address
                  )
                    return 1;
                  if (a.chain.id === props.toChain.id) return -1;
                  if (b.chain.id === props.toChain.id) return 1;
                  return a.chain.id > b.chain.id ? 1 : -1;
                });
              }
            } catch (error) {
              console.error(
                `Failed to fetch balance for wallet ${wallet.id} on chain ${chainId} for token ${token.symbol}:`,
                error,
              );
            }
          });
        });
      });

      await Promise.all(balancePromises);
      return walletBalanceMap;
    },
    enabled: !!props.sourceSupportedTokens && !!chainInfo.data,
  });

  if (walletsAndBalances.isLoading || !walletsAndBalances.data) {
    return <LoadingScreen />;
  }

  const filteredWallets = Array.from(walletsAndBalances.data.entries() || [])
    .filter(([w]) => !props.hiddenWallets?.includes(w.id))
    .filter(([, balances]) => {
      const hasEnoughBalance = balances.some((b) => b.balance.value > 0);
      return hasEnoughBalance;
    });

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container py="md" px="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.modalTitle || locale.selectTokenTitle}
        />
      </Container>

      <Line />

      <Container
        scrollY
        style={{
          maxHeight: "450px",
        }}
      >
        <Container flex="column" gap="sm" p="lg">
          {filteredWallets.length === 0 && (
            <Container flex="column" gap="xs" py="md">
              <Text size="xs" color="secondaryText" center>
                <i>
                  No suitable payment token found
                  <br />
                  in connected wallets
                </i>
              </Text>
            </Container>
          )}
          {filteredWallets.map(([w, balances]) => {
            const address = w.getAccount()?.address;
            if (!address) return null;
            return (
              <WalletRowWithBalances
                key={w.id}
                wallet={w}
                balances={balances}
                client={props.client}
                address={address}
                onClick={props.onSelect}
              />
            );
          })}
          {filteredWallets.length > 0 && <TextDivider text="OR" />}
          <Button
            variant="secondary"
            fullWidth
            onClick={props.onConnect}
            gap="xs"
            bg="tertiaryBg"
            style={{
              borderRadius: radius.md,
              border: `1px solid ${theme.colors.borderColor}`,
              padding: spacing.sm,
            }}
          >
            <Container
              flex="row"
              gap="sm"
              center="y"
              expand
              color="secondaryIconColor"
            >
              <OutlineWalletIcon size={iconSize.md} />
              <Text size="sm" color="primaryText">
                Connect another wallet
              </Text>
            </Container>
          </Button>
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
  const displayedBalances = props.balances;

  return (
    <Container flex="column" gap="sm">
      <Container px="sm">
        <WalletRow {...props} />
      </Container>
      <Container flex="column" gap="sm">
        {props.balances.length > 0 ? (
          displayedBalances.map((b) => (
            <TokenBalanceRow
              client={props.client}
              onClick={() => props.onClick(props.wallet, b.token, b.chain)}
              key={`${b.token.address}-${b.chain.id}`}
              tokenBalance={b}
              wallet={props.wallet}
            />
          ))
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
      <Container flex="row" center="y" gap="md">
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
      </Container>
      <Container flex="row" center="y" gap="3xs" color="secondaryText">
        <Container
          flex="column"
          color="secondaryText"
          gap="3xs"
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text size="xs" color="primaryText">
            {formatTokenBalance(tokenBalance.balance, true, 2)}
          </Text>
          <FiatValue
            tokenAmount={tokenBalance.balance.displayValue}
            token={tokenBalance.token}
            chain={tokenBalance.chain}
            client={client}
            size="xs"
          />
        </Container>
        {/* <ChevronRightIcon width={iconSize.md} height={iconSize.md} /> */}
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
  wallet?: Wallet;
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
    <Container flex="row" style={{ justifyContent: "space-between" }}>
      <Container flex="row" center="y" gap="sm" color="secondaryText">
        {ensAvatarQuery.data ? (
          <Img
            src={ensAvatarQuery.data}
            width={props.iconSize ? iconSize[props.iconSize] : iconSize.md}
            height={props.iconSize ? iconSize[props.iconSize] : iconSize.md}
            style={{
              borderRadius: radius.sm,
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
              borderRadius: radius.sm,
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
    </Container>
  );
}

const StyledButton = /* @__PURE__ */ styled(Button)((_) => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: spacing.sm,
    border: `1px solid ${theme.colors.borderColor}`,
    gap: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
  };
});
