import { IdCardIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import {
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainMetadata } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/useActiveAccount.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../../core/utils/defaultTokens.js";
import { LoadingScreen } from "../../../../../wallets/shared/LoadingScreen.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { OutlineWalletIcon } from "../../../icons/OutlineWalletIcon.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { WalletRowWithBalances } from "../WalletSelectorButton.js";

export type TokenBalance = {
  balance: GetWalletBalanceResult;
  chain: Chain;
  token: TokenInfo;
};

export function PaymentSelectionScreen(props: {
  client: ThirdwebClient;
  mode: PayUIOptions["mode"];
  showAllWallets: boolean;
  sourceSupportedTokens: SupportedTokens | undefined;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  tokenAmount: string;
  wallets: Wallet[] | undefined;
  onSelect: (wallet: Wallet, token: TokenInfo, chain: Chain) => void;
  onSelectFiat: () => void;
  onBack: () => void;
  onConnect: () => void;
  hiddenWallets?: WalletId[];
  payWithFiatEnabled: boolean;
}) {
  const theme = useCustomTheme();
  const connectedWallets = useConnectedWallets();

  // if all wallets are connected and showAll wallets is disabled, hide the connect button
  const hideConnectButton =
    !props.showAllWallets &&
    props.wallets?.every((w) => connectedWallets.includes(w));

  const chainInfo = useChainMetadata(props.toChain);
  const activeAccount = useActiveAccount();

  const walletsAndBalances = useQuery({
    queryKey: [
      "wallets-and-balances",
      connectedWallets.map((w) => w.getAccount()?.address),
      props.sourceSupportedTokens,
      props.toChain.id,
      props.toToken,
      props.tokenAmount,
      props.mode,
      activeAccount?.address,
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

  const filteredWallets = Array.from(walletsAndBalances.data?.entries() || [])
    .filter(([w]) => !props.hiddenWallets?.includes(w.id))
    .filter(([, balances]) => {
      const hasEnoughBalance = balances.some((b) => b.balance.value > 0);
      return hasEnoughBalance;
    });

  return (
    <Container>
      <Container flex="column" gap="xs">
        {filteredWallets.length === 0 && (
          <Container flex="column" gap="xs" py="md">
            <Text size="xs" color="secondaryText" center>
              <i>Insufficient funds in connected wallets</i>
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
        {!hideConnectButton && (
          <Button
            variant="secondary"
            fullWidth
            onClick={props.onConnect}
            gap="xs"
            bg="tertiaryBg"
            style={{
              borderRadius: radius.lg,
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
                Pay with another wallet
              </Text>
            </Container>
          </Button>
        )}
        {props.payWithFiatEnabled && (
          <Button
            variant="secondary"
            fullWidth
            gap="xs"
            bg="tertiaryBg"
            onClick={props.onSelectFiat}
            style={{
              borderRadius: radius.lg,
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
              <IdCardIcon
                style={{
                  width: iconSize.md,
                  height: iconSize.md,
                }}
              />
              <Text size="sm" color="primaryText">
                Pay with credit card
              </Text>
            </Container>
          </Button>
        )}
      </Container>
      <Spacer y="sm" />
    </Container>
  );
}
