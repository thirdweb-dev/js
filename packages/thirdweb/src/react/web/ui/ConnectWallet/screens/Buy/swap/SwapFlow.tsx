import { useEffect, useMemo, useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import type {
  Account,
  Wallet,
} from "../../../../../../../wallets/interfaces/wallet.js";
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import {
  SwapConfirmationScreenUI,
  type SwapConfirmationScreenUIProps,
} from "../confirmation/SwapConfirmationScreen.js";
import { formatSeconds } from "./formatSeconds.js";
import { addPendingTx } from "./pendingSwapTx.js";

type SwapFlowProps = {
  onBack: null | (() => void);
  buyWithCryptoQuote: BuyWithCryptoQuote;
  account: Account;
  activeChain: Chain;
  // onViewPendingTx: () => void;
  client: ThirdwebClient;
  isFiatFlow: boolean;
  onDone: () => void;
  onTryAgain: () => void;
  // TODO - pass the txInfo here
  isBuyForTx: boolean;
  isEmbed: boolean;
  activeWallet: Wallet;
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

  const fromAmount = quote.swapDetails.fromAmount;

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

  const [uiState, setUIState] = useState<
    SwapConfirmationScreenUIProps["state"]
  >({
    activeStep: quote.approval ? "approve" : "swap",
    status: "idle",
  });

  const swapStatus = useBuyWithCryptoStatus(
    swapTxHash
      ? {
          client: props.client,
          transactionHash: swapTxHash,
        }
      : undefined,
  );

  // show the quote amount
  let toAmount = quote.swapDetails.toAmount;
  // when sucessful - update it to show the final amount
  if (
    swapStatus.data?.status === "COMPLETED" &&
    swapStatus.data.subStatus === "SUCCESS" &&
    swapStatus.data.destination
  ) {
    toAmount = swapStatus.data.destination.amount;
  }

  useEffect(() => {
    if (!swapStatus.data) {
      return;
    }

    // Swap Complete
    if (
      swapStatus.data?.status === "COMPLETED" &&
      swapStatus.data.destination
    ) {
      // Partial Success - Got unexpected tokens
      if (swapStatus.data.subStatus === "PARTIAL_SUCCESS") {
        setUIState({
          status: "partialSuccess",
          activeStep: "swap",
          data: {
            token:
              swapStatus.data.destination.token.tokenAddress ===
              NATIVE_TOKEN_ADDRESS
                ? { nativeToken: true }
                : {
                    address: swapStatus.data.destination.token.tokenAddress,
                    name: swapStatus.data.destination.token.name || "",
                    symbol: swapStatus.data.destination.token.symbol || "",
                    // TODO: add when available in backend
                    // icon: swapStatus.data.destination.token.icon
                  },
            amount: swapStatus.data.destination.amount,
          },
        });
      }

      // Actually sucessful
      else {
        setUIState({
          status: "idle",
          activeStep: "done",
          data: {
            chain: toChain,
            txHash: swapStatus.data.destination.transactionHash,
          },
        });
      }
    }

    // Swap Failed
    if (swapStatus.data?.status === "FAILED") {
      setUIState({
        status: "error",
        activeStep: "swap",
      });
    }
  }, [swapStatus.data, toChain]);

  async function sendApproveTx() {
    if (!quote.approval) {
      throw new Error("No approval required");
    }

    try {
      setUIState({
        activeStep: "approve",
        status: "pending",
      });

      const tx = await sendTransaction({
        account: props.account,
        transaction: quote.approval,
      });

      await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

      setUIState({
        activeStep: "swap",
        status: "idle",
      });
    } catch (e) {
      console.error(e);
      setUIState({
        activeStep: "approve",
        status: "error",
      });
    }
  }

  async function sendSwapTx() {
    try {
      let tx = quote.transactionRequest;

      // Fix for inApp wallet
      // Ideally - the pay server sends a non-legacy transaction to avoid this issue
      if (
        props.activeWallet?.id === "inApp" ||
        props.activeWallet?.id === "embedded"
      ) {
        tx = {
          ...quote.transactionRequest,
          gasPrice: undefined,
        };
      }

      setUIState({
        activeStep: "swap",
        status: "pending",
      });

      const swapTxResult = await sendTransaction({
        account: props.account,
        transaction: tx,
      });

      await waitForReceipt({ ...swapTxResult, maxBlocksWaitTime: 50 });

      addPendingTx({
        type: "swap",
        txHash: swapTxResult.transactionHash,
      });

      setSwapTxHash(swapTxResult.transactionHash);
    } catch (e) {
      console.error(e);
      setUIState({
        activeStep: "swap",
        status: "error",
      });
    }
  }

  return (
    <SwapConfirmationScreenUI
      activeChain={props.activeChain}
      approvalRequired={
        quote.approval
          ? {
              onApproveClick: () => {
                sendApproveTx();
              },
            }
          : null
      }
      client={props.client}
      estimatedTimeToSwap={formatSeconds(
        quote.swapDetails.estimated.durationSeconds || 0,
      )}
      from={{
        amount: fromAmount,
        chain: fromChain,
        token: fromToken,
      }}
      to={{
        amount: toAmount,
        chain: toChain,
        token: toToken,
      }}
      onBack={props.onBack}
      onSwapClick={() => {
        sendSwapTx();
      }}
      state={uiState}
      // TODO - add tx Info when available
      txInfo={null}
    />
  );
}
