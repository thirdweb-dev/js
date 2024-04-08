import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { polygon } from "../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { BuyWithCryptoQuote } from "../../../../../../pay/buyWithCrypto/actions/getQuote.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import { useChainsQuery } from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import {
  type BuyWithCryptoQuoteQueryParams,
  useBuyWithCryptoQuote,
} from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../../../../core/hooks/wallets/wallet-hooks.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { iconSize } from "../../../design-system/index.js";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "../nativeToken.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { ConfirmationScreen } from "./swap/ConfirmationScreen.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { SwapFees } from "./swap/SwapFees.js";
import { useSwapSupportedChains } from "./swap/useSwapSupportedChains.js";

/**
 * @internal
 */
export function SwapScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
}) {
  const activeChain = useActiveWalletChain();
  const account = useActiveAccount();

  if (!activeChain || !account) {
    return null; // this should never happen
  }

  return (
    <SwapScreenContent
      {...props}
      activeChain={activeChain}
      account={account}
      onViewPendingTx={props.onViewPendingTx}
    />
  );
}

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
  client: ThirdwebClient;
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  account: Account;
  onViewPendingTx: () => void;
}) {
  const { activeChain, account, client } = props;
  const [isSwitching, setIsSwitching] = useState(false);
  const switchActiveWalletChain = useSwitchActiveWalletChain();
  const supportedChainsQuery = useSwapSupportedChains(client);

  const supportedChains = supportedChainsQuery.data;

  // prefetch chains metadata
  useChainsQuery(supportedChains || [], 50);

  // screens
  const [screen, setScreen] = useState<Screen>("main");

  // token amount
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [hasEditedAmount, setHasEditedAmount] = useState(false);

  const isChainSupported = useMemo(
    () => supportedChains?.find((c) => c.id === activeChain.id),
    [activeChain.id, supportedChains],
  );

  // selected chain
  const defaultChain = isChainSupported ? activeChain : polygon;
  const [fromChain, setFromChain] = useState<Chain>(defaultChain);
  const [toChain, setToChain] = useState<Chain>(defaultChain);

  // selected tokens
  const [fromToken, setFromToken] = useState<ERC20OrNativeToken>(NATIVE_TOKEN);
  const [toToken, setToToken] = useState<ERC20OrNativeToken>(
    props.supportedTokens[toChain.id]?.[0] || NATIVE_TOKEN,
  );

  const deferredTokenAmount = useDebouncedValue(tokenAmount, 300);

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
  });

  // when a quote is finalized ( approve sent if required or swap sent )
  // we save it here to stop refetching the quote query
  const [finalizedQuote, setFinalizedQuote] = useState<
    BuyWithCryptoQuote | undefined
  >();

  const buyWithCryptoParams: BuyWithCryptoQuoteQueryParams | undefined =
    deferredTokenAmount &&
    !finalizedQuote &&
    !(fromChain.id === toChain.id && fromToken === toToken)
      ? {
          // wallet
          fromAddress: account.address,
          // from token
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          toChainId: toChain.id,
          // to
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: deferredTokenAmount,
          client,
        }
      : undefined;

  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(buyWithCryptoParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  if (!supportedChains) {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          minHeight: "350px",
        }}
      >
        <Spinner color="secondaryText" size="lg" />
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
        chains={supportedChains}
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

  const swapQuote = buyWithCryptoQuoteQuery.data;
  const isSwapQuoteError = buyWithCryptoQuoteQuery.isError;

  const getErrorMessage = () => {
    const defaultMessage = "Unable to get price quote";
    try {
      if (buyWithCryptoQuoteQuery.error instanceof Error) {
        if (buyWithCryptoQuoteQuery.error.message.includes("Minimum")) {
          const msg = buyWithCryptoQuoteQuery.error.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  };

  const sourceTokenAmount = swapQuote?.swapDetails.fromAmount || "";

  const quoteToConfirm = finalizedQuote || buyWithCryptoQuoteQuery.data;

  if (screen === "confirmation" && quoteToConfirm) {
    return (
      <ConfirmationScreen
        client={client}
        onBack={() => {
          // remove finalized quote when going back
          setFinalizedQuote(undefined);
          setScreen("main");
        }}
        buyWithCryptoQuote={quoteToConfirm}
        onQuoteFinalized={(_quote) => {
          setFinalizedQuote(_quote);
        }}
        fromAmount={quoteToConfirm.swapDetails.fromAmount}
        toAmount={tokenAmount}
        fromChain={fromChain}
        toChain={toChain}
        account={account}
        fromToken={fromToken}
        toToken={toToken}
        onViewPendingTx={props.onViewPendingTx}
      />
    );
  }

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue = !swapQuote || isNotEnoughBalance;

  const switchChainRequired = props.activeChain.id !== fromChain.id;

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
        <Spacer y="xl" />

        {!hasEditedAmount && <Spacer y="xl" />}

        {/* To */}
        <BuyTokenInput
          value={tokenAmount}
          onChange={async (value) => {
            setHasEditedAmount(true);
            setTokenAmount(value);
          }}
          token={toToken}
          chain={toChain}
          onChainClick={() => setScreen("select-to-chain")}
          onTokenClick={() => setScreen("select-to-token")}
        />
      </Container>

      {!hasEditedAmount && <Spacer y="xxl" />}
      <Line />

      <Container p="lg">
        {hasEditedAmount && (
          <div>
            <PaymentSelection />
            <Spacer y="lg" />

            {/* From */}
            <PayWithCrypto
              value={sourceTokenAmount}
              onTokenClick={() => setScreen("select-from-token")}
              chain={fromChain}
              token={fromToken}
              isLoading={
                buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount
              }
              onChainClick={() => setScreen("select-from-chain")}
            />

            <Spacer y="lg" />

            <Container flex="column" gap="md">
              {buyWithCryptoQuoteQuery.data && (
                <div>
                  <SwapFees quote={buyWithCryptoQuoteQuery.data} />
                  <Spacer y="lg" />
                </div>
              )}

              {isSwapQuoteError && (
                <div>
                  <Container flex="row" gap="xs" center="y" color="danger">
                    <CrossCircledIcon
                      width={iconSize.sm}
                      height={iconSize.sm}
                    />
                    <Text color="danger" size="sm">
                      {getErrorMessage()}
                    </Text>
                  </Container>
                  <Spacer y="lg" />
                </div>
              )}
            </Container>
          </div>
        )}

        {switchChainRequired && (
          <Button
            fullWidth
            variant="accent"
            disabled={!hasEditedAmount}
            data-disabled={!hasEditedAmount}
            gap="sm"
            onClick={async () => {
              setIsSwitching(true);
              try {
                await switchActiveWalletChain(fromChain);
              } catch {}
              setIsSwitching(false);
            }}
          >
            {hasEditedAmount ? (
              <>
                {isSwitching && <Spinner size="sm" color="accentButtonText" />}
                {isSwitching ? "Switching" : "Switch Network"}
              </>
            ) : (
              "Continue"
            )}
          </Button>
        )}

        {!switchChainRequired && (
          <Button
            variant={disableContinue ? "outline" : "accent"}
            fullWidth
            data-disabled={disableContinue}
            disabled={disableContinue}
            onClick={async () => {
              if (!disableContinue) {
                setScreen("confirmation");
              }
            }}
            gap="sm"
          >
            {isNotEnoughBalance ? "Not Enough Funds" : "Continue"}
          </Button>
        )}
      </Container>
    </Container>
  );
}
