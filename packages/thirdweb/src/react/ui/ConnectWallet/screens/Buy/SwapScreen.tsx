import {
  CheckCircledIcon,
  ChevronDownIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useDeferredValue, useMemo, useState } from "react";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../../chains/types.js";
import { defineChain } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { SwapTransaction } from "../../../../../pay/swap/actions/getStatus.js";
import type {
  GetSwapQuoteParams,
  SwapQuote,
} from "../../../../../pay/swap/actions/getSwap.js";
import type { SwapSupportedChainId } from "../../../../../pay/swap/supportedChains.js";
import { swapSupportedChains } from "../../../../../pay/swap/supportedChains.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { useThirdwebProviderProps } from "../../../../hooks/others/useThirdwebProviderProps.js";
import { useWalletBalance } from "../../../../hooks/others/useWalletBalance.js";
import { useSendSwapTransaction } from "../../../../hooks/pay/useSendSwapTransaction.js";
import { useSwapQuote } from "../../../../hooks/pay/useSwapQuote.js";
import { useSwapStatus } from "../../../../hooks/pay/useSwapStatus.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../providers/wallet-provider.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { iconSize, radius, spacing } from "../../../design-system/index.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens, TokenInfo } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type NativeToken,
} from "../nativeToken.js";
import { SwapInput } from "./swap/SwapInput.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../../hooks/others/useChainQuery.js";
import { BuyHeader } from "./BuyHeader.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { useSendSwapApproval } from "../../../../hooks/pay/useSendSwapApproval.js";
import { StyledDiv } from "../../../design-system/elements.js";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider.js";
import { ChainIcon } from "../../../components/ChainIcon.js";
import { shortenString } from "../../../../utils/addresses.js";

const supportedChainsObj = /* @__PURE__ */ (() =>
  swapSupportedChains.map(defineChain))();

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const activeChain = useActiveWalletChain();
  const account = useActiveAccount();

  if (!activeChain || !account) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent {...props} activeChain={activeChain} account={account} />
  );
}

type TokenAmountState = {
  value: string;
  type: "source" | "destination";
};

type SelectedToken = TokenInfo | NativeToken;

type Screen =
  | "main"
  | "select-from-token"
  | "select-to-token"
  | "select-from-chain"
  | "select-to-chain"
  | "confirmation"
  | "error";

/**
 *
 * @internal
 */
export function SwapScreenContent(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  account: Account;
}) {
  const { activeChain, account } = props;

  // prefetch chains metadata
  useChainsQuery(supportedChainsObj, 50);

  // screens
  const [screen, setScreen] = useState<Screen>("main");

  // token amount
  const [tokenAmount, setTokenAmount] = useState<TokenAmountState>({
    value: "",
    type: "source",
  });

  const isChainSupported = useMemo(
    () => swapSupportedChains.includes(activeChain.id as any),
    [activeChain.id],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : ethereum;
  const [fromChain, setFromChain] = useState<Chain>(defaultChain);
  const [toChain, setToChain] = useState<Chain>(defaultChain);

  // selected tokens
  const [fromToken, setFromToken] = useState<SelectedToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<SelectedToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDeferredValue(tokenAmount);
  const { client } = useThirdwebProviderProps();

  const fromTokenBalanceQuery = useWalletBalance({
    account: account,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  const amounts =
    tokenAmount.type === "source"
      ? { fromAmount: deferredTokenAmount.value, toAmount: undefined }
      : {
          fromAmount: undefined,
          toAmount: deferredTokenAmount.value,
        };

  const swapParams: GetSwapQuoteParams | undefined =
    deferredTokenAmount.value &&
    !(fromChain === toChain && fromToken === toToken)
      ? {
          client: client,
          // wallet
          fromAddress: account.address,
          // from token
          fromChainId: fromChain.id as SwapSupportedChainId,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChain.id as SwapSupportedChainId,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          ...amounts,
        }
      : undefined;

  const swapQuoteQuery = useSwapQuote(swapParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  if (screen === "error") {
    return (
      <Container animate="fadein">
        <Container p="lg">
          <ModalHeader
            title="Buy"
            onBack={() => {
              setScreen("main");
            }}
          />
          <Spacer y="lg" />
          <Container
            flex="column"
            gap="lg"
            animate="fadein"
            center="both"
            style={{
              minHeight: "240px",
            }}
            color={"danger"}
          >
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text color={"danger"}>Failed to swap</Text>
          </Container>
        </Container>
      </Container>
    );
  }

  if (screen === "select-from-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (fromChain?.id ? props.supportedTokens[fromChain.id] : undefined) ||
          []
        }
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          setScreen("main");
        }}
        chain={fromChain}
      />
    );
  }

  if (screen === "select-to-token") {
    return (
      <TokenSelector
        onBack={() => setScreen("main")}
        tokenList={
          (toChain?.id ? props.supportedTokens[toChain.id] : undefined) || []
        }
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          setScreen("main");
        }}
        chain={toChain}
      />
    );
  }

  if (screen === "select-from-chain" || screen === "select-to-chain") {
    return (
      <NetworkSelectorContent
        showTabs={false}
        onBack={() => setScreen("main")}
        // pass swap supported chains
        chains={supportedChainsObj}
        closeModal={() => setScreen("main")}
        networkSelector={{
          renderChain(renderChainProps) {
            return (
              <ChainButton
                chain={renderChainProps.chain}
                confirming={false}
                switchingFailed={false}
                onClick={() => {
                  const chain = renderChainProps.chain;
                  if (screen === "select-from-chain") {
                    setFromChain(chain);
                    setFromToken(NATIVE_TOKEN);
                  } else {
                    setToChain(chain);
                    setToToken(NATIVE_TOKEN);
                  }
                  setScreen("main");
                }}
              />
            );
          },
        }}
      />
    );
  }

  const swapQuote = swapQuoteQuery.data;
  const isSwapQuoteLoading = swapQuoteQuery.isLoading;
  const isSwapQuoteError = swapQuoteQuery.isError;
  const isSwapQuoteFetching = swapQuoteQuery.isFetching;

  // SOURCE TOKEN ----

  // if the token amount was entered by user - show that
  // else - show the loading status until the quote is loaded
  // once the quote is loaded, show the value calculated from the quote
  let sourceTokenAmount =
    tokenAmount.type === "source" ? tokenAmount.value : "";

  // if quote is loaded and
  if (swapQuote && !sourceTokenAmount) {
    // amount in # of tokens
    sourceTokenAmount = swapQuote.swapDetails.fromAmount;
  }

  // DESTINATION TOKEN ----

  let destinationTokenAmount =
    tokenAmount.type === "destination" ? tokenAmount.value : "";

  if (swapQuote && !destinationTokenAmount) {
    destinationTokenAmount = swapQuote.swapDetails.toAmount;
  }

  if (screen === "confirmation" && swapQuoteQuery.data) {
    return (
      <ConfirmationScreen
        onBack={() => setScreen("main")}
        swapQuote={swapQuoteQuery.data}
        fromAmount={sourceTokenAmount}
        toAmount={destinationTokenAmount}
        fromChain={fromChain}
        toChain={toChain}
        account={account}
        fromToken={fromToken}
        toToken={toToken}
      />
    );
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  return (
    <Container animate="fadein">
      <Container p="lg">
        <BuyHeader onBack={props.onBack} />
        <Spacer y="lg" />

        {/* From */}
        <SwapInput
          value={sourceTokenAmount}
          onChange={async (value) => {
            setTokenAmount({ value, type: "source" });
          }}
          label="From"
          valueIsLoading={isSwapQuoteLoading && !sourceTokenAmount}
          onTokenClick={() => setScreen("select-from-token")}
          chain={fromChain}
          token={fromToken}
          estimatedValue={swapQuote?.swapDetails.estimated.fromAmountUSDCents}
          onChainClick={() => setScreen("select-from-chain")}
        />

        <Spacer y="lg" />

        {/* To */}
        <SwapInput
          value={destinationTokenAmount}
          onChange={(value) => {
            setTokenAmount({ value, type: "destination" });
          }}
          label="To"
          valueIsLoading={isSwapQuoteLoading && !destinationTokenAmount}
          onTokenClick={() => setScreen("select-to-token")}
          chain={toChain}
          token={toToken}
          estimatedValue={swapQuote?.swapDetails.estimated.toAmountMinUSDCents}
          onChainClick={() => setScreen("select-to-chain")}
        />

        {swapQuote && <Fees quote={swapQuote} />}

        {isSwapQuoteError && (
          <div>
            <Spacer y="md" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
              <Text color="danger" size="sm">
                Can not swap given tokens at the moment
              </Text>
            </Container>
          </div>
        )}

        {!isSwapQuoteError && isNotEnoughBalance && (
          <div>
            <Spacer y="md" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <WalletIcon size={iconSize.xs} />
              <Text color="danger" size="sm">
                Exceeds balance
              </Text>
            </Container>
          </div>
        )}

        <Spacer y="lg" />

        <Button
          variant="accent"
          fullWidth
          disabled={(!isSwapQuoteFetching && !swapQuote) || isNotEnoughBalance}
          onClick={async () => {
            if (swapQuote) {
              setScreen("confirmation");
            }
          }}
          gap="sm"
        >
          Purchase
        </Button>
      </Container>
    </Container>
  );
}

function ConfirmationScreen(props: {
  onBack: () => void;
  swapQuote: SwapQuote;
  fromAmount: string;
  toAmount: string;
  fromChain: Chain;
  toChain: Chain;
  account: Account;
  fromToken: SelectedToken;
  toToken: SelectedToken;
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

      <Fees quote={props.swapQuote} />

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
          <Text color="primaryText" size="xl" weight={500}>
            {props.amount}
          </Text>
          <Container flex="row" center="y" gap="xs">
            <ChainIcon size={iconSize.md} chain={chainQuery.data} />
            <Text color="primaryText" size="sm" weight={500}>
              {props.symbol}
            </Text>
          </Container>
        </Container>
      </BorderBox>
    </div>
  );
}

function Fees(props: { quote: SwapQuote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const amount = `$${props.quote.swapDetails.estimated.feesUSDCents / 100}`;
  return (
    <div>
      <Spacer y="lg" />
      <Button
        variant="outline"
        gap="xs"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          border: "none",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        Breakdown
        <Container color="secondaryText" flex="row" center="both">
          <ChevronDownIcon
            width={iconSize.sm}
            height={iconSize.sm}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Container>
      </Button>

      <DynamicHeight>
        {isExpanded && (
          <div>
            <Spacer y="sm" />
            <Container
              animate="fadein"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Container color="secondaryText" flex="row" center="y" gap="xxs">
                <Text color="secondaryText" size="sm">
                  Processing Fees
                </Text>
              </Container>
              <Text color="primaryText" size="sm">
                {amount}
              </Text>
            </Container>
            <Spacer y="sm" />
          </div>
        )}
      </DynamicHeight>
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
            <CheckCircledIcon width={iconSize.xl} height={iconSize.xl} />
          ) : isFailed ? (
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <Spinner size="xl" color="accentText" />
          )}

          <Spacer y="xxl" />
          <Spacer y="xxl" />

          <Text
            color={isSuccess ? "success" : isFailed ? "danger" : "primaryText"}
            size="lg"
          >
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

        <Button variant="accent" fullWidth>
          Continue Buying
        </Button>
        <Spacer y="sm" />
        <Button variant="outline" fullWidth>
          Close
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
  };
});
