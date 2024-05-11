import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { type BuyWithFiatPartialQuote, FiatSteps } from "./FiatSteps.js";
import { PostOnRampSwap } from "./PostOnRampSwap.js";

// Note: It is necessary to lock in the fiat-status in state and only pass that to <PostOnRampSwap /> so it does not suddenly change during the swap process.

/**
 * - Show 2 steps UI with step 2 highlighted, on continue button click:
 * - Show swap flow
 */
export function PostOnRampSwapFlow(props: {
  status: BuyWithFiatStatus;
  quote: BuyWithFiatPartialQuote;
  client: ThirdwebClient;
  onBack: () => void;
  onViewPendingTx: () => void;
  onDone: () => void;
  onSwapFlowStarted: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
}) {
  const [statusForSwap, setStatusForSwap] = useState<
    BuyWithFiatStatus | undefined
  >();

  // step 2 flow
  if (statusForSwap) {
    return (
      <PostOnRampSwap
        buyWithFiatStatus={statusForSwap}
        client={props.client}
        onViewPendingTx={props.onViewPendingTx}
        onDone={props.onDone}
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
      />
    );
  }

  // show step 1 and step 2 details
  return (
    <FiatSteps
      client={props.client}
      onBack={props.onBack}
      partialQuote={props.quote}
      step={2}
      onContinue={() => {
        props.onSwapFlowStarted();
        setStatusForSwap(props.status);
      }}
      status={props.status}
    />
  );
}
