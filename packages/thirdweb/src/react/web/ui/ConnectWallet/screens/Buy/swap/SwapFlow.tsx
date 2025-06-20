import { useMemo, useState } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import type { PayerInfo } from "../types.js";
import { SwapConfirmationScreen } from "./ConfirmationScreen.js";
import { SwapStatusScreen } from "./SwapStatusScreen.js";

type SwapFlowProps = {
  title: string;
  onBack?: () => void;
  buyWithCryptoQuote: BuyWithCryptoQuote;
  payer: PayerInfo;
  client: ThirdwebClient;
  isFiatFlow: boolean;
  onDone: () => void;
  onTryAgain: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
  approvalAmount?: bigint;
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
        client={props.client}
        fromChain={fromChain}
        isEmbed={props.isEmbed}
        onBack={props.onBack}
        onDone={props.onDone}
        onSuccess={props.onSuccess}
        onTryAgain={props.onTryAgain}
        quote={quote}
        swapTxHash={swapTxHash}
        title={props.title}
        transactionMode={props.transactionMode}
      />
    );
  }

  return (
    <SwapConfirmationScreen
      client={props.client}
      fromAmount={fromAmount}
      fromChain={fromChain}
      fromToken={fromToken}
      fromTokenSymbol={fromTokenSymbol}
      isFiatFlow={props.isFiatFlow}
      onBack={props.onBack}
      onTryAgain={props.onTryAgain}
      payer={props.payer}
      preApprovedAmount={props.approvalAmount}
      quote={quote}
      setSwapTxHash={setSwapTxHash}
      title={props.title}
      toAmount={toAmount}
      toChain={toChain}
      toToken={toToken}
      toTokenSymbol={toTokenSymbol}
    />
  );
}
