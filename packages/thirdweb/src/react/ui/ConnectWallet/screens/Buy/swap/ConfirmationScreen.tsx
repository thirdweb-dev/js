import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { SwapTransaction } from "../../../../../../pay/swap/actions/getStatus.js";
import type { SwapQuote } from "../../../../../../pay/swap/actions/getSwap.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useSendSwapTransaction } from "../../../../../hooks/pay/useSendSwapTransaction.js";
import { useSwapStatus } from "../../../../../hooks/pay/useSwapStatus.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize, radius, spacing } from "../../../../design-system/index.js";
import { isNativeToken, type ERC20OrNativeToken } from "../../nativeToken.js";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { useSendSwapApproval } from "../../../../../hooks/pay/useSendSwapApproval.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { shortenString } from "../../../../../utils/addresses.js";
import { SwapFees } from "./SwapFees.js";

/**
 * @internal
 */
export function ConfirmationScreen(props: {
  onBack: () => void;
  swapQuote: SwapQuote;
  fromAmount: string;
  toAmount: string;
  fromChain: Chain;
  toChain: Chain;
  account: Account;
  fromToken: ERC20OrNativeToken;
  toToken: ERC20OrNativeToken;
  // onCompleted: () => void;
}) {
  const sendSwapMutation = useSendSwapTransaction();
  const sendSwapApprovalMutation = useSendSwapApproval();
  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
  const [step, setStep] = useState<"approval" | "swap">(
    props.swapQuote.approval ? "approval" : "swap",
  );
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const fromChain = useChainQuery(props.fromChain);
  const toChain = useChainQuery(props.toChain);

  const fromTokenSymbol = isNativeToken(props.fromToken)
    ? fromChain.data?.nativeCurrency?.symbol
    : props.fromToken?.symbol;
  const toTokenSymbol = isNativeToken(props.toToken)
    ? toChain.data?.nativeCurrency?.symbol
    : props.toToken?.symbol;

  if (swapTx) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          props.onBack();
        }}
        swapTx={swapTx}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="lg" />

      {/* You Pay */}
      <TokenSelection
        label="You Pay"
        chain={props.fromChain}
        amount={Number(props.fromAmount).toFixed(3)}
        symbol={fromTokenSymbol || ""}
      />
      <Spacer y="lg" />

      <TokenSelection
        label="You receive"
        chain={props.toChain}
        amount={Number(props.toAmount).toFixed(3)}
        symbol={toTokenSymbol || ""}
      />

      <Spacer y="lg" />
      <Text size="sm" color="secondaryText">
        Recipient Address
      </Text>
      <Spacer y="xs" />
      <BorderBox>
        <Text color="primaryText" size="md" weight={500}>
          {shortenString(props.account.address)}
        </Text>
      </BorderBox>

      <SwapFees quote={props.swapQuote} />

      <Spacer y="lg" />

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="y" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Approval Rejected" : "Swap Rejected"}
            </Text>
          </Container>

          <Spacer y="lg" />
        </>
      )}

      <Button
        variant="accent"
        fullWidth
        onClick={async () => {
          if (step === "approval" && props.swapQuote.approval) {
            try {
              setStatus("pending");
              await sendSwapApprovalMutation.mutateAsync(
                props.swapQuote.approval,
              );
              setStep("swap");
              setStatus("idle");
            } catch {
              setStatus("error");
            }
          }

          if (step === "swap") {
            setStatus("pending");
            try {
              const _swapTx = await sendSwapMutation.mutateAsync(
                props.swapQuote,
              );
              setSwapTx(_swapTx);
            } catch {
              setStatus("error");
            }
          }
        }}
        gap="xs"
      >
        {step === "approval" ? "Approve" : "Swap"}
        {status === "pending" && <Spinner size="sm" color="accentButtonText" />}
      </Button>
    </Container>
  );
}

function TokenSelection(props: {
  label: string;
  chain: Chain;
  amount: string;
  symbol: string;
}) {
  const chainQuery = useChainQuery(props.chain);
  return (
    <div>
      <Text size="sm" color="secondaryText">
        {props.label}
      </Text>
      <Spacer y="xs" />
      <BorderBox>
        <Container flex="row" gap="sm" center="y">
          <Text color="primaryText" size="lg" weight={500}>
            {props.amount}
          </Text>
          <Container flex="row" center="y" gap="xs">
            <ChainIcon size={iconSize.md} chain={chainQuery.data} />
            <Text color="primaryText" size="xs" weight={500}>
              {props.symbol}
            </Text>
          </Container>
        </Container>
      </BorderBox>
    </div>
  );
}

function WaitingForConfirmation(props: {
  onBack: () => void;
  swapTx: SwapTransaction;
}) {
  const swapStatus = useSwapStatus(props.swapTx);
  const isSuccess = swapStatus.data?.status === "DONE";
  const isFailed = swapStatus.data?.status === "FAILED";
  const isPending = !isSuccess && !isFailed;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="xxl" />
        <Spacer y="xxl" />
        <Container
          flex="column"
          animate="fadein"
          center="both"
          color={isSuccess ? "success" : isFailed ? "danger" : "accentText"}
        >
          {isSuccess ? (
            <CheckCircledIcon width={iconSize.xxl} height={iconSize.xxl} />
          ) : isFailed ? (
            <CrossCircledIcon width={iconSize.xxl} height={iconSize.xxl} />
          ) : (
            <Spinner size="xxl" color="accentText" />
          )}

          <Spacer y="xxl" />
          <Spacer y="xxl" />

          <Text color={"primaryText"} size="lg">
            {" "}
            {isSuccess
              ? "Buy Success"
              : isFailed
                ? "Buy Failed"
                : "Buy Pending"}{" "}
          </Text>

          {isPending && (
            <>
              <Spacer y="md" />
              <Text size="sm">Your transaction is currently pending</Text>
            </>
          )}
        </Container>

        <Spacer y="xl" />

        <Button variant="accent" fullWidth onClick={props.onBack}>
          Continue Buying
        </Button>
      </Container>
    </Container>
  );
}

const BorderBox = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    padding: spacing.sm,
    borderRadius: radius.md,
    border: `1px solid ${theme.colors.borderColor}`,
    height: "51px",
    display: "flex",
    alignItems: "center",
  };
});
