import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { waitForReceipt } from "../../../../../../../transaction/actions/wait-for-tx-receipt.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import { useSendTransactionCore } from "../../../../../../core/hooks/contract/useSendTransaction.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import {
  type BuyWithCryptoStatusQueryParams,
  useBuyWithCryptoStatus,
} from "../../../../../../core/hooks/pay/useBuyWithCryptoStatus.js";
import { shortenString } from "../../../../../../core/utils/addresses.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "../../nativeToken.js";
import { Step } from "../Stepper.js";
import { SwapFees } from "./Fees.js";
import { formatSeconds } from "./formatSeconds.js";
import { addPendingSwapTransaction } from "./pendingSwapTx.js";

/**
 * @internal
 */
export function SwapConfirmationScreen(props: {
  onBack: () => void;
  buyWithCryptoQuote: BuyWithCryptoQuote;
  account: Account;
  onViewPendingTx: () => void;
  onQuoteFinalized: (quote: BuyWithCryptoQuote) => void;
  client: ThirdwebClient;
}) {
  const sendTransactionMutation = useSendTransactionCore();

  const [swapTx, setSwapTx] = useState<
    BuyWithCryptoStatusQueryParams | undefined
  >();

  const isApprovalRequired = props.buyWithCryptoQuote.approval !== undefined;

  const [step, setStep] = useState<"approval" | "swap">(
    isApprovalRequired ? "approval" : "swap",
  );
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");

  const quote = props.buyWithCryptoQuote;

  const fromChain = useMemo(
    () => defineChain(quote.swapDetails.fromToken.chainId),
    [quote],
  );

  const toChain = useMemo(
    () => defineChain(quote.swapDetails.toToken.chainId),
    [quote],
  );

  const fromTokenSymbol = quote.swapDetails.fromToken.symbol || "";
  const toTokenSymbol = quote.swapDetails.toToken.symbol || "";

  const fromAmount = quote.swapDetails.fromAmount;
  const toAmount = quote.swapDetails.toAmount;

  const _toToken = quote.swapDetails.toToken;
  const _fromToken = quote.swapDetails.toToken;

  const toToken: ERC20OrNativeToken = useMemo(() => {
    if (_toToken.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      return NATIVE_TOKEN;
    }

    const tokenInfo: TokenInfo = {
      address: _toToken.tokenAddress,
      icon: "",
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
      icon: "",
      name: _fromToken.name || "",
      symbol: _fromToken.symbol || "",
    };
    return tokenInfo;
  }, [_fromToken]);

  if (swapTx) {
    return (
      <WaitingForConfirmation
        onBack={() => {
          props.onBack();
        }}
        onViewPendingTx={props.onViewPendingTx}
        destinationChain={toChain}
        destinationToken={toToken}
        sourceAmount={`${formatNumber(Number(fromAmount), 4)} ${
          fromTokenSymbol || ""
        }`}
        destinationAmount={`${formatNumber(Number(toAmount), 4)} ${
          toTokenSymbol || ""
        }`}
        swapTx={swapTx}
        client={props.client}
      />
    );
  }

  return (
    <Container p="lg">
      <ModalHeader title="Confirm Buy" onBack={props.onBack} />
      <Spacer y="lg" />

      {/* You Receive */}
      <ConfirmItem label="Receive">
        <RenderTokenInfo
          chain={toChain}
          amount={String(formatNumber(Number(toAmount), 4))}
          symbol={toTokenSymbol || ""}
          token={toToken}
          client={props.client}
        />
      </ConfirmItem>

      <ConfirmItem label="Pay">
        <RenderTokenInfo
          chain={fromChain}
          amount={String(formatNumber(Number(fromAmount), 4))}
          symbol={fromTokenSymbol || ""}
          token={fromToken}
          client={props.client}
        />
      </ConfirmItem>

      {/* Fees  */}
      <ConfirmItem label="Fees">
        <SwapFees quote={props.buyWithCryptoQuote} align="right" />
      </ConfirmItem>

      {/* Send to  */}
      <ConfirmItem label="Send to">
        <Text color="primaryText">
          {shortenString(props.account.address, false)}
        </Text>
      </ConfirmItem>

      {/* Time  */}
      <ConfirmItem label="Time">
        <Text color="primaryText">
          ~
          {formatSeconds(
            props.buyWithCryptoQuote.swapDetails.estimated.durationSeconds || 0,
          )}
        </Text>
      </ConfirmItem>

      <Spacer y="lg" />

      {/* Show 2 steps  */}
      {isApprovalRequired && (
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
              isDone={step === "swap"}
              isActive={step === "approval"}
              label={step === "approval" ? "Approve" : "Approved"}
            />
            <ConnectorLine />
            <Step isDone={false} label="Confirm" isActive={step === "swap"} />
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {status === "error" && (
        <>
          <Container flex="row" gap="xs" center="y" color="danger">
            <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
            <Text color="danger" size="sm">
              {step === "approval" ? "Failed to Approve" : "Failed to Confirm"}
            </Text>
          </Container>

          <Spacer y="md" />
        </>
      )}

      <Button
        variant="accent"
        fullWidth
        disabled={status === "pending"}
        onClick={async () => {
          if (step === "approval" && props.buyWithCryptoQuote.approval) {
            try {
              setStatus("pending");

              const tx = await sendTransactionMutation.mutateAsync(
                props.buyWithCryptoQuote.approval,
              );

              await waitForReceipt({ ...tx, maxBlocksWaitTime: 50 });
              props.onQuoteFinalized(props.buyWithCryptoQuote);

              setStep("swap");
              setStatus("idle");
            } catch (e) {
              console.error(e);
              setStatus("error");
            }
          }

          if (step === "swap") {
            setStatus("pending");
            try {
              const _swapTx = await sendTransactionMutation.mutateAsync(
                props.buyWithCryptoQuote.transactionRequest,
              );

              await waitForReceipt({ ..._swapTx, maxBlocksWaitTime: 50 });
              props.onQuoteFinalized(props.buyWithCryptoQuote);

              // these will be defined by this time
              if (fromTokenSymbol && toTokenSymbol && fromChain) {
                addPendingSwapTransaction(props.client, {
                  source: {
                    symbol: fromTokenSymbol,
                    value: fromAmount,
                    chainId: fromChain.id,
                  },
                  destination: {
                    symbol: toTokenSymbol,
                    value: toAmount,
                    chainId: toChain.id,
                  },
                  status: "PENDING",
                  transactionHash: _swapTx.transactionHash, // ?? _swapTx.userOpHash,
                });
              }

              setSwapTx({
                transactionHash: _swapTx.transactionHash, // ?? _swapTx.userOpHash,
                client: props.client,
              });
            } catch (e) {
              console.error(e);
              setStatus("error");
            }
          }
        }}
        gap="xs"
      >
        {step === "approval" ? "Approve" : "Confirm"}
        {status === "pending" && <Spinner size="sm" color="accentButtonText" />}
      </Button>
    </Container>
  );
}

const ConnectorLine = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    height: "4px",
    background: theme.colors.borderColor,
    flex: 1,
  };
});

function RenderTokenInfo(props: {
  chain: Chain;
  token: ERC20OrNativeToken;
  amount: string;
  symbol: string;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.chain);
  return (
    <Container
      flex="column"
      gap="xxs"
      style={{
        alignItems: "flex-end",
      }}
    >
      <Container flex="row" center="y" gap="xs">
        <Text color="primaryText" size="md">
          {props.amount} {props.symbol}
        </Text>
        <TokenIcon
          token={props.token}
          chain={props.chain}
          size="sm"
          client={props.client}
        />
      </Container>

      {chainQuery.data ? (
        <Text size="sm">{chainQuery.data.name}</Text>
      ) : (
        <Skeleton width={"100px"} height={fontSize.sm} />
      )}
    </Container>
  );
}

function ConfirmItem(props: { label: string; children: React.ReactNode }) {
  return (
    <>
      <Container
        flex="row"
        gap="md"
        py="md"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="md" color="secondaryText">
          {props.label}
        </Text>
        {props.children}
      </Container>
      <Line />
    </>
  );
}

function WaitingForConfirmation(props: {
  onBack: () => void;
  onViewPendingTx: () => void;
  swapTx: BuyWithCryptoStatusQueryParams;
  destinationToken: ERC20OrNativeToken;
  destinationChain: Chain;
  sourceAmount: string;
  destinationAmount: string;
  client: ThirdwebClient;
}) {
  const swapStatus = useBuyWithCryptoStatus(props.swapTx);
  const isSuccess = swapStatus.data?.status === "COMPLETED";
  const isFailed = swapStatus.data?.status === "FAILED";
  // const isPending = !isSuccess && !isFailed;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="sm" />

        <Container
          flex="column"
          animate="fadein"
          center="both"
          color={isSuccess ? "success" : isFailed ? "danger" : "accentText"}
        >
          <Spacer y="xxl" />
          {/* Icon */}
          {isSuccess ? (
            <CheckCircledIcon
              width={iconSize["4xl"]}
              height={iconSize["4xl"]}
            />
          ) : isFailed ? (
            <AccentFailIcon size={iconSize["4xl"]} />
          ) : (
            <div
              style={{
                position: "relative",
              }}
            >
              <Spinner size="4xl" color="accentText" />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <TokenIcon
                  chain={props.destinationChain}
                  token={props.destinationToken}
                  size="xxl"
                  client={props.client}
                />
              </div>
            </div>
          )}

          <Spacer y="xxl" />

          <Text color={"primaryText"} size="lg">
            {isSuccess
              ? "Buy Success"
              : isFailed
                ? "Transaction Failed"
                : "Buy Pending"}
          </Text>

          {/* Token info */}
          {!isFailed && (
            <>
              <Spacer y="lg" />
              <div>
                <Text size="md" inline>
                  {" "}
                  {isSuccess ? "Bought" : "Buy"}{" "}
                </Text>
                <Text size="md" color="primaryText" inline>
                  {props.destinationAmount}
                </Text>

                <Text size="md" inline>
                  {" "}
                  for{" "}
                </Text>
                <Text size="md" color="primaryText" inline>
                  {props.sourceAmount}
                </Text>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <Spacer y="md" />
              <Text size="sm">Your transaction {`couldn't`} be processed</Text>
            </>
          )}
        </Container>

        <Spacer y="xl" />

        {!isFailed && (
          <Button variant="accent" fullWidth onClick={props.onViewPendingTx}>
            View Transactions
          </Button>
        )}

        {isFailed && (
          <Button variant="accent" fullWidth onClick={props.onBack}>
            Try Again
          </Button>
        )}
      </Container>
    </Container>
  );
}
