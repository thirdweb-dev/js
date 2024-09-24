import { trackPayEvent } from "../../../../../../analytics/track.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainMetadata } from "../../../../../core/hooks/others/useChainQuery.js";
import { useActiveWallet } from "../../../../../core/hooks/wallets/useActiveWallet.js";
import { hasSponsoredTransactionsEnabled } from "../../../../../core/utils/wallet.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { Img } from "../../../components/Img.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { WalletImage } from "../../../components/WalletImage.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { ConnectButton } from "../../ConnectButton.js";
import type { ERC20OrNativeToken } from "../nativeToken.js";
import { useTransactionCostAndData } from "./main/useBuyTxStates.js";
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
  const { data: chainData } = useChainMetadata(payUiOptions.transaction.chain);
  const metadata = payUiOptions.metadata;
  const { data: transactionCostAndData } = useTransactionCostAndData({
    transaction: payUiOptions.transaction,
    account: payerAccount,
    supportedDestinations,
  });
  const theme = useCustomTheme();
  const activeWallet = useActiveWallet();
  const sponsoredTransactionsEnabled =
    hasSponsoredTransactionsEnabled(activeWallet);

  if (!transactionCostAndData || !chainData) {
    return <LoadingScreen />;
  }

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
              backgroundColor: theme.colors.tertiaryBg,
            }}
          />
        ) : activeWallet ? (
          <Container
            flex="row"
            center="both"
            style={{
              padding: spacing.md,
              marginBottom: spacing.md,
              borderRadius: spacing.md,
              backgroundColor: theme.colors.tertiaryBg,
            }}
          >
            <WalletImage
              size={iconSize.xl}
              id={activeWallet.id}
              client={client}
            />
            <div
              style={{
                flexGrow: 1,
                borderBottom: "6px dotted",
                borderColor: theme.colors.secondaryIconColor,
                marginLeft: spacing.md,
                marginRight: spacing.md,
              }}
            />
            <ChainIcon
              client={client}
              size={iconSize.xl}
              chainIconUrl={chainData.icon?.url}
            />
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
            let totalCostWei = transactionCostAndData.transactionValueWei;
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
