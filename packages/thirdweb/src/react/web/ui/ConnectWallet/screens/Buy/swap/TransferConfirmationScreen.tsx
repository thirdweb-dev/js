import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { allowance } from "../../../../../../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import { transfer } from "../../../../../../../extensions/erc20/write/transfer.js";
import { getBuyWithCryptoTransfer } from "../../../../../../../pay/buyWithCrypto/getTransfer.js";
import { sendAndConfirmTransaction } from "../../../../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../../../../../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../../../utils/address.js";
import { toWei } from "../../../../../../../utils/units.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainSymbol } from "../../../../../../core/hooks/others/useChainQuery.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { StepBar } from "../../../../components/StepBar.js";
import { SwitchNetworkButton } from "../../../../components/SwitchNetwork.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import { WalletRow } from "../WalletSelectorButton.js";
import { TokenInfoRow } from "../pay-transactions/TokenInfoRow.js";
import type { PayerInfo } from "../types.js";
import { ConnectorLine } from "./ConfirmationScreen.js";

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
  const { symbol } = useChainSymbol(chain);

  return (
    <Container p="lg">
      <ModalHeader title={title} onBack={onBack} />
      <Spacer y="xl" />

      {transactionMode && (
        <>
          <StepBar steps={2} currentStep={step === "transfer" ? 1 : 2} />
          <Spacer y="sm" />
          <Text size="sm">
            {step === "transfer"
              ? "Step 1 of 2 - Transfer funds"
              : "Step 2 of 2 - Finalize transaction"}
          </Text>
          <Spacer y="xl" />
        </>
      )}

      {/* Sender Address */}
      <Container
        flex="row"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">From</Text>
        <WalletRow address={payer.account.address} client={client} />
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="md" />

      {/* Receiver Address */}
      <Container
        flex="row"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">To</Text>
        <WalletRow address={receiverAddress} client={client} />
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="md" />

      {/* Token Info */}
      <TokenInfoRow
        chainId={chain.id}
        client={client}
        label="Amount"
        tokenAmount={tokenAmount}
        tokenSymbol={isNativeToken(token) ? symbol || "" : token.symbol}
        tokenAddress={
          isNativeToken(token) ? NATIVE_TOKEN_ADDRESS : token.address
        }
      />

      <Spacer y="lg" />

      {transactionMode && (
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
            <Step
              isDone={step === "execute"}
              isActive={step === "transfer"}
              label={step === "transfer" ? "Transfer" : "Done"}
            />
            <ConnectorLine />
            <Step
              isDone={false}
              label="Finalize"
              isActive={step === "execute"}
            />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {status.id === "error" && (
        <>
          <Container flex="row" gap="xs" center="both" color="danger">
            <Text color="danger" size="sm" style={{ textAlign: "center" }}>
              {step === "transfer"
                ? `${status.error || "Failed to Transfer"}`
                : "Failed to Execute"}
            </Text>
          </Container>
          <Spacer y="md" />
        </>
      )}

      {!transactionMode && step === "execute" && status.id === "done" && (
        <>
          <Container flex="row" gap="xs" center="both" color="success">
            <CheckCircledIcon width={iconSize.sm} height={iconSize.sm} />
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
          variant="accent"
          switchChain={async () => {
            await props.payer.wallet.switchChain(chain);
          }}
        />
      ) : (
        <Button
          variant="accent"
          fullWidth
          disabled={status.id === "pending"}
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
                      client,
                      chain,
                      to: receiverAddress,
                      value: toWei(tokenAmount),
                    })
                  : transfer({
                      contract: getContract({
                        address: token.address,
                        chain: chain,
                        client: client,
                      }),
                      to: receiverAddress,
                      amount: tokenAmount,
                    });
                await sendAndConfirmTransaction({
                  account: props.payer.account,
                  transaction,
                });
                // switch to execute step
                setStep("execute");
                setStatus({ id: "idle" });
              } else {
                const transferResponse = await getBuyWithCryptoTransfer({
                  client,
                  fromAddress: payer.account.address,
                  toAddress: receiverAddress,
                  chainId: chain.id,
                  tokenAddress: isNativeToken(token)
                    ? NATIVE_TOKEN_ADDRESS
                    : token.address,
                  amount: tokenAmount,
                  purchaseData: payOptions?.purchaseData,
                });

                if (transferResponse.approvalData) {
                  // check allowance
                  const prevAllowance = await allowance({
                    contract: getContract({
                      client: client,
                      address: transferResponse.approvalData.tokenAddress,
                      chain: getCachedChain(
                        transferResponse.approvalData.chainId,
                      ),
                    }),
                    spender: transferResponse.approvalData
                      .spenderAddress as Address,
                    owner: payer.account.address,
                  });

                  if (
                    prevAllowance <
                    BigInt(transferResponse.approvalData.amountWei)
                  ) {
                    setStep("approve");
                    const transaction = approve({
                      contract: getContract({
                        client: client,
                        address: transferResponse.approvalData.tokenAddress,
                        chain: getCachedChain(
                          transferResponse.approvalData.chainId,
                        ),
                      }),
                      spender: transferResponse.approvalData
                        .spenderAddress as Address,
                      amountWei: BigInt(
                        transferResponse.approvalData.amountWei,
                      ),
                    });
                    // approve the transfer
                    await sendAndConfirmTransaction({
                      account: props.payer.account,
                      transaction,
                    });
                  }
                }

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
              }
              // biome-ignore lint/suspicious/noExplicitAny: catch multiple errors
            } catch (e: any) {
              console.error(e);
              setStatus({
                id: "error",
                error: "error" in e ? e.error?.message : e?.message,
              });
            }
          }}
          gap="xs"
        >
          {step === "execute" && (status.id === "done" ? "Done" : "Continue")}
          {step === "transfer" &&
            (status.id === "pending" ? "Confirming" : "Confirm")}
          {step === "approve" &&
            (status.id === "pending" ? "Approving" : "Approve")}
          {status.id === "pending" && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
      )}
    </Container>
  );
}
