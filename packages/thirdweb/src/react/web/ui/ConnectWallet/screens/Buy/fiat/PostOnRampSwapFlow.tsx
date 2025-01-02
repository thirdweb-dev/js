import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import type { PayerInfo } from "../types.js";
import { type BuyWithFiatPartialQuote, FiatSteps } from "./FiatSteps.js";
import { PostOnRampSwap } from "./PostOnRampSwap.js";

// Note: It is necessary to lock in the fiat-status in state and only pass that to <PostOnRampSwap /> so it does not suddenly change during the swap process.

/**
 * - Show 2 steps UI with step 2 highlighted, on continue button click:
 * - Show swap flow
 */
export function PostOnRampSwapFlow(props: {
  title: string;
  status: BuyWithFiatStatus;
  quote: BuyWithFiatPartialQuote;
  client: ThirdwebClient;
  onBack: () => void;
  onDone: () => void;
  onSwapFlowStarted: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  payer: PayerInfo;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
}) {
  const [statusForSwap, setStatusForSwap] = useState<
    BuyWithFiatStatus | undefined
  >();

  // step 2 flow
  if (statusForSwap) {
    return (
      <PostOnRampSwap
        title={props.title}
        buyWithFiatStatus={statusForSwap}
        client={props.client}
        onDone={props.onDone}
        transactionMode={props.transactionMode}
        isEmbed={props.isEmbed}
        payer={props.payer}
        onSuccess={props.onSuccess}
      />
    );
  }

  // show step 1 and step 2 details
  return (
    <FiatSteps
      title={props.title}
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
