import { useMemo, useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { sendBatchTransaction } from "../../../../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import {
  type WaitForReceiptOptions,
  waitForReceipt,
} from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Text } from "../../../../components/text.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import type { PayerInfo } from "../types.js";
import { ErrorText } from "./ErrorText.js";
import { addPendingTx } from "./pendingSwapTx.js";
import { SwapSummary } from "./SwapSummary.js";

/**
 * @internal
 */
export function SwapConfirmationScreen(props: {
  title: string;
  onBack?: () => void;
  client: ThirdwebClient;
  quote: BuyWithCryptoQuote;
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
  preApprovedAmount?: bigint;
}) {
  const approveTxRequired =
    props.quote.approvalData &&
    props.preApprovedAmount !== undefined &&
    props.preApprovedAmount < BigInt(props.quote.approvalData.amountWei);
  const needsApprovalStep =
    approveTxRequired && !props.payer.account.sendBatchTransaction;
  const initialStep = needsApprovalStep ? "approval" : "swap";

  const [step, setStep] = useState<"approval" | "swap">(initialStep);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const receiver = props.quote.swapDetails.toAddress;
  const sender = props.quote.swapDetails.fromAddress;

  const uiErrorMessage = useMemo(() => {
    if (step === "approval" && status === "error" && error) {
      if (
        error.toLowerCase().includes("user rejected") ||
        error.toLowerCase().includes("user closed modal") ||
        error.toLowerCase().includes("user denied")
      ) {
        return {
          message: "Your wallet rejected the approval request.",
          title: "Failed to Approve",
        };
      }
      if (error.toLowerCase().includes("insufficient funds for gas")) {
        return {
          message:
            "You do not have enough native funds to approve the transaction.",
          title: "Insufficient Native Funds",
        };
      }
      return {
        message:
          "Your wallet failed to approve the transaction for an unknown reason. Please try again or contact support.",
        title: "Failed to Approve",
      };
    }

    if (step === "swap" && status === "error" && error) {
      if (
        error.toLowerCase().includes("user rejected") ||
        error.toLowerCase().includes("user closed modal") ||
        error.toLowerCase().includes("user denied")
      ) {
        return {
          message: "Your wallet rejected the confirmation request.",
          title: "Failed to Confirm",
        };
      }
      if (error.toLowerCase().includes("insufficient funds for gas")) {
        return {
          message:
            "You do not have enough native funds to confirm the transaction.",
          title: "Insufficient Native Funds",
        };
      }
      return {
        message:
          "Your wallet failed to confirm the transaction for an unknown reason. Please try again or contact support.",
        title: "Failed to Confirm",
      };
    }

    return undefined;
  }, [error, step, status]);

  return (
    <Container p="lg">
      <ModalHeader onBack={props.onBack} title={props.title} />

      {props.isFiatFlow ? (
        <>
          <Spacer y="lg" />
          <StepBar currentStep={2} steps={2} />
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
        client={props.client}
        fromAmount={props.fromAmount}
        fromChain={props.fromChain}
        fromToken={props.fromToken}
        receiver={receiver}
        sender={sender}
        toAmount={props.toAmount}
        toChain={props.toChain}
        toToken={props.toToken}
      />

      <Spacer y="md" />

      {/* Show 2 steps - Approve and confirm  */}
      {needsApprovalStep && (
        <>
          <Spacer y="sm" />
          <Container
            center="y"
            color="accentText"
            flex="row"
            gap="sm"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Step
              isActive={step === "approval"}
              isDone={step === "swap"}
              label={step === "approval" ? "Approve" : "Approved"}
            />
            <ConnectorLine />
            <Step isActive={step === "swap"} isDone={false} label="Confirm" />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {uiErrorMessage && (
        <>
          <ErrorText
            message={uiErrorMessage.message}
            title={uiErrorMessage.title}
          />
          <Spacer y="md" />
        </>
      )}

      {props.payer.chain.id !== props.fromChain.id ? (
        <>
          <Spacer y="xs" />
          <SwitchNetworkButton
            fullWidth
            switchChain={async () => {
              await props.payer.wallet.switchChain(props.fromChain);
            }}
            variant="accent"
          />
        </>
      ) : (
        <>
          <Spacer y="xs" />
          <Button
            disabled={status === "pending"}
            fullWidth
            gap="xs"
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

              if (step === "approval" && props.quote.approvalData) {
                try {
                  setStatus("pending");

                  trackPayEvent({
                    amountWei: props.quote.swapDetails.fromAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    client: props.client,
                    event: "prompt_swap_approval",
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    toChainId: props.quote.swapDetails.toToken.chainId,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    walletAddress: account.address,
                    walletType: wallet.id,
                  });

                  const transaction = approve({
                    amountWei: BigInt(props.quote.approvalData.amountWei),
                    contract: getContract({
                      address: props.quote.swapDetails.fromToken.tokenAddress,
                      chain: props.fromChain,
                      client: props.client,
                    }),
                    spender: props.quote.approvalData.spenderAddress,
                  });

                  const tx = await sendTransaction({
                    account: account,
                    transaction,
                  });

                  await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });

                  trackPayEvent({
                    amountWei: props.quote.swapDetails.fromAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    client: props.client,
                    event: "swap_approval_success",
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    toChainId: props.quote.swapDetails.toToken.chainId,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    walletAddress: account.address,
                    walletType: wallet.id,
                  });

                  setStep("swap");
                  setStatus("idle");
                } catch (e) {
                  console.error(e);
                  setError((e as Error).message);
                  setStatus("error");
                }
              }

              if (step === "swap") {
                setStatus("pending");
                try {
                  trackPayEvent({
                    amountWei: props.quote.swapDetails.fromAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    client: props.client,
                    event: "prompt_swap_execution",
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    toChainId: props.quote.swapDetails.toToken.chainId,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    walletAddress: account.address,
                    walletType: wallet.id,
                  });
                  const tx = props.quote.transactionRequest;
                  let _swapTx: WaitForReceiptOptions;
                  // check if we can batch approval and swap
                  const canBatch = account.sendBatchTransaction;
                  if (
                    canBatch &&
                    props.quote.approvalData &&
                    approveTxRequired
                  ) {
                    const approveTx = approve({
                      amountWei: BigInt(props.quote.approvalData.amountWei),
                      contract: getContract({
                        address: props.quote.swapDetails.fromToken.tokenAddress,
                        chain: props.fromChain,
                        client: props.client,
                      }),
                      spender: props.quote.approvalData.spenderAddress,
                    });

                    _swapTx = await sendBatchTransaction({
                      account: account,
                      transactions: [approveTx, tx],
                    });
                  } else {
                    _swapTx = await sendTransaction({
                      account: account,
                      transaction: tx,
                    });
                  }

                  trackPayEvent({
                    amountWei: props.quote.swapDetails.fromAmountWei,
                    chainId: props.quote.swapDetails.fromToken.chainId,
                    client: props.client,
                    event: "swap_execution_success",
                    fromToken: props.quote.swapDetails.fromToken.tokenAddress,
                    toChainId: props.quote.swapDetails.toToken.chainId,
                    toToken: props.quote.swapDetails.toToken.tokenAddress,
                    walletAddress: account.address,
                    walletType: wallet.id,
                  });

                  // do not add pending tx if the swap is part of fiat flow
                  if (!props.isFiatFlow) {
                    addPendingTx({
                      chainId: _swapTx.chain.id,
                      txHash: _swapTx.transactionHash,
                      type: "swap",
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
            variant="accent"
          >
            {step === "approval" &&
              (status === "pending" ? "Approving" : "Approve")}
            {step === "swap" &&
              (status === "pending" ? "Confirming" : "Confirm")}
            {status === "pending" && (
              <Spinner color="accentButtonText" size="sm" />
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
    background: theme.colors.borderColor,
    flex: 1,
    height: "4px",
  };
});
