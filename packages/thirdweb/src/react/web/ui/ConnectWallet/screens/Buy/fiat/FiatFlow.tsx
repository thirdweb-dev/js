import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { OnRampScreen } from "../OnRampScreen.js";
import { FiatStatusScreen } from "./FiatStatusScreen.js";
import { FiatSteps } from "./FiatSteps.js";

// Flow:
// If a Swap is required after doing onramp
// - show the steps ui first
// - then go to KadoScreen
// - then go to status screen: if swap is required,status screen shows swap ui, once done, show success screen

//  If a Swap is not required after doing onramp
// - show Kado screen
// - then go to status screen: once done, show success screen

export function FiatFlow(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  testMode: boolean;
  theme: "light" | "dark";
  onViewPendingTx: () => void;
}) {
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);
  const [screen, setScreen] = useState<"step-1" | "onramp" | "status">(
    hasTwoSteps ? "step-1" : "onramp",
  );

  if (screen === "step-1") {
    return (
      <FiatSteps
        client={props.client}
        onBack={props.onBack}
        quote={props.quote}
        step={1}
        onContinue={() => {
          setScreen("onramp");
        }}
      />
    );
  }

  if (screen === "onramp") {
    return (
      <OnRampScreen
        quote={props.quote}
        onBack={props.onBack}
        testMode={props.testMode}
        onComplete={() => {
          // start polling the onramp status and handle the rest
          setScreen("status");
        }}
        theme={props.theme}
      />
    );
  }

  if (screen === "status") {
    return (
      <FiatStatusScreen
        client={props.client}
        intentId={props.quote.intentId}
        onBack={props.onBack}
        onViewPendingTx={props.onViewPendingTx}
      />
    );
  }

  // never
  return null;
}
