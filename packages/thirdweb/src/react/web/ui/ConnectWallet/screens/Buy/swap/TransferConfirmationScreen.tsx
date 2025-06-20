import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { allowance } from "../../../../../../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import {
  type GetCurrencyMetadataResult,
  getCurrencyMetadata,
} from "../../../../../../../extensions/erc20/read/getCurrencyMetadata.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import { transfer } from "../../../../../../../extensions/erc20/write/transfer.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { getBuyWithCryptoTransfer } from "../../../../../../../pay/buyWithCrypto/getTransfer.js";
import { sendAndConfirmTransaction } from "../../../../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../../../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../../../../transaction/types.js";
import type { Address } from "../../../../../../../utils/address.js";
import { toWei } from "../../../../../../../utils/units.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Text } from "../../../../components/text.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import type { PayerInfo } from "../types.js";
import { ConnectorLine } from "./ConfirmationScreen.js";
import { ErrorText } from "./ErrorText.js";
import { SwapSummary } from "./SwapSummary.js";

type TransferConfirmationScreenProps = {
  title: string;
  onBack?: () => void;
  setTransactionHash: (txHash: string) => void;
  payer: PayerInfo;
  receiverAddress: string;
  client: ThirdwebClient;
  onDone: () => void;
  chain: Chain;
  token: ERC20OrNativeToken;
  tokenAmount: string;
  transactionMode?: boolean;
  payOptions?: PayUIOptions;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
  paymentLinkId: undefined | string;
};

export function TransferConfirmationScreen(
  props: TransferConfirmationScreenProps,
) {
  const {
    title,
    onBack,
    receiverAddress,
    client,
    payer,
    onDone,
    chain,
    token,
    tokenAmount,
    transactionMode,
    setTransactionHash,
    payOptions,
    paymentLinkId,
  } = props;
  const [step, setStep] = useState<"approve" | "transfer" | "execute">(
    "transfer",
  );
  const [status, setStatus] = useState<
    | { id: "idle" }
    | { id: "pending" }
    | { id: "error"; error: string }
    | { id: "done" }
  >({ id: "idle" });

  const transferQuery = useQuery({
    queryFn: async () => {
      const transferResponse = await getBuyWithCryptoTransfer({
        amount: tokenAmount,
        chainId: chain.id,
        client,
        feePayer:
          payOptions?.mode === "direct_payment"
            ? payOptions.paymentInfo.feePayer
            : undefined,
        fromAddress: payer.account.address,
        paymentLinkId: paymentLinkId,
        purchaseData: payOptions?.purchaseData,
        toAddress: receiverAddress,
        tokenAddress: isNativeToken(token)
          ? NATIVE_TOKEN_ADDRESS
          : token.address,
      });
      return transferResponse;
    },
    queryKey: [
      "transfer",
      isNativeToken(token) ? NATIVE_TOKEN_ADDRESS : token.address,
      tokenAmount,
      receiverAddress,
      payer.account.address,
      payOptions?.purchaseData,
    ],
    refetchInterval: 30 * 1000,
  });

  const uiErrorMessage = useMemo(() => {
    if (step === "approve" && status.id === "error" && status.error) {
      if (
        status.error.toLowerCase().includes("user rejected") ||
        status.error.toLowerCase().includes("user closed modal") ||
        status.error.toLowerCase().includes("user denied")
      ) {
        return {
          message: "Your wallet rejected the approval request.",
          title: "Failed to Approve",
        };
      }
      if (status.error.toLowerCase().includes("insufficient funds for gas")) {
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

    if (
      (step === "transfer" || step === "execute") &&
      status.id === "error" &&
      status.error
    ) {
      if (
        status.error.toLowerCase().includes("user rejected") ||
        status.error.toLowerCase().includes("user closed modal") ||
        status.error.toLowerCase().includes("user denied")
      ) {
        return {
          message: "Your wallet rejected the confirmation request.",
          title: "Failed to Confirm",
        };
      }
      if (status.error.toLowerCase().includes("insufficient funds for gas")) {
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
  }, [step, status]);

  if (transferQuery.isLoading) {
    return (
      <Container p="lg">
        <ModalHeader onBack={onBack} title={title} />
        <Container center="both" flex="column" style={{ minHeight: "300px" }}>
          <Spacer y="xl" />
          <Spinner color="secondaryText" size="xl" />
          <Spacer y="xl" />
        </Container>
      </Container>
    );
  }

  const transferFromAmountWithFees =
    transferQuery.data?.paymentToken.amount || tokenAmount;

  return (
    <Container p="lg">
      <ModalHeader onBack={onBack} title={title} />
      <Spacer y="xl" />

      {transactionMode ? (
        <>
          <StepBar currentStep={step === "transfer" ? 1 : 2} steps={2} />
          <Spacer y="sm" />
          <Text size="sm">
            {step === "transfer"
              ? "Step 1 of 2 - Transfer funds"
              : "Step 2 of 2 - Finalize transaction"}
          </Text>
          <Spacer y="md" />
        </>
      ) : (
        <>
          <Text size="sm">Confirm payment</Text>
          <Spacer y="md" />
        </>
      )}

      <SwapSummary
        client={client}
        fromAmount={transactionMode ? tokenAmount : transferFromAmountWithFees}
        fromChain={chain}
        fromToken={token}
        receiver={receiverAddress}
        sender={payer.account.address}
        toAmount={tokenAmount}
        toChain={chain}
        toToken={token}
      />

      <Spacer y="lg" />

      {transactionMode && (
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
              isActive={step === "transfer"}
              isDone={step === "execute"}
              label={step === "transfer" ? "Transfer" : "Done"}
            />
            <ConnectorLine />
            <Step
              isActive={step === "execute"}
              isDone={false}
              label="Finalize"
            />
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

      {!transactionMode && step === "execute" && status.id === "done" && (
        <>
          <Container center="both" color="success" flex="row" gap="xs">
            <CheckCircledIcon height={iconSize.sm} width={iconSize.sm} />
            <Text color="success" size="sm">
              Payment completed
            </Text>
          </Container>
          <Spacer y="md" />
        </>
      )}

      {/* Execute */}
      {payer.chain.id !== chain.id ? (
        <SwitchNetworkButton
          fullWidth
          switchChain={async () => {
            await props.payer.wallet.switchChain(chain);
          }}
          variant="accent"
        />
      ) : (
        <Button
          disabled={status.id === "pending"}
          fullWidth
          gap="xs"
          onClick={async () => {
            if (step === "execute") {
              onDone();
              return;
            }

            try {
              setStatus({ id: "pending" });

              // TRANSACTION MODE = transfer funds to another one of your wallets before executing the tx
              if (transactionMode) {
                const transaction = isNativeToken(token)
                  ? prepareTransaction({
                      chain,
                      client,
                      to: receiverAddress,
                      value: toWei(tokenAmount),
                    })
                  : transfer({
                      amount: tokenAmount,
                      contract: getContract({
                        address: token.address,
                        chain: chain,
                        client: client,
                      }),
                      to: receiverAddress,
                    });
                const [txResult, tokenMetadata] = await Promise.all([
                  sendAndConfirmTransaction({
                    account: props.payer.account,
                    transaction,
                  }),
                  getCurrencyMetadata({
                    contract: getContract({
                      address: isNativeToken(token)
                        ? NATIVE_TOKEN_ADDRESS
                        : token.address,
                      chain: chain,
                      client: client,
                    }),
                  }),
                ]);
                trackPayEvent({
                  client: props.client,
                  event: "transfer_confirmation_success_transaction_mode",
                  toChainId: chain.id,
                  toToken: isNativeToken(token) ? undefined : token.address,
                  walletAddress: payer.account.address,
                  walletType: payer.wallet.id,
                });
                // its the last step before the transaction, so propagate onPurchaseSuccess here
                props.onSuccess?.(
                  transferBuyWithCryptoQuote({
                    chain,
                    fromAddress: payer.account.address,
                    toAddress: receiverAddress,
                    token,
                    tokenAmount: transactionMode
                      ? tokenAmount
                      : transferFromAmountWithFees,
                    tokenMetadata,
                    transaction: txResult,
                  }),
                );
                // switch to execute step
                setStep("execute");
                setStatus({ id: "idle" });
              } else {
                const transferResponse = transferQuery.data;

                if (!transferResponse) {
                  throw new Error("Transfer data not found");
                }

                if (transferResponse.approvalData) {
                  // check allowance
                  const prevAllowance = await allowance({
                    contract: getContract({
                      address: transferResponse.approvalData.tokenAddress,
                      chain: getCachedChain(
                        transferResponse.approvalData.chainId,
                      ),
                      client: client,
                    }),
                    owner: payer.account.address,
                    spender: transferResponse.approvalData
                      .spenderAddress as Address,
                  });

                  if (
                    prevAllowance <
                    BigInt(transferResponse.approvalData.amountWei)
                  ) {
                    setStep("approve");
                    trackPayEvent({
                      client: props.client,
                      event: "prompt_transfer_approval",
                      toChainId: chain.id,
                      toToken: isNativeToken(token) ? undefined : token.address,
                      walletAddress: payer.account.address,
                      walletType: payer.wallet.id,
                    });
                    const transaction = approve({
                      amountWei: BigInt(
                        transferResponse.approvalData.amountWei,
                      ),
                      contract: getContract({
                        address: transferResponse.approvalData.tokenAddress,
                        chain: getCachedChain(
                          transferResponse.approvalData.chainId,
                        ),
                        client: client,
                      }),
                      spender: transferResponse.approvalData
                        .spenderAddress as Address,
                    });
                    // approve the transfer
                    await sendAndConfirmTransaction({
                      account: props.payer.account,
                      transaction,
                    });
                    trackPayEvent({
                      client: props.client,
                      event: "transfer_approval_success",
                      toChainId: chain.id,
                      toToken: isNativeToken(token) ? undefined : token.address,
                      walletAddress: payer.account.address,
                      walletType: payer.wallet.id,
                    });
                  }
                }

                trackPayEvent({
                  client: props.client,
                  event: "prompt_transfer_confirmation",
                  toChainId: chain.id,
                  toToken: isNativeToken(token) ? undefined : token.address,
                  walletAddress: payer.account.address,
                  walletType: payer.wallet.id,
                });

                setStep("transfer");
                // execute the transfer
                const transaction = transferResponse.transactionRequest;
                const tx = await sendTransaction({
                  account: props.payer.account,
                  transaction,
                });
                // switches to the status polling screen
                setTransactionHash(tx.transactionHash);
                setStatus({ id: "idle" });

                trackPayEvent({
                  client: props.client,
                  event: "transfer_confirmation_success",
                  toChainId: chain.id,
                  toToken: isNativeToken(token) ? undefined : token.address,
                  walletAddress: payer.account.address,
                  walletType: payer.wallet.id,
                });
              }
              // biome-ignore lint/suspicious/noExplicitAny: catch multiple errors
            } catch (e: any) {
              console.error(e);
              setStatus({
                error: "error" in e ? e.error?.message : e?.message,
                id: "error",
              });
            }
          }}
          variant="accent"
        >
          {step === "execute" && (status.id === "done" ? "Done" : "Continue")}
          {step === "transfer" &&
            (status.id === "pending" ? "Confirming" : "Confirm")}
          {step === "approve" &&
            (status.id === "pending" ? "Approving" : "Approve")}
          {status.id === "pending" && (
            <Spinner color="accentButtonText" size="sm" />
          )}
        </Button>
      )}
    </Container>
  );
}

function transferBuyWithCryptoQuote(args: {
  token: ERC20OrNativeToken;
  chain: Chain;
  tokenMetadata: GetCurrencyMetadataResult;
  tokenAmount: string;
  fromAddress: string;
  toAddress: string;
  transaction: TransactionReceipt;
}): BuyWithCryptoStatus {
  const {
    token,
    chain,
    tokenMetadata,
    tokenAmount,
    fromAddress,
    toAddress,
    transaction,
  } = args;
  return {
    fromAddress,
    quote: {
      createdAt: new Date().toISOString(),
      estimated: {
        durationSeconds: 0,
        feesUSDCents: 0,
        fromAmountUSDCents: 0,
        gasCostUSDCents: 0,
        slippageBPS: 0,
        toAmountMinUSDCents: 0,
        toAmountUSDCents: 0,
      },
      fromAmount: tokenAmount,
      fromAmountWei: toWei(tokenAmount).toString(),
      fromToken: {
        chainId: chain.id,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        priceUSDCents: 0,
        symbol: tokenMetadata.symbol,
        tokenAddress: isNativeToken(token)
          ? NATIVE_TOKEN_ADDRESS
          : token.address,
      },
      toAmount: tokenAmount,
      toAmountMin: tokenAmount,
      toAmountMinWei: toWei(tokenAmount).toString(),
      toAmountWei: toWei(tokenAmount).toString(),
      toToken: {
        chainId: chain.id,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        priceUSDCents: 0,
        symbol: tokenMetadata.symbol,
        tokenAddress: isNativeToken(token)
          ? NATIVE_TOKEN_ADDRESS
          : token.address,
      },
    },
    source: {
      amount: tokenAmount,
      amountUSDCents: 0,
      amountWei: toWei(tokenAmount).toString(),
      completedAt: new Date().toISOString(),
      token: {
        chainId: chain.id,
        decimals: tokenMetadata.decimals,
        name: tokenMetadata.name,
        priceUSDCents: 0,
        symbol: tokenMetadata.symbol,
        tokenAddress: isNativeToken(token)
          ? NATIVE_TOKEN_ADDRESS
          : token.address,
      },
      transactionHash: transaction.transactionHash,
    },
    status: "COMPLETED",
    subStatus: "SUCCESS",
    swapType: "TRANSFER",
    toAddress,
  };
}
