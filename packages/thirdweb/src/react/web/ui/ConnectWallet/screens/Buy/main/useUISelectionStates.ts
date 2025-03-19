import { useEffect, useState } from "react";
import { polygon } from "../../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type {
  FundWalletOptions,
  PayUIOptions,
} from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveWalletChain } from "../../../../../../core/hooks/wallets/useActiveWalletChain.js";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import {
  type CurrencyMeta,
  currencies,
  usdCurrency,
} from "../fiat/currencies.js";
import type { SupportedChainAndTokens } from "../swap/useSwapSupportedChains.js";

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
export function useToTokenSelectionStates(options: {
  payOptions: PayUIOptions;
  supportedDestinations: SupportedChainAndTokens;
}) {
  const { payOptions, supportedDestinations } = options;
  // --------------------------------------------------------------------------
  // buy token amount ---------------------------------------------------------
  // NOTE - for transaction / direct payment modes, the token amount is set when the user tap continue
  const prefillBuy = (payOptions as FundWalletOptions)?.prefillBuy;
  const activeChain = useActiveWalletChain();
  const initialTokenAmount = prefillBuy?.amount || "";
  const [tokenAmount, setTokenAmount] = useState<string>(initialTokenAmount);
  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  useEffect(() => {
    if (prefillBuy?.amount) {
      setTokenAmount(prefillBuy.amount);
    }
    if (prefillBuy?.chain) {
      setToChain(prefillBuy.chain);
    }
    if (prefillBuy?.token) {
      setToToken(prefillBuy.token);
    }
  }, [prefillBuy?.amount, prefillBuy?.chain, prefillBuy?.token]);

  // Destination chain and token selection -----------------------------------
  const [toChain, setToChain] = useState<Chain>(
    // use prefill chain if available
    prefillBuy?.chain ||
      (payOptions.mode === "transaction" && payOptions.transaction?.chain) ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo?.chain) ||
      // use active chain if its supported as destination
      supportedDestinations.find((x) => x.chain.id === activeChain?.id)
        ?.chain ||
      // default to the first chain in supportedDestinations, or polygon if nothing is found at all
      supportedDestinations[0]?.chain ||
      polygon,
  );

  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    prefillBuy?.token ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo.token) ||
      NATIVE_TOKEN,
  );

  return {
    toChain,
    setToChain,
    toToken,
    setToToken,
    tokenAmount,
    setTokenAmount,
    deferredTokenAmount,
  };
}

export function useFromTokenSelectionStates(options: {
  payOptions: PayUIOptions;
  supportedSources: SupportedSourcesInputData[];
}) {
  const { payOptions } = options;

  // TODO (pay) - auto select token based on connected wallet balances

  // Source token and chain selection ---------------------------------------------------
  const [fromChain_, setFromChain] = useState<Chain>();

  // use prefill chain if available
  const fromChainDevSpecified =
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.chain) ||
    (payOptions.mode === "transaction" && payOptions.transaction?.chain) ||
    (payOptions.mode === "direct_payment" && payOptions.paymentInfo?.chain);

  const fromChain = fromChain_ || fromChainDevSpecified || undefined;

  const [fromToken_, setFromToken] = useState<ERC20OrNativeToken>();

  // use prefill token if available
  const fromTokenDevSpecified =
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.token) ||
    (payOptions.mode === "direct_payment" && payOptions.paymentInfo.token);

  // supported tokens query in here
  const fromToken = fromToken_ || fromTokenDevSpecified || undefined;

  return {
    fromChain,
    setFromChain,
    fromToken,
    setFromToken,
  };
}

export function useFiatCurrencySelectionStates(options: {
  payOptions: PayUIOptions;
}) {
  const { payOptions } = options;

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

    // australia
    if (timeZone.includes("australia")) {
      return "AUD";
    }

    // new zealand
    if (timeZone.includes("new zealand")) {
      return "NZD";
    }

    return "USD";
  } catch {
    return "USD";
  }
}
