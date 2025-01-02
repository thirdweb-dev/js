import { useCallback, useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import {
  type BuyWithFiatStatus,
  getBuyWithFiatStatus,
} from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import type { PayerInfo } from "../types.js";
import { OnrampStatusScreen } from "./FiatStatusScreen.js";
import { FiatSteps, fiatQuoteToPartialQuote } from "./FiatSteps.js";
import { PostOnRampSwapFlow } from "./PostOnRampSwapFlow.js";

// 2 possible flows

// If a Swap is required after doing onramp
// 1. show the 2 steps ui with step 1 highlighted, on continue button click:
// 2. open provider window, show onramp status screen, on onramp success:
// 3. show the 2 steps ui with step 2 highlighted, on continue button click:
// 4. show swap flow

//  If a Swap is not required after doing onramp
//  - window will already be opened before this component is mounted and `openedWindow` prop will be set, show onramp status screen

type Screen =
  | {
      id: "step-1";
    }
  | {
      id: "onramp-status";
    }
  | {
      id: "postonramp-swap";
      data: BuyWithFiatStatus;
    }
  | {
      id: "step-2";
    };

export function FiatFlow(props: {
  title: string;
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  testMode: boolean;
  theme: "light" | "dark";
  openedWindow: Window | null;
  onDone: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  payer: PayerInfo;
  onSuccess: (status: BuyWithFiatStatus) => void;
}) {
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);
  const [screen, setScreen] = useState<Screen>(
    hasTwoSteps
      ? {
          id: "step-1",
        }
      : {
          id: "onramp-status",
        },
  );

  const [popupWindow, setPopupWindow] = useState<Window | null>(
    props.openedWindow,
  );

  const onPostOnrampSuccess = useCallback(() => {
    // report the status of fiat status instead of post onramp swap status when post onramp swap is successful
    getBuyWithFiatStatus({
      intentId: props.quote.intentId,
      client: props.client,
    }).then((status) => {
      props.onSuccess(status);
    });
  }, [props.onSuccess, props.quote.intentId, props.client]);

  if (screen.id === "step-1") {
    return (
      <FiatSteps
        title={props.title}
        client={props.client}
        onBack={props.onBack}
        partialQuote={fiatQuoteToPartialQuote(props.quote)}
        step={1}
        onContinue={() => {
          const popup = openOnrampPopup(props.quote.onRampLink, props.theme);
          trackPayEvent({
            event: "open_onramp_popup",
            client: props.client,
            walletAddress: props.payer.account.address,
            walletType: props.payer.wallet.id,
          });
          addPendingTx({
            type: "fiat",
            intentId: props.quote.intentId,
          });
          setPopupWindow(popup);
          setScreen({ id: "onramp-status" });
        }}
      />
    );
  }

  if (screen.id === "onramp-status") {
    return (
      <OnrampStatusScreen
        title={props.title}
        client={props.client}
        intentId={props.quote.intentId}
        onBack={props.onBack}
        hasTwoSteps={hasTwoSteps}
        openedWindow={popupWindow}
        quote={props.quote}
        onDone={props.onDone}
        onShowSwapFlow={(_status) => {
          setScreen({ id: "postonramp-swap", data: _status });
        }}
        transactionMode={props.transactionMode}
        isEmbed={props.isEmbed}
        onSuccess={props.onSuccess}
      />
    );
  }

  if (screen.id === "postonramp-swap") {
    return (
      <PostOnRampSwapFlow
        title={props.title}
        status={screen.data}
        quote={fiatQuoteToPartialQuote(props.quote)}
        client={props.client}
        onBack={props.onBack}
        onDone={props.onDone}
        onSwapFlowStarted={() => {
          // no op
        }}
        transactionMode={props.transactionMode}
        isEmbed={props.isEmbed}
        payer={props.payer}
        onSuccess={onPostOnrampSuccess}
      />
    );
  }

  // never
  return null;
}
