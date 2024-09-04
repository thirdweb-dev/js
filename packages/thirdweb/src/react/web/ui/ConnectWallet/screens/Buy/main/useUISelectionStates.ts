import { useState } from "react";
import { polygon } from "../../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import {
  type CurrencyMeta,
  currencies,
  usdCurrency,
} from "../fiat/currencies.js";

type SupportedSourcesInputData = {
  chain: Chain;
  tokens: {
    address: string;
    buyWithCryptoEnabled: boolean;
    buyWithFiatEnabled: boolean;
    name: string;
    symbol: string;
  }[];
};

// handle states for token and chain selection
export function useUISelectionStates(options: {
  payOptions: PayUIOptions;
  supportedSources: SupportedSourcesInputData[];
}) {
  const { payOptions, supportedSources } = options;

  // --------------------------------------------------------------------------
  const firstSupportedSource = supportedSources?.length
    ? supportedSources[0]
    : undefined;

  // Source token and chain selection ---------------------------------------------------
  const [fromChain_, setFromChain] = useState<Chain>();

  // use prefill chain if available
  const fromChainDefault =
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.chain) ||
    (payOptions.mode === "transaction" && payOptions.transaction?.chain) ||
    (payOptions.mode === "direct_payment" && payOptions.paymentInfo?.chain) ||
    // default to polygon
    polygon;

  const fromChainFromApi = firstSupportedSource?.chain
    ? firstSupportedSource.chain
    : undefined;

  const fromChain = fromChain_ || fromChainFromApi || fromChainDefault;

  const [fromToken_, setFromToken] = useState<ERC20OrNativeToken>();

  // use prefill token if available
  const fromTokenDefault =
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.token) ||
    (payOptions.mode === "direct_payment" && payOptions.paymentInfo.token) ||
    // default to native token
    NATIVE_TOKEN;

  const fromTokenFromApi = firstSupportedSource?.chain
    ? ({ nativeToken: true } as ERC20OrNativeToken)
    : undefined;

  // supported tokens query in here
  const fromToken = fromToken_ || fromTokenFromApi || fromTokenDefault;

  // --------------------------------------------------------------------------
  const devSpecifiedDefaultCurrency =
    payOptions.buyWithFiat !== false
      ? payOptions.buyWithFiat?.prefillSource?.currency
      : undefined;

  const defaultSelectedCurrencyShorthand =
    devSpecifiedDefaultCurrency || getDefaultCurrencyBasedOnLocation();

  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find((x) => x.shorthand === defaultSelectedCurrencyShorthand) ||
      usdCurrency,
  );

  return {
    fromChain,
    setFromChain,
    fromToken,
    setFromToken,
    selectedCurrency,
    setSelectedCurrency,
  };
}

function getDefaultCurrencyBasedOnLocation(): CurrencyMeta["shorthand"] {
  // if Intl is not supported - browser throws
  try {
    const timeZone = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.toLowerCase();

    // Europe/London -> GBP
    if (timeZone.includes("london")) {
      return "GBP";
    }

    // Europe/* -> EUR
    if (timeZone.includes("europe")) {
      return "EUR";
    }

    // Japan
    if (timeZone.includes("japan")) {
      return "JPY";
    }

    // canada
    if (timeZone.includes("canada")) {
      return "CAD";
    }

    return "USD";
  } catch {
    return "USD";
  }
}
