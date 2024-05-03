import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatStatus } from "../../../../../../../exports/pay.js";
import { type BuyWithFiatPartialQuote, FiatSteps } from "./FiatSteps.js";
import { PostOnRampSwap } from "./PostOnRampSwap.js";

// Note: It is necessary to lock in the fiat-status in state and only pass that to <PostOnRampSwap /> so it does not suddenly change during the swap process.

export function PostOnRampSwapFlow(props: {
  status: BuyWithFiatStatus;
  quote: BuyWithFiatPartialQuote;
  client: ThirdwebClient;
  onBack: () => void;
  onViewPendingTx: () => void;
  closeModal: () => void;
  onSwapFlowStarted: () => void;
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
        onBack={() => {
          setStatusForSwap(undefined);
        }}
        onViewPendingTx={props.onViewPendingTx}
        closeModal={props.closeModal}
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
