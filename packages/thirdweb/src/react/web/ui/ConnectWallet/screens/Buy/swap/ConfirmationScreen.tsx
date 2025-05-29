import { useMemo, useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Buy } from "../../../../../../../bridge/index.js";
import { sendBatchTransaction } from "../../../../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import type { PayerInfo } from "../types.js";
import { ErrorText } from "./ErrorText.js";
import { SwapSummary } from "./SwapSummary.js";
import { addPendingTx } from "./pendingSwapTx.js";

/**
 * @internal
 */
export function SwapConfirmationScreen(props: {
  title: string;
  onBack?: () => void;
  client: ThirdwebClient;
  quote: Buy.prepare.Result;
  setSwapTxHash: (txHash: string) => void;
  onTryAgain: () => void;
  toChain: Chain;
  toAmount: string;
  toTokenSymbol: string;
  fromChain: Chain;
  toToken: ERC20OrNativeToken;
  fromAmount: string;
  fromToken: ERC20OrNativeToken;
  fromTokenSymbol: string;
  isFiatFlow: boolean;
  payer: PayerInfo;
}) {
  // For now, we'll handle only the first step - multi-step support will be added later
  const firstStep = props.quote.steps[0];
  if (!firstStep) {
    throw new Error("Quote must have at least one step");
  }

  // Get all transactions in order from the first step
  const allTransactions = firstStep.transactions;

  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const currentTransaction = allTransactions[currentTransactionIndex];
  const isLastTransaction =
    currentTransactionIndex >= allTransactions.length - 1;

  const receiver = props.quote.intent.receiver;
  const sender = props.quote.intent.sender;

  const uiErrorMessage = useMemo(() => {
    if (status === "error" && error && currentTransaction) {
      const isApproval = currentTransaction.action === "approval";

      if (
        error.toLowerCase().includes("user rejected") ||
        error.toLowerCase().includes("user closed modal") ||
        error.toLowerCase().includes("user denied")
      ) {
        return {
          title: isApproval ? "Failed to Approve" : "Failed to Execute",
          message: `Your wallet rejected the ${isApproval ? "approval" : "transaction"} request.`,
        };
      }
      if (error.toLowerCase().includes("insufficient funds for gas")) {
        return {
          title: "Insufficient Native Funds",
          message: `You do not have enough native funds to ${isApproval ? "approve" : "execute"} the transaction.`,
        };
      }
      return {
        title: isApproval ? "Failed to Approve" : "Failed to Execute",
        message: `Your wallet failed to ${isApproval ? "approve" : "execute"} the transaction for an unknown reason. Please try again or contact support.`,
      };
    }

    return undefined;
  }, [status, error, currentTransaction]);

  return (
    <Container p="lg">
      <ModalHeader title={props.title} onBack={props.onBack} />

      {props.isFiatFlow ? (
        <>
          <Spacer y="lg" />
          <StepBar steps={2} currentStep={2} />
          <Spacer y="sm" />
          <Text size="xs">
            Step 2 of 2 - Converting {props.fromTokenSymbol} to{" "}
            {props.toTokenSymbol}
          </Text>
          <Spacer y="md" />
        </>
      ) : (
        <>
          <Spacer y="lg" />
          <Text size="sm">Confirm payment</Text>
          <Spacer y="md" />
        </>
      )}

      <SwapSummary
        sender={sender}
        receiver={receiver}
        client={props.client}
        fromToken={props.fromToken}
        fromChain={props.fromChain}
        toToken={props.toToken}
        toChain={props.toChain}
        fromAmount={props.fromAmount}
        toAmount={props.toAmount}
      />

      <Spacer y="md" />

      {/* Show steps for each transaction */}
      {allTransactions.length > 1 &&
        !("sendBatchTransaction" in props.payer.account) && (
          <>
            <Spacer y="sm" />
            <Container
              gap="sm"
              flex="row"
              style={{
                justifyContent: "space-between",
              }}
              center="y"
              color="accentText"
            >
              {allTransactions.map((tx, index) => (
                <>
                  {index > 0 && <ConnectorLine key={`connector-${tx.id}`} />}
                  <Step
                    key={tx.id}
                    isDone={index < currentTransactionIndex}
                    isActive={index === currentTransactionIndex}
                    label={tx.action === "approval" ? "Approve" : "Confirm"}
                  />
                </>
              ))}
            </Container>
            <Spacer y="lg" />
          </>
        )}

      {uiErrorMessage && (
        <>
          <ErrorText
            title={uiErrorMessage.title}
            message={uiErrorMessage.message}
          />
          <Spacer y="md" />
        </>
      )}

      {props.payer.chain.id !== props.fromChain.id ? (
        <>
          <Spacer y="xs" />
          <SwitchNetworkButton
            fullWidth
            variant="accent"
            switchChain={async () => {
              await props.payer.wallet.switchChain(props.fromChain);
            }}
          />
        </>
      ) : (
        <>
          <Spacer y="xs" />
          <Button
            variant="accent"
            fullWidth
            disabled={status === "pending"}
            onClick={async () => {
              const wallet = props.payer.wallet;

              // in case the wallet is not on the same chain as the fromToken, switch to it
              if (wallet.getChain()?.id !== props.fromChain.id) {
                await wallet.switchChain(props.fromChain);
              }

              const account = wallet.getAccount();

              if (!account) {
                throw new Error("Payer wallet has no account");
              }

              // Handle step-by-step execution or batch execution
              if (!("sendBatchTransaction" in account)) {
                if (typeof currentTransaction === "undefined") {
                  throw new Error("No transaction to execute");
                }

                // Execute one transaction at a time
                try {
                  setStatus("pending");

                  const isApproval = currentTransaction.action === "approval";
                  trackPayEvent({
                    event: isApproval
                      ? "prompt_swap_approval"
                      : "prompt_swap_execution",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: firstStep.originToken.address,
                    amountWei: firstStep.originAmount.toString(),
                    toToken: firstStep.destinationToken.address,
                    toChainId: firstStep.destinationToken.chainId,
                    chainId: firstStep.originToken.chainId,
                  });

                  const tx = await sendTransaction({
                    account: account,
                    transaction: currentTransaction,
                  });

                  await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

                  trackPayEvent({
                    event: isApproval
                      ? "swap_approval_success"
                      : "swap_execution_success",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: firstStep.originToken.address,
                    amountWei: firstStep.originAmount.toString(),
                    toToken: firstStep.destinationToken.address,
                    toChainId: firstStep.destinationToken.chainId,
                    chainId: firstStep.originToken.chainId,
                  });

                  // Move to next transaction or complete
                  if (isLastTransaction) {
                    // do not add pending tx if the swap is part of fiat flow
                    if (!props.isFiatFlow) {
                      addPendingTx({
                        type: "swap",
                        txHash: tx.transactionHash,
                        chainId: tx.chain.id,
                      });
                    }
                    props.setSwapTxHash(tx.transactionHash);
                  } else {
                    setCurrentTransactionIndex(currentTransactionIndex + 1);
                    setStatus("idle");
                  }
                } catch (e) {
                  console.error(e);
                  setError((e as Error).message);
                  setStatus("error");
                }
              } else {
                // Execute all transactions as a batch (smart account only)
                try {
                  setStatus("pending");

                  trackPayEvent({
                    event: "prompt_swap_execution",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: firstStep.originToken.address,
                    amountWei: firstStep.originAmount.toString(),
                    toToken: firstStep.destinationToken.address,
                    toChainId: firstStep.destinationToken.chainId,
                    chainId: firstStep.originToken.chainId,
                  });

                  const _swapTx = await sendBatchTransaction({
                    account: account,
                    transactions: allTransactions,
                  });

                  trackPayEvent({
                    event: "swap_execution_success",
                    client: props.client,
                    walletAddress: account.address,
                    walletType: wallet.id,
                    fromToken: firstStep.originToken.address,
                    amountWei: firstStep.originAmount.toString(),
                    toToken: firstStep.destinationToken.address,
                    toChainId: firstStep.destinationToken.chainId,
                    chainId: firstStep.originToken.chainId,
                  });

                  // do not add pending tx if the swap is part of fiat flow
                  if (!props.isFiatFlow) {
                    addPendingTx({
                      type: "swap",
                      txHash: _swapTx.transactionHash,
                      chainId: _swapTx.chain.id,
                    });
                  }

                  props.setSwapTxHash(_swapTx.transactionHash);
                } catch (e) {
                  console.error(e);
                  setStatus("error");
                  setError((e as Error).message);
                }
              }
            }}
            gap="xs"
          >
            {currentTransaction?.action === "approval" &&
              (status === "pending" ? "Approving" : "Approve")}
            {currentTransaction?.action !== "approval" &&
              (status === "pending" ? "Confirming" : "Confirm")}
            {status === "pending" && (
              <Spinner size="sm" color="accentButtonText" />
            )}
          </Button>
        </>
      )}
    </Container>
  );
}

export const ConnectorLine = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    height: "4px",
    background: theme.colors.borderColor,
    flex: 1,
  };
});
