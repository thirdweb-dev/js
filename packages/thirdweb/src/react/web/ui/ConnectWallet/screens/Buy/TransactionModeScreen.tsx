import { trackPayEvent } from "../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { hasSponsoredTransactionsEnabled } from "../../../../../../wallets/smart/is-smart-wallet.js";
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
import { ErrorState } from "../../../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { Img } from "../../../components/Img.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Text } from "../../../components/text.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ConnectButton } from "../../ConnectButton.js";
import { OutlineWalletIcon } from "../../icons/OutlineWalletIcon.js";
import { PoweredByThirdweb } from "../../PoweredByTW.js";
import { formatTokenBalance } from "../formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
  NATIVE_TOKEN,
} from "../nativeToken.js";
import { useTransactionCostAndData } from "./main/useBuyTxStates.js";
import type { SupportedChainAndTokens } from "./swap/useSwapSupportedChains.js";
import { WalletRow } from "./swap/WalletRow.js";

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
    account: payerAccount,
    supportedDestinations,
    transaction: payUiOptions.transaction,
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
      client: props.client,
      tokenAddress: isNativeToken(transactionCostAndData?.token || NATIVE_TOKEN)
        ? undefined
        : transactionCostAndData?.token.address,
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
        center="both"
        flex="row"
        fullHeight
        style={{
          minHeight: "350px",
        }}
      >
        <Container animate="fadein">
          <Spacer y="xxl" />
          <Container center="x" flex="row">
            <OutlineWalletIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="lg" />
          <Text center color="primaryText" size="md">
            Please connect a wallet to continue
          </Text>
          <Spacer y="xl" />
          <Container center="x" flex="row" style={{ width: "100%" }}>
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
        center="both"
        flex="row"
        fullHeight
        style={{
          minHeight: "350px",
        }}
      >
        <ErrorState
          onTryAgain={
            transactionCostAndDataError
              ? transactionCostAndDataRefetch
              : chainDataRefetch
          }
          title={
            transactionCostAndDataError?.message ||
            chainDataError?.message ||
            "Something went wrong"
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
    <Container px="lg">
      <Spacer y="lg" />
      <ModalHeader title={metadata?.name || "Transaction"} />

      <Spacer y="lg" />
      <Container>
        {metadata?.image ? (
          <Img
            client={client}
            src={metadata?.image}
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: spacing.md,
              width: "100%",
            }}
          />
        ) : activeAccount ? (
          <Container flex="column" gap="sm">
            {insufficientFunds && (
              <div>
                <Text center color="danger" multiline size="xs">
                  Insufficient Funds
                </Text>
                <Text center multiline size="xs">
                  Select another token or pay with card.
                </Text>
              </div>
            )}
            <Container
              flex="row"
              style={{
                backgroundColor: theme.colors.tertiaryBg,
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: spacing.md,
                justifyContent: "space-between",
                marginBottom: spacing.sm,
                padding: spacing.sm,
              }}
            >
              <WalletRow
                address={activeAccount?.address}
                client={client}
                iconSize="md"
              />
              {balanceQuery.data ? (
                <Container center="y" flex="row" gap="3xs">
                  <Text color="secondaryText" size="xs" weight={500}>
                    {formatTokenBalance(balanceQuery.data, false)}
                  </Text>
                  <TokenSymbol
                    chain={payUiOptions.transaction.chain}
                    color="secondaryText"
                    size="xs"
                    token={transactionCostAndData.token}
                  />
                </Container>
              ) : (
                <Skeleton height={fontSize.xs} width="70px" />
              )}
            </Container>
          </Container>
        ) : null}
        <Spacer y="md" />
        <Container flex="row">
          <Container expand flex="column">
            <Text color="primaryText" size="md" weight={700}>
              Price
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
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
          <Container expand flex="column">
            <Text color="secondaryText" size="xs">
              Gas Fees
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
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
          <Container expand flex="column">
            <Text color="secondaryText" size="xs">
              Network
            </Text>
          </Container>
          <Container expand>
            <Container
              center="y"
              flex="row"
              gap="xs"
              style={{ justifyContent: "right" }}
            >
              <ChainIcon
                chainIconUrl={chainData.icon?.url}
                client={props.client}
                size="xs"
              />
              <Text
                color="secondaryText"
                size="xs"
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
              amountWei: totalCostWei.toString(),
              client,
              event: "choose_payment_method_transaction_mode",
              toChainId: payUiOptions.transaction.chain.id,
              toToken: transactionCostAndData.token.address,
              walletAddress: payerAccount.address,
              walletType: activeWallet?.id,
            });
            onContinue(
              toTokens(totalCostWei, transactionCostAndData.decimals),
              payUiOptions.transaction.chain,
              transactionCostAndData.token,
            );
          }}
          variant="accent"
        >
          Choose Payment Method
        </Button>
      ) : (
        <div>
          <ConnectButton
            {...props.connectOptions}
            client={client}
            connectButton={{
              style: {
                width: "100%",
              },
            }}
            theme={theme}
          />
        </div>
      )}
      <Spacer y="lg" />
      {payUiOptions.showThirdwebBranding !== false && (
        <>
          <PoweredByThirdweb link="https://playground.thirdweb.com/connect/pay?utm_source=ub_text" />
          <Spacer y="sm" />
        </>
      )}
    </Container>
  );
}
