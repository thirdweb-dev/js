import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../../../exports/pay.js";
import { useBuyWithFiatStatus } from "../../../../../../../exports/react.js";
import type { ValidBuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { FiatTxDetailsTable } from "../fiat/FiatTxDetailsTable.js";
import { PostOnRampSwapFlow } from "../fiat/PostOnRampSwapFlow.js";

export function FiatDetailsScreen(props: {
  status: ValidBuyWithFiatStatus;
  onBack: () => void;
  client: ThirdwebClient;
  onDone: () => void;
  isBuyForTx: boolean;
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

  if (hasTwoSteps) {
    const fiatQuote = status.quote;
    return (
      <PostOnRampSwapFlow
        client={props.client}
        status={status}
        onBack={props.onBack}
        onViewPendingTx={props.onBack}
        isBuyForTx={props.isBuyForTx}
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
        <FiatTxDetailsTable status={status} client={props.client} />
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
