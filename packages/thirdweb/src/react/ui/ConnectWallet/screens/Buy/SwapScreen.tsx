import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useDeferredValue, useMemo, useState } from "react";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../../chains/types.js";
import { defineChain } from "../../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import type { GetSwapQuoteParams } from "../../../../../pay/swap/actions/getSwap.js";
import type { SwapSupportedChainId } from "../../../../../pay/swap/supportedChains.js";
import { swapSupportedChains } from "../../../../../pay/swap/supportedChains.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { useThirdwebProviderProps } from "../../../../hooks/others/useThirdwebProviderProps.js";
import { useWalletBalance } from "../../../../hooks/others/useWalletBalance.js";
import { useSwapQuote } from "../../../../hooks/pay/useSwapQuote.js";
import {
  useActiveAccount,
  useActiveWalletChain,
} from "../../../../providers/wallet-provider.js";
import { Spacer } from "../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { iconSize } from "../../../design-system/index.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type ERC20OrNativeToken,
} from "../nativeToken.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { useChainsQuery } from "../../../../hooks/others/useChainQuery.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { WalletIcon } from "../../icons/WalletIcon.js";
import { SwapFees } from "./swap/SwapFees.js";
import { ConfirmationScreen } from "./swap/ConfirmationScreen.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";

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

type Screen =
  | "main"
  | "select-from-token"
  | "select-to-token"
  | "select-from-chain"
  | "select-to-chain"
  | "confirmation";

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
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
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
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="lg" />

        {/* To */}
        <BuyTokenInput
          value={destinationTokenAmount}
          onChange={async (value) => {
            setTokenAmount({ value, type: "destination" });
          }}
          token={toToken}
          chain={toChain}
          onChainClick={() => setScreen("select-to-chain")}
          onTokenClick={() => setScreen("select-to-token")}
        />
      </Container>
      <Line />

      <Container p="lg">
        <PaymentSelection />
        <Spacer y="lg" />

        {/* From */}
        <PayWithCrypto
          value={sourceTokenAmount}
          onTokenClick={() => setScreen("select-from-token")}
          chain={fromChain}
          token={fromToken}
          isLoading={swapQuoteQuery.isLoading && !sourceTokenAmount}
          onChainClick={() => setScreen("select-from-chain")}
        />

        {swapQuoteQuery.data && (
          <>
            <Spacer y="lg" />
            <SwapFees quote={swapQuoteQuery.data} />
          </>
        )}

        {isSwapQuoteError && (
          <div>
            <Spacer y="lg" />
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
            <Spacer y="lg" />
            <Container flex="row" gap="xs" center="y" color="danger">
              <WalletIcon size={iconSize.xs} />
              <Text color="danger" size="sm">
                Not enough balance
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
