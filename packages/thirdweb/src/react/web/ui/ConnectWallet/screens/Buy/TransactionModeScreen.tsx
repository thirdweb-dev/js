import { trackPayEvent } from "../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainMetadata } from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../../core/hooks/wallets/useActiveWallet.js";
import { hasSponsoredTransactionsEnabled } from "../../../../../core/utils/wallet.js";
import { ErrorState } from "../../../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { Img } from "../../../components/Img.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import { ConnectButton } from "../../ConnectButton.js";
import { OutlineWalletIcon } from "../../icons/OutlineWalletIcon.js";
import { formatTokenBalance } from "../formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "../nativeToken.js";
import { useTransactionCostAndData } from "./main/useBuyTxStates.js";
import { WalletRow } from "./swap/WalletRow.js";
import type { SupportedChainAndTokens } from "./swap/useSwapSupportedChains.js";

export function TransactionModeScreen(props: {
  client: ThirdwebClient;
  payUiOptions: Extract<PayUIOptions, { mode: "transaction" }>;
  supportedDestinations: SupportedChainAndTokens;
  payerAccount: Account | undefined;
  connectOptions: PayEmbedConnectOptions | undefined;
  onContinue: (
    tokenAmount: string,
    toChain: Chain,
    toToken: ERC20OrNativeToken,
  ) => void;
}) {
  const {
    payUiOptions,
    client,
    payerAccount,
    supportedDestinations,
    onContinue,
  } = props;
  const {
    data: chainData,
    error: chainDataError,
    isLoading: chainDataLoading,
    refetch: chainDataRefetch,
  } = useChainMetadata(payUiOptions.transaction.chain);
  const metadata = payUiOptions.metadata;
  const {
    data: transactionCostAndData,
    error: transactionCostAndDataError,
    isLoading: transactionCostAndDataLoading,
    refetch: transactionCostAndDataRefetch,
  } = useTransactionCostAndData({
    transaction: payUiOptions.transaction,
    account: payerAccount,
    supportedDestinations,
  });
  const theme = useCustomTheme();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const sponsoredTransactionsEnabled =
    hasSponsoredTransactionsEnabled(activeWallet);
  const balanceQuery = useWalletBalance(
    {
      address: activeAccount?.address,
      chain: payUiOptions.transaction.chain,
      tokenAddress: isNativeToken(transactionCostAndData?.token || NATIVE_TOKEN)
        ? undefined
        : transactionCostAndData?.token.address,
      client: props.client,
    },
    {
      enabled: !!transactionCostAndData,
    },
  );

  if (transactionCostAndDataLoading || chainDataLoading) {
    return <LoadingScreen />;
  }

  if (!activeAccount) {
    return (
      <Container
        style={{
          minHeight: "350px",
        }}
        fullHeight
        flex="row"
        center="both"
      >
        <Container animate="fadein">
          <Spacer y="xxl" />
          <Container flex="row" center="x">
            <OutlineWalletIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="lg" />
          <Text center color="primaryText" size="md">
            Please connect a wallet to continue
          </Text>
          <Spacer y="xl" />
          <Container flex="row" center="x" style={{ width: "100%" }}>
            <ConnectButton
              client={client}
              theme={theme}
              {...props.connectOptions}
            />
          </Container>
        </Container>
      </Container>
    );
  }

  if (transactionCostAndDataError || chainDataError) {
    return (
      <Container
        style={{
          minHeight: "350px",
        }}
        fullHeight
        flex="row"
        center="both"
      >
        <ErrorState
          title={
            transactionCostAndDataError?.message ||
            chainDataError?.message ||
            "Something went wrong"
          }
          onTryAgain={
            transactionCostAndDataError
              ? transactionCostAndDataRefetch
              : chainDataRefetch
          }
        />
      </Container>
    );
  }

  if (!transactionCostAndData || !chainData) {
    return <LoadingScreen />;
  }

  const insufficientFunds =
    balanceQuery.data &&
    balanceQuery.data.value < transactionCostAndData.transactionValueWei;

  return (
    <Container p="lg">
      <ModalHeader title={metadata?.name || "Transaction"} />

      <Spacer y="lg" />
      <Container>
        {metadata?.image ? (
          <Img
            client={client}
            src={metadata?.image}
            style={{
              width: "100%",
              borderRadius: spacing.md,
              border: `1px solid ${theme.colors.borderColor}`,
              backgroundColor: theme.colors.tertiaryBg,
            }}
          />
        ) : activeAccount ? (
          <Container flex="column" gap="sm">
            {insufficientFunds && (
              <Text size="sm" color="danger" style={{ textAlign: "center" }}>
                Insufficient funds
              </Text>
            )}
            <Container
              flex="row"
              style={{
                justifyContent: "space-between",
                padding: spacing.sm,
                marginBottom: spacing.sm,
                borderRadius: spacing.md,
                backgroundColor: theme.colors.tertiaryBg,
                border: `1px solid ${theme.colors.borderColor}`,
              }}
            >
              <WalletRow
                address={activeAccount?.address}
                iconSize="md"
                client={client}
              />
              {balanceQuery.data ? (
                <Container flex="row" gap="3xs" center="y">
                  <Text size="xs" color="secondaryText" weight={500}>
                    {formatTokenBalance(balanceQuery.data, false)}
                  </Text>
                  <TokenSymbol
                    token={transactionCostAndData.token}
                    chain={payUiOptions.transaction.chain}
                    size="xs"
                    color="secondaryText"
                  />
                </Container>
              ) : (
                <Skeleton width="70px" height={fontSize.xs} />
              )}
            </Container>
          </Container>
        ) : null}
        <Spacer y="md" />
        <Container flex="row">
          <Container flex="column" expand>
            <Text size="md" color="primaryText" weight={700}>
              Price
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{ justifyContent: "right" }}
            >
              <TokenIcon
                chain={payUiOptions.transaction.chain}
                client={props.client}
                size="sm"
                token={transactionCostAndData.token}
              />
              <Text color="primaryText" size="md" weight={700}>
                {String(
                  formatNumber(
                    Number(
                      toTokens(
                        transactionCostAndData.transactionValueWei,
                        transactionCostAndData.decimals,
                      ),
                    ),
                    6,
                  ),
                )}{" "}
                {transactionCostAndData.token.symbol}
              </Text>
            </Container>
          </Container>
        </Container>
        <Spacer y="md" />
        <Line />
        <Spacer y="md" />
        <Container flex="row">
          <Container flex="column" expand>
            <Text size="xs" color="secondaryText">
              Gas Fees
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{ justifyContent: "right" }}
            >
              <Text
                color={sponsoredTransactionsEnabled ? "success" : "primaryText"}
                size="xs"
              >
                {sponsoredTransactionsEnabled
                  ? "Sponsored"
                  : `${String(
                      formatNumber(
                        Number(
                          toTokens(
                            transactionCostAndData.gasCostWei,
                            chainData.nativeCurrency.decimals,
                          ),
                        ),
                        6,
                      ),
                    )} ${chainData.nativeCurrency.symbol}`}
              </Text>
            </Container>
          </Container>
        </Container>
        <Spacer y="sm" />
        <Container flex="row">
          <Container flex="column" expand>
            <Text size="xs" color="secondaryText">
              Network
            </Text>
          </Container>
          <Container expand>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{ justifyContent: "right" }}
            >
              <ChainIcon
                chainIconUrl={chainData.icon?.url}
                size="xs"
                client={props.client}
              />
              <Text
                size="xs"
                color="secondaryText"
                style={{ textAlign: "right" }}
              >
                {chainData.name}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
      <Spacer y="xl" />
      {payerAccount ? (
        <Button
          variant="accent"
          fullWidth
          onClick={() => {
            let totalCostWei = insufficientFunds
              ? transactionCostAndData.transactionValueWei -
                (balanceQuery.data?.value || 0n)
              : transactionCostAndData.transactionValueWei;
            if (
              transactionCostAndData.token.address === NATIVE_TOKEN_ADDRESS &&
              !sponsoredTransactionsEnabled
            ) {
              totalCostWei += transactionCostAndData.gasCostWei;
            }
            trackPayEvent({
              event: "choose_payment_method_transaction_mode",
              client,
              walletAddress: payerAccount.address,
              walletType: activeWallet?.id,
            });
            onContinue(
              toTokens(totalCostWei, transactionCostAndData.decimals),
              payUiOptions.transaction.chain,
              transactionCostAndData.token,
            );
          }}
        >
          Choose Payment Method
        </Button>
      ) : (
        <div>
          <ConnectButton
            {...props.connectOptions}
            client={client}
            theme={theme}
            connectButton={{
              style: {
                width: "100%",
              },
            }}
          />
        </div>
      )}
    </Container>
  );
}
