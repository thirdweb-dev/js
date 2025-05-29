import { useMemo, useState } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { Buy } from "../../../../../../../bridge/index.js";
import { Value } from "ox";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import type { PayerInfo } from "../types.js";
import { SwapConfirmationScreen } from "./ConfirmationScreen.js";
import { SwapStatusScreen } from "./SwapStatusScreen.js";

type SwapFlowProps = {
  title: string;
  onBack?: () => void;
  quote: Buy.prepare.Result;
  payer: PayerInfo;
  client: ThirdwebClient;
  isFiatFlow: boolean;
  onDone: () => void;
  onTryAgain: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
};

export function SwapFlow(props: SwapFlowProps) {
  const [swapTxHash, setSwapTxHash] = useState<string | undefined>();

  const quote = props.quote;
  const firstStep = quote.steps[0];

  if (!firstStep) {
    throw new Error("Bridge quote must have at least one step");
  }

  const fromChain = useMemo(
    () => getCachedChain(firstStep.originToken.chainId),
    [firstStep],
  );

  const toChain = useMemo(
    () => getCachedChain(firstStep.destinationToken.chainId),
    [firstStep],
  );

  const fromTokenSymbol = firstStep.originToken.symbol || "";
  const toTokenSymbol = firstStep.destinationToken.symbol || "";

  // For now, we'll use the first step amounts for display
  // TODO: In future, we'll show the full multi-step flow
  const fromAmount = Value.format(firstStep.originAmount, firstStep.originToken.decimals).toString();
  const toAmount = Value.format(firstStep.destinationAmount, firstStep.destinationToken.decimals).toString();

  const _toToken = firstStep.destinationToken;
  const _fromToken = firstStep.originToken;

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (_toToken.address === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _toToken.address,
      name: _toToken.name || "",
      symbol: _toToken.symbol || "",
    };
    return tokenInfo;
  }, [_toToken]);

  const fromToken: ERC20OrNativeToken = useMemo(() => {
    if (_fromToken.address === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _fromToken.address,
      name: _fromToken.name || "",
      symbol: _fromToken.symbol || "",
    };
    return tokenInfo;
  }, [_fromToken]);

  if (swapTxHash) {
    return (
      <SwapStatusScreen
        title={props.title}
        onBack={props.onBack}
        onTryAgain={props.onTryAgain}
        swapTxHash={swapTxHash}
        fromChain={fromChain}
        client={props.client}
        onDone={props.onDone}
        transactionMode={props.transactionMode}
        isEmbed={props.isEmbed}
        quote={quote}
        onSuccess={props.onSuccess}
      />
    );
  }

  return (
    <SwapConfirmationScreen
      title={props.title}
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
      payer={props.payer}
    />
  );
}
