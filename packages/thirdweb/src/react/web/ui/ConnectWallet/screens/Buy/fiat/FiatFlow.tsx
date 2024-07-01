import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { getPostOnRampQuote } from "../../../../../../../pay/buyWithFiat/getPostOnRampQuote.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import type {
  Account,
  Wallet,
} from "../../../../../../../wallets/interfaces/wallet.js";
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import {
  FiatConfirmationScreenUI,
  type FiatConfirmationScreenUIProps,
} from "../confirmation/FiatConfirmationScreen.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { formatSeconds } from "../swap/formatSeconds.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import { getCurrencyMeta } from "./currencies.js";

export function FiatFlow(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  testMode: boolean;
  theme: "light" | "dark";
  onDone: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
  activeChain: Chain;
  activeWallet: Wallet;
  account: Account;
}) {
  const queryClient = useQueryClient();
  const invalidatedBalance = useRef(false);

  // swap required or not
  const hasTwoSteps = isSwapRequiredPostOnramp(props.quote);

  const [uiState, setUIState] = useState<
    FiatConfirmationScreenUIProps["state"]
  >({
    activeStep: "onramp",
    status: "idle",
  });

  const [popupWindow, setPopupWindow] = useState<Window | null>();

  const [swapTxHash, setSwapTxHash] = useState<string | undefined>();
  const [swapQuote, setSwapQuote] = useState<BuyWithCryptoQuote | undefined>();
  const swapStatus = useBuyWithCryptoStatus(
    swapTxHash
      ? {
          client: props.client,
          transactionHash: swapTxHash,
        }
      : undefined,
  );

  const swapRequiresApproval = swapQuote
    ? !!swapQuote.approval
    : hasTwoSteps &&
      props.quote.onRampToken.token.tokenAddress !== NATIVE_TOKEN_ADDRESS;

  const handlePostOnRampSwap = useCallback(
    async (fiatStatus: BuyWithFiatStatus) => {
      setUIState({
        activeStep: "swap",
        status: "fetching-quote",
      });

      try {
        const _swapQuote = await getPostOnRampQuote({
          client: props.client,
          buyWithFiatStatus: fiatStatus,
        });

        setSwapQuote(_swapQuote);

        if (_swapQuote.approval) {
          setUIState({
            activeStep: "approve",
            status: "idle",
          });
        } else {
          setUIState({
            activeStep: "swap",
            status: "idle",
          });
        }
      } catch (e) {
        console.error(e);
        setUIState({
          activeStep: "swap",
          status: "quote-fetch-error",
        });
      }
    },
    [props.client],
  );

  const [stopPollingOnRampStatus, setStopPollingOnRampStatus] = useState(false);

  // once swapping is started, do not fetch
  const onrampStatusQuery = useBuyWithFiatStatus(
    stopPollingOnRampStatus
      ? undefined
      : {
          intentId: props.quote.intentId,
          client: props.client,
        },
  );

  // Update UI state based on Onramp status
  useEffect(() => {
    if (!onrampStatusQuery.data) {
      return;
    }

    function updateWalletBalance() {
      invalidatedBalance.current = true;
      invalidateWalletBalance(queryClient);
    }

    switch (onrampStatusQuery.data.status) {
      // keep the state as is
      case "NOT_FOUND":
      case "CRYPTO_SWAP_IN_PROGRESS":
      case "ON_RAMP_TRANSFER_IN_PROGRESS":
      case "PENDING_ON_RAMP_TRANSFER":
      case "PENDING_PAYMENT":
      case "NONE": {
        return;
      }

      // no swap required
      case "ON_RAMP_TRANSFER_COMPLETED": {
        setStopPollingOnRampStatus(true);
        if (onrampStatusQuery.data.destination) {
          setUIState({
            activeStep: "done",
            status: "idle",
            data: {
              txHash: onrampStatusQuery.data.destination.transactionHash,
            },
          });
        }
        popupWindow?.close();
        updateWalletBalance();
        return;
      }

      // onramp done, swap required
      case "CRYPTO_SWAP_REQUIRED": {
        setStopPollingOnRampStatus(true);
        popupWindow?.close();
        handlePostOnRampSwap(onrampStatusQuery.data);
        return;
      }

      case "CRYPTO_SWAP_FAILED": {
        setUIState({
          activeStep: "swap",
          status: "error",
        });
        return;
      }

      // swap partially successful
      case "CRYPTO_SWAP_FALLBACK": {
        if (onrampStatusQuery.data.destination) {
          setUIState({
            activeStep: "swap",
            status: "partialSuccess",
            data: {
              amount: onrampStatusQuery.data.destination.amount,
              token:
                onrampStatusQuery.data.destination.token.tokenAddress ===
                NATIVE_TOKEN_ADDRESS
                  ? { nativeToken: true }
                  : {
                      address:
                        onrampStatusQuery.data.destination.token.tokenAddress,
                      name: onrampStatusQuery.data.destination.token.name || "",
                      symbol:
                        onrampStatusQuery.data.destination.token.symbol || "",
                    },
            },
          });
        }

        updateWalletBalance();
        return;
      }

      // onramp + swap done
      case "CRYPTO_SWAP_COMPLETED": {
        setStopPollingOnRampStatus(true);
        if (onrampStatusQuery.data.destination) {
          setUIState({
            activeStep: "done",
            status: "idle",
            data: {
              txHash: onrampStatusQuery.data.destination.transactionHash,
            },
          });
        }
        updateWalletBalance();
        return;
      }

      case "PAYMENT_FAILED":
      case "ON_RAMP_TRANSFER_FAILED": {
        setUIState({
          activeStep: "onramp",
          status: "error",
        });
        return;
      }
    }

    // onramp failed
  }, [onrampStatusQuery.data, handlePostOnRampSwap, queryClient, popupWindow]);

  // Update UI state based on Swap status
  useEffect(() => {
    if (!swapStatus.data) {
      return;
    }

    function updateWalletBalance() {
      invalidatedBalance.current = true;
      invalidateWalletBalance(queryClient);
    }

    switch (swapStatus.data.status) {
      case "NONE":
      case "NOT_FOUND":
      case "PENDING": {
        return;
      }

      case "COMPLETED": {
        if (swapStatus.data.destination) {
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
                txHash: swapStatus.data.destination.transactionHash,
              },
            });
          }

          updateWalletBalance();
        }

        return;
      }

      case "FAILED": {
        setUIState({
          status: "error",
          activeStep: "swap",
        });
        return;
      }
    }
  }, [swapStatus.data, queryClient]);

  const onRampChain: Chain = getCachedChain(
    props.quote.onRampToken.token.chainId,
  );
  const onRampToken: ERC20OrNativeToken =
    props.quote.onRampToken.token.tokenAddress === NATIVE_TOKEN_ADDRESS
      ? { nativeToken: true }
      : {
          address: props.quote.onRampToken.token.tokenAddress,
          name: props.quote.onRampToken.token.name,
          symbol: props.quote.onRampToken.token.symbol,
          // TODO: add when available in backend
          // icon: props.quote.onRampToken.token.icon
        };

  const toToken: ERC20OrNativeToken =
    props.quote.toToken.tokenAddress === NATIVE_TOKEN_ADDRESS
      ? { nativeToken: true }
      : {
          address: props.quote.toToken.tokenAddress,
          name: props.quote.toToken.name || "",
          symbol: props.quote.toToken.symbol || "",
          // TODO: add when available in backend
          // icon: props.quote.toToken.token.icon
        };

  // open onramp popup
  const handleOnrampClick = () => {
    const popupWindow = openOnrampPopup(props.quote.onRampLink, props.theme);
    setPopupWindow(popupWindow);

    setUIState({
      activeStep: "onramp",
      status: "pending",
    });

    addPendingTx({
      type: "fiat",
      intentId: props.quote.intentId,
    });
  };

  async function sendApproveTx() {
    if (!swapQuote) {
      throw new Error("No swap quote available");
    }

    if (!swapQuote.approval) {
      throw new Error("No approval required");
    }

    try {
      setUIState({
        activeStep: "approve",
        status: "pending",
      });

      const tx = await sendTransaction({
        account: props.account,
        transaction: swapQuote.approval,
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
    if (!swapQuote) {
      throw new Error("No Swap quote available");
    }

    try {
      let tx = swapQuote.transactionRequest;

      // Fix for inApp wallet
      // Ideally - the pay server sends a non-legacy transaction to avoid this issue
      if (
        props.activeWallet?.id === "inApp" ||
        props.activeWallet?.id === "embedded"
      ) {
        tx = {
          ...swapQuote.transactionRequest,
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

  // show the quote amount
  let toAmount = props.quote.estimatedToAmountMin;
  if (hasTwoSteps) {
    // when sucessful - update it to show the final amount
    if (
      swapStatus.data?.status === "COMPLETED" &&
      swapStatus.data.subStatus === "SUCCESS" &&
      swapStatus.data.destination
    ) {
      toAmount = swapStatus.data.destination.amount;
    }
  } else {
    if (
      onrampStatusQuery.data?.status === "ON_RAMP_TRANSFER_COMPLETED" &&
      onrampStatusQuery.data.destination
    ) {
      toAmount = onrampStatusQuery.data.destination.amount;
    }
  }

  return (
    <FiatConfirmationScreenUI
      activeChain={props.activeChain}
      client={props.client}
      estimatedTimeToOnramp={formatSeconds(
        props.quote.estimatedDurationSeconds,
      )}
      fiatFrom={{
        amount: props.quote.fromCurrency.amount,
        currency: getCurrencyMeta(props.quote.fromCurrency.currencySymbol),
      }}
      onBack={props.onBack}
      onOnrampClick={handleOnrampClick}
      state={uiState}
      swapRequired={
        hasTwoSteps
          ? {
              approvalRequired: swapRequiresApproval
                ? {
                    onApproveClick() {
                      sendApproveTx();
                    },
                  }
                : null,
              estimatedTimeToSwap: swapQuote
                ? formatSeconds(
                    swapQuote.swapDetails.estimated.durationSeconds || 0,
                  )
                : null,
              onSwapClick: () => {
                sendSwapTx();
              },
              refetchSwapQuote: () => {
                if (onrampStatusQuery.data) {
                  handlePostOnRampSwap(onrampStatusQuery.data);
                } else {
                  throw new Error("invalid state");
                }
              },
              swapFrom: {
                amount: props.quote.onRampToken.amount,
                chain: onRampChain,
                token: onRampToken,
              },
            }
          : null
      }
      to={{
        amount: toAmount,
        chain: getCachedChain(props.quote.toToken.chainId),
        token: toToken,
      }}
      // TODO
      txInfo={null}
    />
  );
}
