import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { FiatStatusScreen } from "./FiatStatusScreen.js";
import { FiatSteps, fiatQuoteToPartialQuote } from "./FiatSteps.js";

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
  openedWindow: Window | null;
}) {
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);
  const [screen, setScreen] = useState<"step-1" | "status">(
    hasTwoSteps ? "step-1" : "status",
  );
  const [popupWindow, setPopupWindow] = useState<Window | null>(
    props.openedWindow,
  );

  if (screen === "step-1") {
    return (
      <FiatSteps
        client={props.client}
        onBack={props.onBack}
        partialQuote={fiatQuoteToPartialQuote(props.quote)}
        step={1}
        onContinue={() => {
          const popup = openOnrampPopup(props.quote.onRampLink, props.theme);
          setPopupWindow(popup);
          setScreen("status");
        }}
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
        hasTwoSteps={hasTwoSteps}
        openedWindow={popupWindow}
        quote={props.quote}
      />
    );
  }

  // never
  return null;
}
