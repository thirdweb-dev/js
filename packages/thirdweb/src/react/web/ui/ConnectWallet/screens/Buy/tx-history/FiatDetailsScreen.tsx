import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type {
  BuyWithFiatStatus,
  ValidBuyWithFiatStatus,
} from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { OnRampTxDetailsTable } from "../fiat/FiatTxDetailsTable.js";
import { PostOnRampSwapFlow } from "../fiat/PostOnRampSwapFlow.js";
import { getBuyWithFiatStatusMeta } from "./statusMeta.js";

export function FiatDetailsScreen(props: {
  status: ValidBuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
}) {
  const initialStatus = props.status;
  const [stopPolling, setStopPolling] = useState(false);

  const statusQuery = useBuyWithFiatStatus(
    stopPolling
      ? undefined
      : {
          client: props.client,
          intentId: initialStatus.intentId,
        },
  );

  const status: ValidBuyWithFiatStatus =
    (statusQuery.data?.status === "NOT_FOUND" ? undefined : statusQuery.data) ||
    initialStatus;

  const hasTwoSteps = isSwapRequiredAfterOnRamp(status);
  const statusMeta = getBuyWithFiatStatusMeta(status);

  if (hasTwoSteps) {
    const fiatQuote = status.quote;
    return (
      <PostOnRampSwapFlow
        client={props.client}
        status={status}
        onBack={props.onBack}
        onViewPendingTx={props.onBack}
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
        quote={{
          fromCurrencyAmount: fiatQuote.fromCurrencyWithFees.amount,
          fromCurrencySymbol: fiatQuote.fromCurrencyWithFees.currencySymbol,
          onRampTokenAmount: fiatQuote.estimatedOnRampAmount,
          toTokenAmount: fiatQuote.estimatedToTokenAmount,
          onRampToken: {
            chainId: fiatQuote.onRampToken.chainId,
            tokenAddress: fiatQuote.onRampToken.tokenAddress,
            name: fiatQuote.onRampToken.name,
            symbol: fiatQuote.onRampToken.symbol,
          },
          toToken: {
            chainId: fiatQuote.toToken.chainId,
            tokenAddress: fiatQuote.toToken.tokenAddress,
            name: fiatQuote.toToken.name,
            symbol: fiatQuote.toToken.symbol,
          },
        }}
        onDone={props.onDone}
        onSwapFlowStarted={() => {
          setStopPolling(true);
        }}
      />
    );
  }

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Transaction Details" onBack={props.onBack} />
      </Container>

      <Line />

      <Container p="lg">
        <OnRampTxDetailsTable
          client={props.client}
          token={
            status.source
              ? {
                  chainId: status.source.token.chainId,
                  address: status.source.token.tokenAddress,
                  symbol: status.source.token.symbol || "",
                  amount: status.source.amount,
                }
              : {
                  address: status.quote.onRampToken.tokenAddress,
                  amount: status.quote.estimatedOnRampAmount,
                  chainId: status.quote.onRampToken.chainId,
                  symbol: status.quote.onRampToken.symbol || "",
                }
          }
          fiat={{
            amount: status.quote.fromCurrencyWithFees.amount,
            currencySymbol: status.quote.fromCurrencyWithFees.currencySymbol,
          }}
          statusMeta={{
            color: statusMeta.color,
            text: statusMeta.status,
            txHash: status.source?.transactionHash,
          }}
        />
      </Container>
    </Container>
  );
}

// if the toToken is the same as the onRampToken, no swap is required
export function isSwapRequiredAfterOnRamp(
  buyWithFiatStatus: BuyWithFiatStatus,
) {
  if (buyWithFiatStatus.status === "NOT_FOUND") {
    return false;
  }

  const sameChain =
    buyWithFiatStatus.quote.toToken.chainId ===
    buyWithFiatStatus.quote.onRampToken.chainId;

  const sameToken =
    buyWithFiatStatus.quote.toToken.tokenAddress ===
    buyWithFiatStatus.quote.onRampToken.tokenAddress;

  return !(sameChain && sameToken);
}
