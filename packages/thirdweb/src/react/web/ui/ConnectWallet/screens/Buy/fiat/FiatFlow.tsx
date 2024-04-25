import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithFiatQuote } from "../../../../../../../exports/pay.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { KadoScreen } from "../KadoScreen.js";
import { FiatStatusScreen } from "./FiatStatusScreen.js";
import { FiatSteps } from "./FiatSteps.js";
import type { CurrencyMeta } from "./currencies.js";

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
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  client: ThirdwebClient;
  toTokenAmount: string;
  currency: CurrencyMeta;
  testMode: boolean;
  theme: "light" | "dark";
  onViewPendingTx: () => void;
}) {
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);
  const [step, setStep] = useState(1);
  const [screen, setScreen] = useState<"steps" | "kado" | "status">(
    hasTwoSteps ? "steps" : "kado",
  );

  if (screen === "steps") {
    return (
      <FiatSteps
        {...props}
        step={step}
        onContinue={() => {
          if (hasTwoSteps) {
            if (step === 1) {
              setScreen("kado");
            } else {
              setScreen("status");
            }
          } else {
            setScreen("status");
          }
        }}
      />
    );
  }

  if (screen === "kado") {
    return (
      <KadoScreen
        quote={props.quote}
        onBack={props.onBack}
        testMode={props.testMode}
        onComplete={() => {
          setScreen("status");
          if (hasTwoSteps) {
            setStep(2);
          }
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
