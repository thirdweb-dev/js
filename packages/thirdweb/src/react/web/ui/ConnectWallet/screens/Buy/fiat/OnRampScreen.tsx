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
  type OnRampStep,
  getOnRampSteps,
} from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import type { PayTokenInfo } from "../../../../../../../pay/utils/commonTypes.js";
import { sendBatchTransaction } from "../../../../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { isEcosystemWallet } from "../../../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { isInAppWallet } from "../../../../../../../wallets/in-app/core/wallet/index.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import { isSmartWallet } from "../../../../../../../wallets/smart/is-smart-wallet.js";
import { spacing } from "../../../../../../core/design-system/index.js";
import { useChainName } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useBuyWithCryptoStatus } from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import { invalidateWalletBalance } from "../../../../../../core/providers/invalidateWalletBalance.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { PayTokenIcon } from "../PayTokenIcon.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import type { FiatStatusMeta } from "../pay-transactions/statusMeta.js";
import { StepConnectorArrow } from "../swap/StepConnector.js";
import { WalletRow } from "../swap/WalletRow.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import type { PayerInfo } from "../types.js";
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
}) {
  const connectedWallets = useConnectedWallets();
  const isAutoMode = isInAppSigner({
    wallet: props.payer.wallet,
    connectedWallets,
  });
  const state = useOnRampScreenState({
    quote: props.quote,
    client: props.client,
    onSuccess: props.onSuccess,
    onDone: props.onDone,
    payer: props.payer,
    theme: props.theme,
    isAutoMode,
  });
  const firstStepChainId = state.steps[0]?.step.token.chainId;
  return (
    <Container p="lg">
      <ModalHeader title={props.title} onBack={props.onBack} />
      <Spacer y="xl" />
      <Container
        flex="column"
        gap="xs"
        center="y"
        style={{
          paddingLeft: spacing.md,
        }}
      >
        <WalletRow
          client={props.client}
          address={props.receiverAddress}
          iconSize="md"
          textSize="sm"
          label="Recipient wallet"
        />
      </Container>
      <Spacer y="md" />
      <Container flex="column">
        {state.steps.map(({ step, status }, index) => (
          <Container flex="column" key={step.action}>
            <StepContainer
              state={status}
              index={index}
              style={{
                flex: "1",
              }}
            >
              <StepUI
                step={step}
                client={props.client}
                payer={props.payer}
                index={index}
              />
            </StepContainer>
            {index < state.steps.length - 1 && <StepConnectorArrow />}
          </Container>
        ))}
      </Container>

      <Spacer y="md" />

      <Text
        size="xs"
        color="secondaryText"
        center
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
            variant="accent"
            switchChain={async () => {
              await props.payer.wallet.switchChain(
                getCachedChain(firstStepChainId),
              );
            }}
          />
        ) : (
          <Button
            variant="accent"
            gap="sm"
            fullWidth
            onClick={state.handleContinue}
            disabled={state.isLoading}
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
            {state.isLoading && <Spinner size="sm" color="primaryText" />}
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
        flex="row"
        center="y"
        gap="sm"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
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
        <Container flex="column" gap="3xs" center="y" style={{ flex: "1" }}>
          <Text size="sm" color="primaryText">
            {step.action.charAt(0).toUpperCase() + step.action.slice(1)}
          </Text>

          <Container
            flex="row"
            gap="xs"
            center="y"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <Container
              flex="row"
              gap="xxs"
              center="y"
              style={{
                flex: "1 1 60%",
                minWidth: 0,
                maxWidth: "60%",
                overflow: "hidden",
                flexWrap: "nowrap",
              }}
            >
              <Text size="sm" color="primaryText">
                {formatNumber(Number(step.amount), 5)}
              </Text>
              <TokenSymbol
                token={{
                  address: step.token.tokenAddress,
                  name: step.token.name || "",
                  symbol: step.token.symbol || "",
                }}
                chain={getCachedChain(step.token.chainId)}
                size="sm"
                color="secondaryText"
              />
            </Container>
            <Container
              flex="row"
              gap="xs"
              center="y"
              style={{
                flex: "1 1 40%",
                maxWidth: "40%",
                minWidth: 0,
                justifyContent: "flex-end",
                flexWrap: "nowrap",
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
    intentId: props.quote.intentId,
    client: props.client,
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
    payer: props.payer,
    isFiatFlow: true,
  });

  // Track swap status
  const { uiStatus: swapStatus } = useSwapStatus({
    client: props.client,
    transactionHash: swapTxHash?.hash,
    chainId: swapTxHash?.chainId,
    onSuccess: () => {
      if (currentStepIndex === onRampSteps.length - 1) {
        // Last step completed - call final success
        getBuyWithFiatStatus({
          intentId: props.quote.intentId,
          client: props.client,
        }).then(props.onSuccess);
      } else {
        // Reset swap state before moving to next step
        setSwapTxHash(undefined);
        swapMutation.reset();
        // Move to next step
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
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
      step,
      status,
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
        event: "open_onramp_popup",
        client: props.client,
        walletAddress: props.payer.account.address,
        walletType: props.payer.wallet.id,
      });
      setPopupWindow(popup);
      addPendingTx({
        type: "fiat",
        intentId: props.quote.intentId,
      });
    } else if (previousStep && currentStep && !swapTxHash) {
      // Execute swap/bridge
      try {
        const result = await swapMutation.mutateAsync({
          fromToken: previousStep.token,
          toToken: currentStep.token,
          amount: currentStep.amount,
        });
        setSwapTxHash({
          hash: result.transactionHash,
          chainId: result.chainId,
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
    steps,
    handleContinue,
    isLoading,
    isDone,
    isFailed,
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
    intentId: props.intentId,
    client: props.client,
    queryOptions: {
      enabled: !!props.openedWindow,
    },
  });
  let uiStatus: FiatStatusMeta["progressStatus"] = "actionRequired";

  switch (statusQuery.data?.status) {
    case "ON_RAMP_TRANSFER_COMPLETED":
    case "CRYPTO_SWAP_COMPLETED":
    case "CRYPTO_SWAP_REQUIRED":
      uiStatus = "completed";
      break;
    case "CRYPTO_SWAP_FALLBACK":
      uiStatus = "partialSuccess";
      break;
    case "ON_RAMP_TRANSFER_FAILED":
    case "PAYMENT_FAILED":
      uiStatus = "failed";
      break;
    case "PENDING_PAYMENT":
    case "ON_RAMP_TRANSFER_IN_PROGRESS":
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

    if (
      statusQuery.data &&
      (uiStatus === "completed" || uiStatus === "partialSuccess")
    ) {
      purchaseCbCalled.current = true;
      props.onSuccess(statusQuery.data);
    }
  }, [props.onSuccess, statusQuery.data, uiStatus]);

  // close the onramp popup if onramp is completed
  useEffect(() => {
    if (!props.openedWindow) {
      return;
    }

    if (uiStatus === "completed" || uiStatus === "partialSuccess") {
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
          client: props.client,
          transactionHash: props.transactionHash,
          chainId: props.chainId,
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
        fromChainId: fromToken.chainId,
        fromTokenAddress: fromToken.tokenAddress,
        toAmount: amount,
        toChainId: toToken.chainId,
        toTokenAddress: toToken.tokenAddress,
        fromAddress: account.address,
        toAddress: account.address,
        client: props.client,
      });

      const canBatch = account.sendBatchTransaction;
      const tokenContract = getContract({
        client: props.client,
        address: quote.swapDetails.fromToken.tokenAddress,
        chain: getCachedChain(quote.swapDetails.fromToken.chainId),
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
          event: "prompt_swap_approval",
          client: props.client,
          walletAddress: account.address,
          walletType: props.payer.wallet.id,
          fromToken: quote.swapDetails.fromToken.tokenAddress,
          fromAmount: quote.swapDetails.fromAmountWei,
          toToken: quote.swapDetails.toToken.tokenAddress,
          toAmount: quote.swapDetails.toAmountWei,
          chainId: quote.swapDetails.fromToken.chainId,
          dstChainId: quote.swapDetails.toToken.chainId,
        });

        const transaction = approve({
          contract: tokenContract,
          spender: quote.approvalData.spenderAddress,
          amountWei: BigInt(quote.approvalData.amountWei),
        });

        const tx = await sendTransaction({
          account,
          transaction,
        });

        await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

        trackPayEvent({
          event: "swap_approval_success",
          client: props.client,
          walletAddress: account.address,
          walletType: props.payer.wallet.id,
          fromToken: quote.swapDetails.fromToken.tokenAddress,
          fromAmount: quote.swapDetails.fromAmountWei,
          toToken: quote.swapDetails.toToken.tokenAddress,
          toAmount: quote.swapDetails.toAmountWei,
          chainId: quote.swapDetails.fromToken.chainId,
          dstChainId: quote.swapDetails.toToken.chainId,
        });
      }

      trackPayEvent({
        event: "prompt_swap_execution",
        client: props.client,
        walletAddress: account.address,
        walletType: props.payer.wallet.id,
        fromToken: quote.swapDetails.fromToken.tokenAddress,
        fromAmount: quote.swapDetails.fromAmountWei,
        toToken: quote.swapDetails.toToken.tokenAddress,
        toAmount: quote.swapDetails.toAmountWei,
        chainId: quote.swapDetails.fromToken.chainId,
        dstChainId: quote.swapDetails.toToken.chainId,
      });
      const tx = quote.transactionRequest;
      let _swapTx: WaitForReceiptOptions;
      // check if we can batch approval and swap
      if (canBatch && quote.approvalData && approveTxRequired) {
        const approveTx = approve({
          contract: tokenContract,
          spender: quote.approvalData.spenderAddress,
          amountWei: BigInt(quote.approvalData.amountWei),
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
        event: "swap_execution_success",
        client: props.client,
        walletAddress: account.address,
        walletType: props.payer.wallet.id,
        fromToken: quote.swapDetails.fromToken.tokenAddress,
        fromAmount: quote.swapDetails.fromAmountWei,
        toToken: quote.swapDetails.toToken.tokenAddress,
        toAmount: quote.swapDetails.toAmountWei,
        chainId: quote.swapDetails.fromToken.chainId,
        dstChainId: quote.swapDetails.toToken.chainId,
      });

      // do not add pending tx if the swap is part of fiat flow
      if (!props.isFiatFlow) {
        addPendingTx({
          type: "swap",
          txHash: _swapTx.transactionHash,
          chainId: _swapTx.chain.id,
        });
      }

      return {
        transactionHash: _swapTx.transactionHash,
        chainId: _swapTx.chain.id,
      };
    },
    onSuccess: () => {
      invalidateWalletBalance(queryClient);
    },
  });
}

function isInAppSigner(options: {
  wallet: Wallet;
  connectedWallets: Wallet[];
}) {
  const isInAppOrEcosystem = (w: Wallet) =>
    isInAppWallet(w) || isEcosystemWallet(w);
  const isSmartWalletWithAdmin =
    isSmartWallet(options.wallet) &&
    options.connectedWallets.some(
      (w) =>
        isInAppOrEcosystem(w) &&
        w.getAccount()?.address?.toLowerCase() ===
          options.wallet.getAdminAccount?.()?.address?.toLowerCase(),
    );
  return isInAppOrEcosystem(options.wallet) || isSmartWalletWithAdmin;
}
