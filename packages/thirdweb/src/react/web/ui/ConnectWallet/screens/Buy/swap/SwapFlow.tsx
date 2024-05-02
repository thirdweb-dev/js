import { useMemo, useState } from "react";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import type { BuyWithCryptoStatusQueryParams } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { SwapConfirmationScreen } from "./ConfirmationScreen.js";
import { SwapStatusScreen } from "./SwapStatusScreen.js";

type SwapFlowProps = {
  onBack: () => void;
  buyWithCryptoQuote: BuyWithCryptoQuote;
  account: Account;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  isFiatFlow: boolean;
  closeModal: () => void;
};

export function SwapFlow(props: SwapFlowProps) {
  const [swapTx, setSwapTx] = useState<
    BuyWithCryptoStatusQueryParams | undefined
  >();

  const quote = props.buyWithCryptoQuote;

  const fromChain = useMemo(
    () => defineChain(quote.swapDetails.fromToken.chainId),
    [quote],
  );

  const toChain = useMemo(
    () => defineChain(quote.swapDetails.toToken.chainId),
    [quote],
  );

  const fromTokenSymbol = quote.swapDetails.fromToken.symbol || "";
  const toTokenSymbol = quote.swapDetails.toToken.symbol || "";

  const fromAmount = quote.swapDetails.fromAmount;
  const toAmount = quote.swapDetails.toAmount;

  const _toToken = quote.swapDetails.toToken;
  const _fromToken = quote.swapDetails.toToken;

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (_toToken.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _toToken.tokenAddress,
      icon: "",
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
      icon: "",
      name: _fromToken.name || "",
      symbol: _fromToken.symbol || "",
    };
    return tokenInfo;
  }, [_fromToken]);

  if (swapTx) {
    return (
      <SwapStatusScreen
        onBack={props.onBack}
        onTryAgain={() => {
          setSwapTx(undefined);
        }}
        onViewPendingTx={props.onViewPendingTx}
        destinationChain={toChain}
        destinationToken={toToken}
        sourceAmount={`${formatNumber(Number(fromAmount), 4)} ${
          fromTokenSymbol || ""
        }`}
        destinationAmount={`${formatNumber(Number(toAmount), 4)} ${
          toTokenSymbol || ""
        }`}
        swapTx={swapTx}
        client={props.client}
        closeModal={props.closeModal}
      />
    );
  }

  return (
    <SwapConfirmationScreen
      setSwapTx={setSwapTx}
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
      onTryAgain={props.onBack}
      quote={quote}
      isFiatFlow={props.isFiatFlow}
    />
  );
}
