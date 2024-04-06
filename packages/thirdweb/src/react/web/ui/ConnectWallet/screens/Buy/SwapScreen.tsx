import { ClockIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { polygon } from "../../../../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../../../../chains/types.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";
import { useChainsQuery } from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import {
  useBuyWithCryptoQuote,
  type BuyWithCryptoQuoteQueryParams,
} from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../../../../core/hooks/wallets/wallet-hooks.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { fontSize, iconSize, radius } from "../../../design-system/index.js";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  NATIVE_TOKEN,
  isNativeToken,
  type ERC20OrNativeToken,
} from "../nativeToken.js";
import { PaymentSelection } from "./PaymentSelection.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { SwapConfirmationScreen } from "./swap/ConfirmationScreen.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import type { BuyWithCryptoQuote } from "../../../../../../pay/buyWithCrypto/actions/getQuote.js";
import { useSwapSupportedChains } from "./swap/useSwapSupportedChains.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { Skeleton } from "../../../components/Skeleton.js";
import type { IconFC } from "../../icons/types.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { OnRampFees, SwapFees } from "./swap/Fees.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { formatSeconds } from "./swap/formatSeconds.js";
import { useOnrampQuote } from "../../../../../core/hooks/pay/useOnrampQuote.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import { PayWithCreditCard } from "./swap/PayWithCreditCard.js";
import { AccountSelectionScreen } from "./AccountSelectionScreen.js";
import { AccountSelectorButton } from "./AccountSelectorButton.js";
import { FeesButton } from "./buttons.js";
import { OnRampConfirmationScreen } from "./swap/OnRampConfirmationScreen.js";
import { KadoScreen } from "./KadoScreen.js";

/**
 * @internal
 */
export function BuyScreen(props: {
  onBack: () => void;
  supportedTokens: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
}) {
  const activeChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const account = useActiveAccount();
  const supportedChainsQuery = useSwapSupportedChains(props.client);

  if (!activeChain || !account || !activeWallet || !supportedChainsQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <BuyScreenContent
      {...props}
      activeChain={activeChain}
      activeWallet={activeWallet}
      account={account}
      onViewPendingTx={props.onViewPendingTx}
      supportedChains={supportedChainsQuery.data}
    />
  );
}

type Screen =
  | "main"
  | "select-from-token"
  | "select-to-token"
  | "confirmation"
  | "usd-confirmation"
  | "kado-iframe";
type DrawerScreen = "fees" | "address" | undefined;

/**
 *
 * @internal
 */
export function BuyScreenContent(props: {
  client: ThirdwebClient;
  onBack: () => void;
  supportedTokens: SupportedTokens;
  activeChain: Chain;
  activeWallet: Wallet;
  account: Account;
  onViewPendingTx: () => void;
  supportedChains: Chain[];
}) {
  const { activeChain, account, client, activeWallet, supportedChains } = props;
  const [isSwitching, setIsSwitching] = useState(false);
  const switchActiveWalletChain = useSwitchActiveWalletChain();
  const [method, setMethod] = useState<"crypto" | "creditCard">("crypto");

  // prefetch chains metadata
  useChainsQuery(supportedChains || [], 50);

  // screens
  const [screen, setScreen] = useState<Screen>("main");
  const [drawerScreen, setDrawerScreen] = useState<DrawerScreen>();
  const { drawerRef, drawerOverlayRef, onClose } = useDrawer();

  const closeDrawer = () => {
    onClose(() => {
      setDrawerScreen(undefined);
    });
  };

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
  const [address, setAddress] = useState<string>(account.address);

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
          fromAddress: address,
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

  const onRampQuoteQuery = useOnrampQuote();

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
        chainSelection={{
          chains: supportedChains,
          select: (c) => setFromChain(c),
        }}
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
        chainSelection={{
          chains: supportedChains,
          select: (c) => setToChain(c),
        }}
      />
    );
  }

  if (screen === "kado-iframe" && onRampQuoteQuery.data) {
    return (
      <KadoScreen
        quote={onRampQuoteQuery.data}
        onBack={() => {
          setScreen("main");
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

  if (screen === "usd-confirmation" && onRampQuoteQuery.data) {
    return (
      <OnRampConfirmationScreen
        account={account}
        client={client}
        toAmount={tokenAmount}
        onBack={() => {
          // remove finalized quote when going back
          setFinalizedQuote(undefined);
          setScreen("main");
        }}
        onQuoteFinalized={() => {
          // TODO?
        }}
        quote={onRampQuoteQuery.data}
        fromAmount={onRampQuoteQuery.data.fromCurrency.amount}
        toChain={toChain}
        toToken={toToken}
      />
    );
  }

  if (screen === "confirmation" && quoteToConfirm) {
    return (
      <SwapConfirmationScreen
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

  console.log({
    drawerScreen,
  });

  return (
    <Container animate="fadein">
      <div
        onClick={(e) => {
          if (
            drawerScreen &&
            drawerRef.current &&
            !drawerRef.current.contains(e.target as Node)
          ) {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
          }
        }}
      >
        {/* Drawer */}
        {drawerScreen && (
          <>
            <DrawerOverlay ref={drawerOverlayRef} />
            <Drawer ref={drawerRef} close={closeDrawer}>
              <DynamicHeight>
                {drawerScreen === "address" && (
                  <AccountSelectionScreen
                    onSelect={(v) => {
                      setAddress(v);
                      closeDrawer();
                    }}
                    activeAccount={account}
                    activeWallet={props.activeWallet}
                  />
                )}

                {method === "crypto" && (
                  <>
                    {drawerScreen === "fees" && (
                      <div>
                        <Text size="lg" color="primaryText">
                          Fees
                        </Text>

                        <Spacer y="lg" />
                        {swapQuote && (
                          <SwapFees quote={swapQuote} align="left" />
                        )}
                      </div>
                    )}
                  </>
                )}

                {method === "creditCard" && (
                  <>
                    {drawerScreen === "fees" && (
                      <div>
                        <Text size="lg" color="primaryText">
                          Fees
                        </Text>

                        <Spacer y="lg" />
                        {onRampQuoteQuery.data && (
                          <OnRampFees
                            quote={onRampQuoteQuery.data}
                            align="left"
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </DynamicHeight>
            </Drawer>
          </>
        )}

        <Container
          p="lg"
          style={{
            paddingBottom: 0,
          }}
        >
          <ModalHeader title="Buy" onBack={props.onBack} />
          <Spacer y="lg" />
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
            onSelectToken={() => setScreen("select-to-token")}
          />
        </Container>

        <Spacer y="md" />
        <Container px="lg">
          {hasEditedAmount && (
            <div>
              <PaymentSelection selected={method} onSelect={setMethod} />
              <Spacer y="md" />

              {method === "crypto" && (
                <>
                  <PayWithCrypto
                    value={sourceTokenAmount}
                    onSelectToken={() => {
                      setScreen("select-from-token");
                    }}
                    chain={fromChain}
                    token={fromToken}
                    isLoading={
                      buyWithCryptoQuoteQuery.isLoading && !sourceTokenAmount
                    }
                  />
                  <SecondaryInfo
                    quoteIsLoading={buyWithCryptoQuoteQuery.isLoading}
                    estimatedSeconds={
                      buyWithCryptoQuoteQuery.data?.swapDetails.estimated
                        .durationSeconds
                    }
                    onViewFees={() => setDrawerScreen("fees")}
                  />
                </>
              )}

              {method === "creditCard" && (
                <>
                  <PayWithCreditCard
                    isLoading={onRampQuoteQuery.isLoading}
                    value={onRampQuoteQuery.data?.fromCurrency.amount}
                  />
                  <SecondaryInfo
                    quoteIsLoading={onRampQuoteQuery.isLoading}
                    estimatedSeconds={
                      onRampQuoteQuery.data?.estimatedDurationSeconds
                    }
                    onViewFees={() => setDrawerScreen("fees")}
                  />
                </>
              )}

              <Spacer y="md" />

              {/* Send To */}
              <Container>
                <Text size="sm">Send To</Text>
                <Spacer y="xxs" />
                <AccountSelectorButton
                  address={address}
                  activeAccount={account}
                  activeWallet={activeWallet}
                  onClick={() => {
                    setDrawerScreen("address");
                  }}
                  chevron
                />
              </Container>

              <Spacer y="md" />

              <Container flex="column" gap="md">
                {method === "crypto" && isSwapQuoteError && (
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

          {method === "crypto" && (
            <>
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
                      {isSwitching && (
                        <Spinner size="sm" color="accentButtonText" />
                      )}
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
            </>
          )}

          {method === "creditCard" && (
            <Button
              variant="accent"
              fullWidth
              onClick={async () => {
                setScreen("kado-iframe");
              }}
              gap="sm"
            >
              Continue
            </Button>
          )}
        </Container>
        <Spacer y="lg" />
      </div>
    </Container>
  );
}

const ViewFeeIcon: IconFC = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H9.5C10.0523 10.5 10.5 10.0523 10.5 9.5V2.5C10.5 1.94772 10.0523 1.5 9.5 1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7.5L7.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function SecondaryInfo(props: {
  estimatedSeconds?: number | undefined;
  quoteIsLoading: boolean;
  onViewFees: () => void;
}) {
  const { estimatedSeconds, quoteIsLoading } = props;

  return (
    <Container
      bg="tertiaryBg"
      flex="row"
      borderColor="borderColor"
      style={{
        borderRadius: radius.md,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <Container flex="row" center="y" gap="xxs" color="accentText" p="sm">
        <ClockIcon width={iconSize.sm} height={iconSize.sm} />
        {quoteIsLoading ? (
          <Skeleton height={fontSize.xs} width="50px" />
        ) : (
          <Text size="xs" color="secondaryText">
            {estimatedSeconds ? "~" + formatSeconds(estimatedSeconds) : "--"}
          </Text>
        )}
      </Container>

      <FeesButton variant="secondary" onClick={props.onViewFees}>
        <Container color="accentText" flex="row" center="both">
          <ViewFeeIcon size={iconSize.sm} />
        </Container>
        <Text size="xs" color="secondaryText">
          View Fees
        </Text>
      </FeesButton>
    </Container>
  );
}
