import { useMemo, useState } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { SwapConfirmationScreen } from "./ConfirmationScreen.js";
import { SwapStatusScreen } from "./SwapStatusScreen.js";

type SwapFlowProps = {
  onBack?: () => void;
  buyWithCryptoQuote: BuyWithCryptoQuote;
  account: Account;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  isFiatFlow: boolean;
  onDone: () => void;
  onTryAgain: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
};

export function SwapFlow(props: SwapFlowProps) {
  const [swapTxHash, setSwapTxHash] = useState<string | undefined>();

  const quote = props.buyWithCryptoQuote;

  const fromChain = useMemo(
    () => getCachedChain(quote.swapDetails.fromToken.chainId),
    [quote],
  );

  const toChain = useMemo(
    () => getCachedChain(quote.swapDetails.toToken.chainId),
    [quote],
  );

  const fromTokenSymbol = quote.swapDetails.fromToken.symbol || "";
  const toTokenSymbol = quote.swapDetails.toToken.symbol || "";

  const fromAmount = quote.swapDetails.fromAmount;
  const toAmount = quote.swapDetails.toAmount;

  const _toToken = quote.swapDetails.toToken;
  const _fromToken = quote.swapDetails.fromToken;

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (_toToken.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _toToken.tokenAddress,
      name: _toToken.name || "",
      symbol: _toToken.symbol || "",
    };
    return tokenInfo;
  }, [_toToken]);

  const fromToken: ERC20OrNativeToken = useMemo(() => {
    if (_fromToken.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _fromToken.tokenAddress,
      name: _fromToken.name || "",
      symbol: _fromToken.symbol || "",
    };
    return tokenInfo;
  }, [_fromToken]);

  if (swapTxHash) {
    return (
      <SwapStatusScreen
        onBack={props.onBack}
        onTryAgain={props.onTryAgain}
        onViewPendingTx={props.onViewPendingTx}
        swapTxHash={swapTxHash}
        client={props.client}
        onDone={props.onDone}
        isBuyForTx={props.isBuyForTx}
        isEmbed={props.isEmbed}
        quote={quote}
      />
    );
  }

  return (
    <SwapConfirmationScreen
      setSwapTxHash={setSwapTxHash}
      toChain={toChain}
      toAmount={toAmount}
      toTokenSymbol={toTokenSymbol}
      fromChain={fromChain}
      toToken={toToken}
      fromAmount={fromAmount}
      fromToken={fromToken}
      fromTokenSymbol={fromTokenSymbol}
      client={props.client}
      onBack={props.onBack}
      onTryAgain={props.onTryAgain}
      quote={quote}
      isFiatFlow={props.isFiatFlow}
    />
  );
}
