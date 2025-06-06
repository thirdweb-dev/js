import type { Token } from "../../../../../bridge/index.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../core/design-system/index.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import { getFiatCurrencyIcon } from "../../ConnectWallet/screens/Buy/fiat/currencies.js";
import { FiatValue } from "../../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { StepConnectorArrow } from "../../ConnectWallet/screens/Buy/swap/StepConnector.js";
import { WalletRow } from "../../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { Container } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import type { UIOptions } from "../BridgeOrchestrator.js";
import { TokenBalanceRow } from "../common/TokenBalanceRow.js";

export function PaymentOverview(props: {
  uiOptions: UIOptions;
  receiver: string;
  sender?: string;
  client: ThirdwebClient;
  paymentMethod: PaymentMethod;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}) {
  const theme = useCustomTheme();
  const sender =
    props.sender ||
    (props.paymentMethod.type === "wallet"
      ? props.paymentMethod.payerWallet.getAccount()?.address
      : undefined);
  const isDifferentRecipient =
    props.receiver.toLowerCase() !== sender?.toLowerCase();
  return (
    <Container>
      {/* Sell */}
      <Container
        bg="tertiaryBg"
        flex="column"
        style={{
          borderRadius: radius.lg,
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        {sender && (
          <Container
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            style={{
              borderBottom: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <WalletRow
              address={sender}
              client={props.client}
              iconSize="md"
              textSize="sm"
            />
          </Container>
        )}
        {props.paymentMethod.type === "wallet" && (
          <TokenBalanceRow
            token={props.paymentMethod.originToken}
            client={props.client}
            amount={props.fromAmount}
            onClick={() => {}}
            style={{
              background: "transparent",
              borderRadius: 0,
              border: "none",
            }}
          />
        )}
        {props.paymentMethod.type === "fiat" && (
          <Container
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            center="y"
            style={{ justifyContent: "space-between" }}
          >
            <Container flex="row" gap="sm" center="y">
              {getFiatCurrencyIcon({
                currency: props.paymentMethod.currency,
                size: "lg",
              })}
              <Container flex="column" gap="3xs" center="y">
                <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
                  {props.paymentMethod.currency}
                </Text>
                <Text size="xs" color="secondaryText">
                  {props.paymentMethod.onramp.charAt(0).toUpperCase() +
                    props.paymentMethod.onramp.slice(1)}
                </Text>
              </Container>
            </Container>
            <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
              {props.fromAmount}
            </Text>
          </Container>
        )}
      </Container>
      {/* Connector Icon */}
      <StepConnectorArrow />
      {/* Buy */}
      <Container
        flex="column"
        bg="tertiaryBg"
        style={{
          borderRadius: radius.lg,
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        {isDifferentRecipient && (
          <Container
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            style={{
              borderBottom: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <WalletRow
              address={props.receiver}
              client={props.client}
              iconSize="md"
              textSize="sm"
            />
          </Container>
        )}
        {props.uiOptions.mode === "direct_payment" && (
          <Container
            flex="row"
            gap="sm"
            p="md"
            center="y"
            style={{ justifyContent: "space-between" }}
          >
            <Container flex="column" gap="3xs" center="y" style={{ flex: 1 }}>
              <Text size="sm" color="primaryText" style={{ fontWeight: 600 }}>
                {props.uiOptions.metadata?.title || "Payment"}
              </Text>
              {props.uiOptions.metadata?.description && (
                <Text size="xs" color="secondaryText">
                  {props.uiOptions.metadata.description}
                </Text>
              )}
            </Container>
            <Container
              flex="column"
              gap="3xs"
              center="y"
              style={{ alignItems: "flex-end" }}
            >
              <FiatValue
                tokenAmount={props.uiOptions.paymentInfo.amount}
                token={props.toToken}
                client={props.client}
                chain={defineChain(props.toToken.chainId)}
                weight={600}
                color="primaryText"
                size="sm"
              />
              <Text size="xs" color="secondaryText">
                {props.uiOptions.paymentInfo.amount} {props.toToken.symbol}
              </Text>
            </Container>
          </Container>
        )}
        {props.uiOptions.mode === "fund_wallet" && (
          <TokenBalanceRow
            token={props.toToken}
            client={props.client}
            amount={props.toAmount}
            onClick={() => {}}
            style={{
              background: "transparent",
              borderRadius: 0,
              border: "none",
            }}
          />
        )}
      </Container>
    </Container>
  );
}
