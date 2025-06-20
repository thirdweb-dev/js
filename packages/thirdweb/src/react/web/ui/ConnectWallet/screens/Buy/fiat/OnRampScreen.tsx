import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { allowance } from "../../../../../../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import { getBuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import {
  type BuyWithFiatStatus,
  getBuyWithFiatStatus,
} from "../../../../../../../pay/buyWithFiat/getStatus.js";
import {
  getOnRampSteps,
  type OnRampStep,
} from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import type { PayTokenInfo } from "../../../../../../../pay/utils/commonTypes.js";
import { sendBatchTransaction } from "../../../../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { isInAppSigner } from "../../../../../../../wallets/in-app/core/wallet/is-in-app-signer.js";
import { spacing } from "../../../../../../core/design-system/index.js";
import { useChainName } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import type { FiatStatusMeta } from "../pay-transactions/statusMeta.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import { StepConnectorArrow } from "../swap/StepConnector.js";
import { WalletRow } from "../swap/WalletRow.js";
import type { PayerInfo } from "../types.js";
import { getProviderLabel } from "../utils.js";
import { StepContainer } from "./FiatSteps.js";

type OnRampScreenState = {
  steps: Array<{
    index: number;
    step: OnRampStep;
    status: FiatStatusMeta["progressStatus"];
  }>;
  handleContinue: () => void;
  isLoading: boolean;
  isDone: boolean;
  isFailed: boolean;
};

export function OnRampScreen(props: {
  title: string;
  quote: BuyWithFiatQuote;
  onBack: () => void;
  client: ThirdwebClient;
  testMode: boolean;
  theme: "light" | "dark";
  onDone: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  payer: PayerInfo;
  onSuccess: (status: BuyWithFiatStatus) => void;
  receiverAddress: string;
  paymentLinkId?: string;
}) {
  const connectedWallets = useConnectedWallets();
  const isAutoMode = isInAppSigner({
    connectedWallets,
    wallet: props.payer.wallet,
  });
  const state = useOnRampScreenState({
    client: props.client,
    isAutoMode,
    onDone: props.onDone,
    onSuccess: props.onSuccess,
    payer: props.payer,
    paymentLinkId: props.paymentLinkId,
    quote: props.quote,
    theme: props.theme,
  });
  const firstStepChainId = state.steps[0]?.step.token.chainId;
  return (
    <Container p="lg">
      <ModalHeader onBack={props.onBack} title={props.title} />
      <Spacer y="xl" />
      <Container
        center="y"
        flex="column"
        gap="xs"
        style={{
          paddingLeft: spacing.md,
        }}
      >
        <WalletRow
          address={props.receiverAddress}
          client={props.client}
          iconSize="md"
          label="Recipient wallet"
          textSize="sm"
        />
      </Container>
      <Spacer y="md" />
      <Container flex="column">
        {state.steps.map(({ step, status }, index) => (
          <Container flex="column" key={step.action}>
            <StepContainer
              index={index}
              state={status}
              style={{
                flex: "1",
              }}
            >
              <StepUI
                client={props.client}
                index={index}
                payer={props.payer}
                step={step}
              />
            </StepContainer>
            {index < state.steps.length - 1 && <StepConnectorArrow />}
          </Container>
        ))}
      </Container>

      <Spacer y="md" />

      <Text
        center
        color="secondaryText"
        size="xs"
        style={{ padding: `0 ${spacing.xl}` }}
      >
        Keep this window open until all transactions are complete.
      </Text>

      <Spacer y="lg" />

      <Container flex="column" gap="md">
        {!state.isDone &&
        firstStepChainId &&
        firstStepChainId !== props.payer.chain.id ? (
          <SwitchNetworkButton
            fullWidth
            switchChain={async () => {
              await props.payer.wallet.switchChain(
                getCachedChain(firstStepChainId),
              );
            }}
            variant="accent"
          />
        ) : (
          <Button
            disabled={state.isLoading}
            fullWidth
            gap="sm"
            onClick={state.handleContinue}
            variant="accent"
          >
            {state.isLoading
              ? "Processing"
              : state.isDone
                ? props.transactionMode
                  ? "Continue Transaction"
                  : "Done"
                : state.isFailed
                  ? "Retry"
                  : "Continue"}
            {state.isLoading && <Spinner color="primaryText" size="sm" />}
          </Button>
        )}
      </Container>
    </Container>
  );
}

function StepUI(props: {
  step: OnRampStep;
  index: number;
  client: ThirdwebClient;
  payer: PayerInfo;
}) {
  const { step, client } = props;
  const chain = useChainName(getCachedChain(step.token.chainId));
  return (
    <Container flex="column" gap="xs" py="3xs">
      <Container
        center="y"
        flex="row"
        gap="sm"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
      >
        <PayTokenIcon
          chain={getCachedChain(step.token.chainId)}
          client={client}
          size="md"
          token={{
            address: step.token.tokenAddress,
          }}
        />
        <Container center="y" flex="column" gap="3xs" style={{ flex: "1" }}>
          <Text color="primaryText" size="sm">
            {getProviderLabel(step.action)}
          </Text>

          <Container
            center="y"
            flex="row"
            gap="xs"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "space-between",
            }}
          >
            <Container
              center="y"
              flex="row"
              gap="xxs"
              style={{
                flex: "1 1 60%",
                flexWrap: "nowrap",
                maxWidth: "60%",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Text color="primaryText" size="sm">
                {formatNumber(Number(step.amount), 5)}
              </Text>
              <TokenSymbol
                chain={getCachedChain(step.token.chainId)}
                color="secondaryText"
                size="sm"
                token={{
                  address: step.token.tokenAddress,
                  name: step.token.name || "",
                  symbol: step.token.symbol || "",
                }}
              />
            </Container>
            <Container
              center="y"
              flex="row"
              gap="xs"
              style={{
                flex: "1 1 40%",
                flexWrap: "nowrap",
                justifyContent: "flex-end",
                maxWidth: "40%",
                minWidth: 0,
              }}
            >
              <Text
                size="xs"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chain.name}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

function useOnRampScreenState(props: {
  quote: BuyWithFiatQuote;
  client: ThirdwebClient;
  onSuccess: (status: BuyWithFiatStatus) => void;
  onDone: () => void;
  payer: PayerInfo;
  theme: "light" | "dark";
  isAutoMode?: boolean;
  paymentLinkId?: string;
}): OnRampScreenState {
  const onRampSteps = getOnRampSteps(props.quote);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [swapTxHash, setSwapTxHash] = useState<{
    hash: string;
    chainId: number;
  }>();
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  // Track onramp status
  const { uiStatus: fiatOnrampStatus } = useOnRampStatus({
    client: props.client,
    intentId: props.quote.intentId,
    onSuccess: (status) => {
      if (onRampSteps.length === 1) {
        // If only one step, this is the final success
        props.onSuccess(status);
      } else {
        // Move to next step (swap)
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    openedWindow: popupWindow,
  });

  // Get quote for current swap/bridge step if needed
  const previousStep = onRampSteps[currentStepIndex - 1];
  const currentStep = onRampSteps[currentStepIndex];

  // Handle swap execution
  const swapMutation = useSwapMutation({
    client: props.client,
    isFiatFlow: true,
    payer: props.payer,
    paymentLinkId: props.paymentLinkId,
  });

  // Track swap status
  const { uiStatus: swapStatus } = useSwapStatus({
    chainId: swapTxHash?.chainId,
    client: props.client,
    onSuccess: () => {
      if (currentStepIndex === onRampSteps.length - 1) {
        // Last step completed - call final success
        getBuyWithFiatStatus({
          client: props.client,
          intentId: props.quote.intentId,
        }).then(props.onSuccess);
      } else {
        // Reset swap state before moving to next step
        setSwapTxHash(undefined);
        swapMutation.reset();
        // Move to next step
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    transactionHash: swapTxHash?.hash,
  });

  // Map steps to their current status
  const steps = onRampSteps.map((step, index) => {
    let status: FiatStatusMeta["progressStatus"] = "unknown";

    if (index === 0) {
      // First step (onramp) status
      status = fiatOnrampStatus;
    } else if (index < currentStepIndex) {
      // Previous steps are completed
      status = "completed";
    } else if (index === currentStepIndex) {
      // Current step - could be swap or bridge
      if (swapMutation.isPending) {
        status = "pending";
      } else if (swapMutation.error) {
        status = "failed";
      } else if (swapTxHash) {
        status = swapStatus;
      } else {
        status = "actionRequired";
      }
    }

    return {
      index,
      status,
      step,
    };
  });

  const isLoading = steps.some((step) => step.status === "pending");
  const isDone = steps.every((step) => step.status === "completed");
  const isFailed = steps.some((step) => step.status === "failed");

  // Update handleContinue to handle done state
  const handleContinue = useCallback(async () => {
    if (isDone) {
      props.onDone();
      return;
    }

    if (currentStepIndex === 0) {
      // First step - open onramp popup
      const popup = openOnrampPopup(props.quote.onRampLink, props.theme);
      trackPayEvent({
        amountWei: props.quote.onRampToken.amountWei,
        client: props.client,
        event: "open_onramp_popup",
        toChainId: props.quote.onRampToken.token.chainId,
        toToken: props.quote.onRampToken.token.tokenAddress,
        walletAddress: props.payer.account.address,
        walletType: props.payer.wallet.id,
      });
      setPopupWindow(popup);
      addPendingTx({
        intentId: props.quote.intentId,
        type: "fiat",
      });
    } else if (previousStep && currentStep && !swapTxHash) {
      // Execute swap/bridge
      try {
        const result = await swapMutation.mutateAsync({
          amount: currentStep.amount,
          fromToken: previousStep.token,
          toToken: currentStep.token,
        });
        setSwapTxHash({
          chainId: result.chainId,
          hash: result.transactionHash,
        });
      } catch (e) {
        console.error("Failed to execute swap:", e);
      }
    } else if (isFailed) {
      // retry the quote step
      setSwapTxHash(undefined);
      swapMutation.reset();
    }
  }, [
    isDone,
    currentStepIndex,
    swapTxHash,
    props.quote,
    props.onDone,
    swapMutation,
    props.theme,
    isFailed,
    swapMutation.reset,
    props.client,
    props.payer.account.address,
    props.payer.wallet.id,
    currentStep,
    previousStep,
  ]);

  // Auto-progress effect
  useEffect(() => {
    if (!props.isAutoMode) {
      return;
    }

    // Auto-start next swap step when previous step completes
    if (
      !isLoading &&
      !isDone &&
      !isFailed &&
      currentStepIndex > 0 &&
      currentStepIndex < onRampSteps.length &&
      !swapTxHash
    ) {
      handleContinue();
    }
  }, [
    props.isAutoMode,
    currentStepIndex,
    swapTxHash,
    onRampSteps.length,
    handleContinue,
    isDone,
    isFailed,
    isLoading,
  ]);

  return {
    handleContinue,
    isDone,
    isFailed,
    isLoading,
    steps,
  };
}

function useOnRampStatus(props: {
  intentId: string;
  client: ThirdwebClient;
  onSuccess: (status: BuyWithFiatStatus) => void;
  openedWindow: Window | null;
}) {
  const queryClient = useQueryClient();
  const statusQuery = useBuyWithFiatStatus({
    client: props.client,
    intentId: props.intentId,
    queryOptions: {
      enabled: !!props.openedWindow,
    },
  });
  let uiStatus: FiatStatusMeta["progressStatus"] = "actionRequired";

  switch (statusQuery.data?.status) {
    case "ON_RAMP_TRANSFER_COMPLETED":
      uiStatus = "completed";
      break;
    case "PAYMENT_FAILED":
      uiStatus = "failed";
      break;
    case "PENDING_PAYMENT":
      uiStatus = "pending";
      break;
    default:
      uiStatus = "actionRequired";
      break;
  }

  const purchaseCbCalled = useRef(false);
  useEffect(() => {
    if (purchaseCbCalled.current || !props.onSuccess) {
      return;
    }

    if (statusQuery.data && uiStatus === "completed") {
      purchaseCbCalled.current = true;
      props.onSuccess(statusQuery.data);
    }
  }, [props.onSuccess, statusQuery.data, uiStatus]);

  // close the onramp popup if onramp is completed
  useEffect(() => {
    if (!props.openedWindow) {
      return;
    }

    if (uiStatus === "completed") {
      try {
        if (props.openedWindow && !props.openedWindow.closed) {
          props.openedWindow.close();
        }
      } catch (e) {
        console.warn("Failed to close payment window:", e);
      }
    }
  }, [props.openedWindow, uiStatus]);

  // invalidate wallet balance when onramp is completed
  const invalidatedBalance = useRef(false);
  useEffect(() => {
    if (!invalidatedBalance.current && uiStatus === "completed") {
      invalidatedBalance.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [uiStatus, queryClient]);

  return { uiStatus };
}

function useSwapStatus(props: {
  client: ThirdwebClient;
  transactionHash?: string;
  chainId?: number;
  onSuccess: (status: BuyWithCryptoStatus) => void;
}) {
  const swapStatus = useBuyWithCryptoStatus(
    props.transactionHash && props.chainId
      ? {
          chainId: props.chainId,
          client: props.client,
          transactionHash: props.transactionHash,
        }
      : undefined,
  );

  let uiStatus: FiatStatusMeta["progressStatus"] = "unknown";

  switch (swapStatus.data?.status) {
    case "COMPLETED":
      uiStatus = "completed";
      break;
    case "FAILED":
      uiStatus = "failed";
      break;
    case "PENDING":
    case "NOT_FOUND":
      uiStatus = "pending";
      break;
    case "NONE":
      uiStatus = "unknown";
      break;
    default:
      uiStatus = "unknown";
      break;
  }

  const purchaseCbCalled = useRef(false);
  useEffect(() => {
    if (purchaseCbCalled.current || !props.onSuccess) {
      return;
    }

    if (swapStatus.data?.status === "COMPLETED") {
      purchaseCbCalled.current = true;
      props.onSuccess(swapStatus.data);
    }
  }, [props.onSuccess, swapStatus]);

  const queryClient = useQueryClient();
  const balanceInvalidated = useRef(false);
  useEffect(() => {
    if (uiStatus === "completed" && !balanceInvalidated.current) {
      balanceInvalidated.current = true;
      invalidateWalletBalance(queryClient);
    }
  }, [queryClient, uiStatus]);

  return { uiStatus };
}

function useSwapMutation(props: {
  client: ThirdwebClient;
  payer: PayerInfo;
  isFiatFlow: boolean;
  paymentLinkId?: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      fromToken: PayTokenInfo;
      toToken: PayTokenInfo;
      amount: string;
    }) => {
      const { fromToken, toToken, amount } = input;
      const wallet = props.payer.wallet;

      // in case the wallet is not on the same chain as the fromToken, switch to it
      if (wallet.getChain()?.id !== fromToken.chainId) {
        await wallet.switchChain(getCachedChain(fromToken.chainId));
      }

      const account = wallet.getAccount();

      if (!account) {
        throw new Error("Payer wallet has no account");
      }

      // always get a fresh quote before executing
      const quote = await getBuyWithCryptoQuote({
        client: props.client,
        fromAddress: account.address,
        fromChainId: fromToken.chainId,
        fromTokenAddress: fromToken.tokenAddress,
        paymentLinkId: props.paymentLinkId,
        toAddress: account.address,
        toAmount: amount,
        toChainId: toToken.chainId,
        toTokenAddress: toToken.tokenAddress,
      });

      const canBatch = account.sendBatchTransaction;
      const tokenContract = getContract({
        address: quote.swapDetails.fromToken.tokenAddress,
        chain: getCachedChain(quote.swapDetails.fromToken.chainId),
        client: props.client,
      });
      const approveTxRequired =
        quote.approvalData &&
        (await allowance({
          contract: tokenContract,
          owner: account.address,
          spender: quote.approvalData.spenderAddress,
        })) < BigInt(quote.approvalData.amountWei);
      if (approveTxRequired && quote.approvalData && !canBatch) {
        trackPayEvent({
          amountWei: quote.swapDetails.fromAmountWei,
          chainId: quote.swapDetails.fromToken.chainId,
          client: props.client,
          event: "prompt_swap_approval",
          fromToken: quote.swapDetails.fromToken.tokenAddress,
          toChainId: quote.swapDetails.toToken.chainId,
          toToken: quote.swapDetails.toToken.tokenAddress,
          walletAddress: account.address,
          walletType: props.payer.wallet.id,
        });

        const transaction = approve({
          amountWei: BigInt(quote.approvalData.amountWei),
          contract: tokenContract,
          spender: quote.approvalData.spenderAddress,
        });

        const tx = await sendTransaction({
          account,
          transaction,
        });

        await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

        trackPayEvent({
          amountWei: quote.swapDetails.fromAmountWei,
          chainId: quote.swapDetails.fromToken.chainId,
          client: props.client,
          event: "swap_approval_success",
          fromToken: quote.swapDetails.fromToken.tokenAddress,
          toChainId: quote.swapDetails.toToken.chainId,
          toToken: quote.swapDetails.toToken.tokenAddress,
          walletAddress: account.address,
          walletType: props.payer.wallet.id,
        });
      }

      trackPayEvent({
        amountWei: quote.swapDetails.fromAmountWei,
        chainId: quote.swapDetails.fromToken.chainId,
        client: props.client,
        event: "prompt_swap_execution",
        fromToken: quote.swapDetails.fromToken.tokenAddress,
        toChainId: quote.swapDetails.toToken.chainId,
        toToken: quote.swapDetails.toToken.tokenAddress,
        walletAddress: account.address,
        walletType: props.payer.wallet.id,
      });
      const tx = quote.transactionRequest;
      let _swapTx: WaitForReceiptOptions;
      // check if we can batch approval and swap
      if (canBatch && quote.approvalData && approveTxRequired) {
        const approveTx = approve({
          amountWei: BigInt(quote.approvalData.amountWei),
          contract: tokenContract,
          spender: quote.approvalData.spenderAddress,
        });

        _swapTx = await sendBatchTransaction({
          account,
          transactions: [approveTx, tx],
        });
      } else {
        _swapTx = await sendTransaction({
          account,
          transaction: tx,
        });
      }

      await waitForReceipt({ ..._swapTx, maxBlocksWaitTime: 50 });

      trackPayEvent({
        amountWei: quote.swapDetails.fromAmountWei,
        chainId: quote.swapDetails.fromToken.chainId,
        client: props.client,
        event: "swap_execution_success",
        fromToken: quote.swapDetails.fromToken.tokenAddress,
        toChainId: quote.swapDetails.toToken.chainId,
        toToken: quote.swapDetails.toToken.tokenAddress,
        walletAddress: account.address,
        walletType: props.payer.wallet.id,
      });

      // do not add pending tx if the swap is part of fiat flow
      if (!props.isFiatFlow) {
        addPendingTx({
          chainId: _swapTx.chain.id,
          txHash: _swapTx.transactionHash,
          type: "swap",
        });
      }

      return {
        chainId: _swapTx.chain.id,
        transactionHash: _swapTx.transactionHash,
      };
    },
    onSuccess: () => {
      invalidateWalletBalance(queryClient);
    },
  });
}
