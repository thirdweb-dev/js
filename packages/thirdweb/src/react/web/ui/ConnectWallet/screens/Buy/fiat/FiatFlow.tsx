import { useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type {
  BuyWithFiatQuote,
  BuyWithFiatStatus,
} from "../../../../../../../exports/pay.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import { FiatStatusScreen } from "./FiatStatusScreen.js";
import { FiatSteps, fiatQuoteToPartialQuote } from "./FiatSteps.js";
import { PostOnRampSwapFlow } from "./PostOnRampSwapFlow.js";

// Flow:
// If a Swap is required after doing onramp
// - show the steps ui first
// - then go to KadoScreen
// - then go to status screen: if swap is required,status screen shows swap ui, once done, show success screen

//  If a Swap is not required after doing onramp
// - show Kado screen
// - then go to status screen: once done, show success screen

type Screen =
  | {
      id: "step-1";
    }
  | {
      id: "fiat-status";
    }
  | {
      id: "postonramp-swap";
      data: BuyWithFiatStatus;
    }
  | {
      id: "step-2";
    };

export function FiatFlow(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  testMode: boolean;
  theme: "light" | "dark";
  onViewPendingTx: () => void;
  openedWindow: Window | null;
  onDone: () => void;
  isBuyForTx: boolean;
}) {
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);
  const [screen, setScreen] = useState<Screen>(
    hasTwoSteps
      ? {
          id: "step-1",
        }
      : {
          id: "fiat-status",
        },
  );

  const [popupWindow, setPopupWindow] = useState<Window | null>(
    props.openedWindow,
  );

  // 1.
  if (screen.id === "step-1") {
    return (
      <FiatSteps
        client={props.client}
        onBack={props.onBack}
        partialQuote={fiatQuoteToPartialQuote(props.quote)}
        step={1}
        onContinue={() => {
          const popup = openOnrampPopup(props.quote.onRampLink, props.theme);
          addPendingTx({
            type: "fiat",
            intentId: props.quote.intentId,
          });
          setPopupWindow(popup);
          setScreen({ id: "fiat-status" });
        }}
      />
    );
  }

  // 2.
  if (screen.id === "fiat-status") {
    return (
      <FiatStatusScreen
        client={props.client}
        intentId={props.quote.intentId}
        onBack={props.onBack}
        onViewPendingTx={props.onViewPendingTx}
        hasTwoSteps={hasTwoSteps}
        openedWindow={popupWindow}
        quote={props.quote}
        onDone={props.onDone}
        onShowSwapFlow={(_status) => {
          // go to 3.
          setScreen({ id: "postonramp-swap", data: _status });
        }}
        isBuyForTx={props.isBuyForTx}
      />
    );
  }

  // 3.
  if (screen.id === "postonramp-swap") {
    return (
      <PostOnRampSwapFlow
        status={screen.data}
        quote={fiatQuoteToPartialQuote(props.quote)}
        client={props.client}
        onBack={props.onBack}
        onViewPendingTx={props.onViewPendingTx}
        onDone={props.onDone}
        onSwapFlowStarted={() => {
          // no op
        }}
        isBuyForTx={props.isBuyForTx}
      />
    );
  }

  // never
  return null;
}
