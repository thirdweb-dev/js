import { useState } from "react";
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

// handle states for token and chain selection

export function useUISelectionStates(options: {
  payOptions: PayUIOptions;
  supportedDestinations: SupportedChainAndTokens;
}) {
  const activeChain = useActiveWalletChain();
  const { payOptions, supportedDestinations } = options;

  // buy token amount ---------------------------------------------------------
  // NOTE - for transaction / direct payment modes, the token amount is set when the user tap continue
  const prefillBuy = (payOptions as FundWalletOptions)?.prefillBuy;
  const initialTokenAmount = prefillBuy?.amount || "";

  const [tokenAmount, setTokenAmount] = useState<string>(initialTokenAmount);
  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  // --------------------------------------------------------------------------

  // Destination chain and token selection -----------------------------------
  const [toChain, setToChain] = useState<Chain>(
    // use prefill chain if available
    prefillBuy?.chain ||
      (payOptions.mode === "transaction" && payOptions.transaction?.chain) ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo?.chain) ||
      // use active chain if its supported as destination
      supportedDestinations.find((x) => x.chain.id === activeChain?.id)
        ?.chain ||
      // default to polygon
      polygon,
  );

  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    prefillBuy?.token ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo.token) ||
      NATIVE_TOKEN,
  );
  // --------------------------------------------------------------------------

  // Source token and chain selection ---------------------------------------------------
  const [fromChain, setFromChain] = useState<Chain>(
    // use prefill chain if available
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.chain) ||
      (payOptions.mode === "transaction" && payOptions.transaction?.chain) ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo?.chain) ||
      // default to polygon
      polygon,
  );

  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(
    // use prefill token if available
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.token) ||
      (payOptions.mode === "direct_payment" && payOptions.paymentInfo.token) ||
      // default to native token
      NATIVE_TOKEN,
  );

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
    tokenAmount,
    setTokenAmount,

    toChain,
    setToChain,
    deferredTokenAmount,
    fromChain,
    setFromChain,
    toToken,
    setToToken,
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
