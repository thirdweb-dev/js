import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { transfer } from "../../../../../../../extensions/erc20/write/transfer.js";
import { sendAndConfirmTransaction } from "../../../../../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../../../../../../transaction/prepare-transaction.js";
import { toWei } from "../../../../../../../utils/units.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
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

type TrasnferFlowProps = {
  title: string;
  onBack?: () => void;
  payer: PayerInfo;
  receiverAddress: string;
  client: ThirdwebClient;
  onDone: () => void;
  chain: Chain;
  token: ERC20OrNativeToken;
  tokenAmount: string;
  transactionMode?: boolean;
};

export function TransferFlow(props: TrasnferFlowProps) {
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
  } = props;
  const [step, setStep] = useState<"transfer" | "execute">("transfer");
  const [status, setStatus] = useState<"idle" | "pending" | "error" | "done">(
    "idle",
  );
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
        label={"Amount"}
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

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="both" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "transfer" ? "Failed to Transfer" : "Failed to Execute"}
            </Text>
          </Container>
          <Spacer y="md" />
        </>
      )}

      {!transactionMode && step === "execute" && status === "done" && (
        <>
          <Container flex="row" gap="xs" center="both" color="success">
            <CheckCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="success" size="sm">
              {"Payment completed"}
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
          disabled={status === "pending"}
          onClick={async () => {
            if (step === "execute") {
              onDone();
              return;
            }

            try {
              setStatus("pending");

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

              setStep("execute");
              if (transactionMode) {
                setStatus("idle");
              } else {
                setStatus("done");
              }
            } catch (e) {
              console.error(e);
              setStatus("error");
            }
          }}
          gap="xs"
        >
          {step === "execute" && (status === "done" ? "Done" : "Continue")}
          {step === "transfer" &&
            (status === "pending" ? "Confirming" : "Confirm")}
          {status === "pending" && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
      )}
    </Container>
  );
}
