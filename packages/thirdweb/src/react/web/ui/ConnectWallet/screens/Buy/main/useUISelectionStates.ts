import { useState } from "react";
import { polygon } from "../../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../../chains/types.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../../utils/units.js";
import { useActiveWalletChain } from "../../../../../hooks/wallets/useActiveWalletChain.js";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue.js";
import type { PayUIOptions } from "../../../ConnectButtonProps.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { defaultSelectedCurrency } from "../fiat/currencies.js";
import type { SupportedChainAndTokens } from "../swap/useSwapSupportedChains.js";
import type { BuyForTx } from "./types.js";

// handle states for token and chain selection

export function useUISelectionStates(options: {
  payOptions: PayUIOptions;
  buyForTx?: BuyForTx;
  supportedDestinations: SupportedChainAndTokens;
}) {
  const activeChain = useActiveWalletChain();
  const { payOptions, buyForTx, supportedDestinations } = options;

  // buy token amount ---------------------------------------------------------
  const initialTokenAmount =
    payOptions.prefillBuy?.amount ||
    (buyForTx
      ? String(
          formatNumber(Number(toEther(buyForTx.cost - buyForTx.balance)), 4),
        )
      : "");

  const [tokenAmount, setTokenAmount] = useState<string>(initialTokenAmount);
  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  // --------------------------------------------------------------------------

  // Destination chain and token selection -----------------------------------
  const [toChain, setToChain] = useState<Chain>(
    // use prefill chain if available
    payOptions.prefillBuy?.chain ||
      // use buyForTx chain if available
      buyForTx?.tx.chain ||
      // use active chain if its supported as destination
      supportedDestinations.find((x) => x.chain.id === activeChain?.id)
        ?.chain ||
      // default to polygon
      polygon,
  );

  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    payOptions.prefillBuy?.token || NATIVE_TOKEN,
  );
  // --------------------------------------------------------------------------

  // Source token and chain selection ---------------------------------------------------
  const [fromChain, setFromChain] = useState<Chain>(
    // use prefill chain if available
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.chain) ||
      // default to polygon
      polygon,
  );

  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(
    // use prefill token if available
    (payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.token) ||
      // default to native token
      NATIVE_TOKEN,
  );

  // --------------------------------------------------------------------------

  // stripe only supports USD, so not using a state right now
  const [selectedCurrency, setSelectedCurrency] = useState(
    defaultSelectedCurrency,
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
