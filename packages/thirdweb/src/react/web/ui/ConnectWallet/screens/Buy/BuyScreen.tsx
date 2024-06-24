import { IdCardIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { GetBuyWithCryptoQuoteParams } from "../../../../../../pay/buyWithCrypto/getQuote.js";
import { isSwapRequiredPostOnramp } from "../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import { toEther } from "../../../../../../utils/units.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import {
  type Theme,
  fontSize,
  iconSize,
  spacing,
} from "../../../../../core/design-system/index.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../core/hooks/others/useWalletBalance.js";
import { useBuyWithCryptoQuote } from "../../../../../core/hooks/pay/useBuyWithCryptoQuote.js";
import { useBuyWithFiatQuote } from "../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import { useActiveAccount } from "../../../../hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../hooks/wallets/useActiveWalletChain.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import { ChainName } from "../../../components/ChainName.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Spacer } from "../../../components/Spacer.js";
import { Spinner } from "../../../components/Spinner.js";
import { SwitchNetworkButton } from "../../../components/SwitchNetwork.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import type { PayUIOptions } from "../../ConnectButtonProps.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import { CoinsIcon } from "../../icons/CoinsIcon.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "../nativeToken.js";
import { EstimatedTimeAndFees } from "./EstimatedTimeAndFees.js";
import { PayTokenIcon } from "./PayTokenIcon.js";
import { PayWithCreditCard } from "./PayWIthCreditCard.js";
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatFlow } from "./fiat/FiatFlow.js";
import type { CurrencyMeta } from "./fiat/currencies.js";
import type { BuyForTx, SelectedScreen } from "./main/types.js";
import { useBuyTxStates } from "./main/useBuyTxStates.js";
import { useEnabledPaymentMethods } from "./main/useEnabledPaymentMethods.js";
import { useUISelectionStates } from "./main/useUISelectionStates.js";
import { openOnrampPopup } from "./openOnRamppopup.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatFees, SwapFees } from "./swap/Fees.js";
import { PayWithCrypto } from "./swap/PayWithCrypto.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { addPendingTx } from "./swap/pendingSwapTx.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";

// NOTE: Must not use useConnectUI here because this UI can be used outside connect ui

export type BuyScreenProps = {
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  onViewPendingTx: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  onDone: () => void;
  connectButton?: React.ReactNode;
  isEmbed: boolean;
};

/**
 * @internal
 */
export default function BuyScreen(props: BuyScreenProps) {
  const supportedDestinationsQuery = useBuySupportedDestinations(props.client);

  if (!supportedDestinationsQuery.data) {
    return <LoadingScreen />;
  }

  return (
    <BuyScreenContent
      {...props}
      onViewPendingTx={props.onViewPendingTx}
      supportedDestinations={supportedDestinationsQuery.data}
      buyForTx={props.buyForTx}
    />
  );
}

type BuyScreenContentProps = {
  client: ThirdwebClient;
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  onViewPendingTx: () => void;
  supportedDestinations: SupportedChainAndTokens;
  connectLocale: ConnectLocale;
  buyForTx?: BuyForTx;
  theme: "light" | "dark" | Theme;
  payOptions: PayUIOptions;
  onDone: () => void;
  connectButton?: React.ReactNode;
  isEmbed: boolean;
};

function useBuyScreenStates() {
  const [screen, setScreen] = useState<SelectedScreen>({
    id: "main",
  });

  const [drawerScreen, setDrawerScreen] = useState<React.ReactNode>();
  const { drawerRef, drawerOverlayRef, onClose } = useDrawer();

  function closeDrawer() {
    onClose(() => {
      setDrawerScreen(undefined);
    });
  }

  return {
    screen,
    setScreen,
    drawerScreen,
    setDrawerScreen,
    drawerRef,
    drawerOverlayRef,
    closeDrawer,
  };
}

/**
 * @internal
 */
function BuyScreenContent(props: BuyScreenContentProps) {
  const { client, supportedDestinations, connectLocale, payOptions, buyForTx } =
    props;

  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  // prefetch chains metadata for destination chains
  useChainsQuery(supportedDestinations.map((x) => x.chain) || [], 50);

  // screen
  const {
    screen,
    setScreen,
    drawerScreen,
    setDrawerScreen,
    drawerRef,
    drawerOverlayRef,
    closeDrawer,
  } = useBuyScreenStates();

  // UI selection
  const {
    tokenAmount,
    setTokenAmount,
    toChain,
    setToChain,
    deferredTokenAmount,
    fromChain,
    setFromChain,
    toToken,
    setToToken,
    fromToken,
    setFromToken,
    selectedCurrency,
    setSelectedCurrency,
  } = useUISelectionStates({
    payOptions,
    buyForTx,
    supportedDestinations,
  });

  // check if the screen is expanded or not

  // update supportedSources whenever toToken or toChain is updated
  const supportedSourcesQuery = useBuySupportedSources({
    client: props.client,
    destinationChainId: toChain.id,
    destinationTokenAddress: isNativeToken(toToken)
      ? NATIVE_TOKEN_ADDRESS
      : toToken.address,
  });

  const destinationSupportedTokens: SupportedTokens = useMemo(() => {
    return createSupportedTokens(
      supportedDestinations,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedDestinations, payOptions]);

  const sourceSupportedTokens: SupportedTokens | undefined = useMemo(() => {
    if (!supportedSourcesQuery.data) {
      return undefined;
    }

    return createSupportedTokens(
      supportedSourcesQuery.data,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedSourcesQuery.data, payOptions]);

  // screens ----------------------------

  if (screen.id === "node") {
    return screen.node;
  }

  if (screen.id === "select-currency") {
    const goBack = () => setScreen(screen.backScreen);
    return (
      <CurrencySelection
        onSelect={(currency) => {
          goBack();
          setSelectedCurrency(currency);
        }}
        onBack={goBack}
      />
    );
  }

  if (screen.id === "select-to-token") {
    const chains = supportedDestinations.map((x) => x.chain);
    const goBack = () => setScreen(screen.backScreen);
    // if token selection is disabled - only show network selector screen
    if (payOptions.prefillBuy?.allowEdits?.token === false) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          setChain={setToChain}
          goBack={goBack}
        />
      );
    }

    return (
      <TokenSelector
        onBack={goBack}
        tokenList={(
          (toChain?.id ? destinationSupportedTokens[toChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          goBack();
        }}
        chain={toChain}
        chainSelection={
          // hide chain selection if it's disabled
          payOptions.prefillBuy?.allowEdits?.chain !== false
            ? {
                chains: chains,
                select: (c) => {
                  setToChain(c);
                },
              }
            : undefined
        }
        connectLocale={connectLocale}
        client={client}
        modalTitle="Buy"
      />
    );
  }

  if (
    screen.id === "select-from-token" &&
    supportedSourcesQuery.data &&
    sourceSupportedTokens
  ) {
    const chains = supportedSourcesQuery.data.map((x) => x.chain);
    const goBack = () => setScreen(screen.backScreen);
    // if token selection is disabled - only show network selector screen
    if (
      payOptions.buyWithCrypto !== false &&
      payOptions.buyWithCrypto?.prefillSource?.allowEdits?.token === false
    ) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          setChain={setFromChain}
          goBack={goBack}
        />
      );
    }

    return (
      <TokenSelector
        onBack={goBack}
        tokenList={(
          (fromChain?.id ? sourceSupportedTokens[fromChain.id] : undefined) ||
          []
        ).filter((x) => x.address !== NATIVE_TOKEN_ADDRESS)}
        onTokenSelect={(tokenInfo) => {
          setFromToken(tokenInfo);
          goBack();
        }}
        chain={fromChain}
        chainSelection={
          // hide chain selection if it's disabled
          payOptions.buyWithCrypto !== false &&
          payOptions.buyWithCrypto?.prefillSource?.allowEdits?.chain !== false
            ? {
                chains: supportedSourcesQuery.data.map((x) => x.chain),
                select: (c) => setFromChain(c),
              }
            : undefined
        }
        connectLocale={connectLocale}
        client={client}
        modalTitle="Pay with"
      />
    );
  }

  return (
    <Container animate="fadein">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
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
              <DynamicHeight>{drawerScreen}</DynamicHeight>
            </Drawer>
          </>
        )}

        {screen.id === "main" && (
          <MainScreen
            account={account || null}
            buyForTx={buyForTx || null}
            client={client}
            onSelectBuyToken={() =>
              setScreen({ id: "select-to-token", backScreen: screen })
            }
            payOptions={payOptions}
            setTokenAmount={setTokenAmount}
            toChain={toChain}
            toToken={toToken}
            tokenAmount={tokenAmount}
            connectButton={props.connectButton}
            onViewPendingTx={props.onViewPendingTx}
            setScreen={setScreen}
            supportedDestinations={supportedDestinations}
          />
        )}

        {(screen.id === "select-payment-method" ||
          screen.id === "buy-with-crypto" ||
          screen.id === "buy-with-fiat") && (
          <TokenSelectedLayout
            selectedChain={toChain}
            selectedToken={toToken}
            tokenAmount={tokenAmount}
            client={client}
            onBack={() => {
              if (
                screen.id === "buy-with-crypto" ||
                screen.id === "buy-with-fiat"
              ) {
                setScreen({ id: "select-payment-method" });
              } else if (screen.id === "select-payment-method") {
                setScreen({ id: "main" });
              }
            }}
          >
            {screen.id === "select-payment-method" && (
              <PaymentMethodSelection setScreen={(id) => setScreen({ id })} />
            )}

            {screen.id === "buy-with-crypto" && account && activeChain && (
              <SwapScreenContent
                setScreen={setScreen}
                setDrawerScreen={setDrawerScreen}
                tokenAmount={deferredTokenAmount}
                toChain={toChain}
                toToken={toToken}
                fromChain={fromChain}
                fromToken={fromToken}
                showFromTokenSelector={() => {
                  setScreen({
                    id: "select-from-token",
                    backScreen: screen,
                  });
                }}
                account={account}
                activeChain={activeChain}
                buyForTx={buyForTx || null}
                client={client}
                isEmbed={props.isEmbed}
                onDone={props.onDone}
                onViewPendingTx={props.onViewPendingTx}
                payOptions={payOptions}
              />
            )}

            {screen.id === "buy-with-fiat" && account && activeChain && (
              <FiatScreenContent
                setScreen={setScreen}
                setDrawerScreen={setDrawerScreen}
                tokenAmount={deferredTokenAmount}
                toChain={toChain}
                toToken={toToken}
                selectedCurrency={selectedCurrency}
                buyForTx={buyForTx || null}
                client={client}
                isEmbed={props.isEmbed}
                onDone={props.onDone}
                onViewPendingTx={props.onViewPendingTx}
                payOptions={payOptions}
                theme={props.theme}
                showCurrencySelector={() => {
                  setScreen({
                    id: "select-currency",
                    backScreen: screen,
                  });
                }}
                account={account}
              />
            )}
          </TokenSelectedLayout>
        )}
      </div>
    </Container>
  );
}

function SelectedTokenInfo(props: {
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  tokenAmount: string;
  client: ThirdwebClient;
}) {
  return (
    <div>
      <Container
        flex="row"
        gap="sm"
        center="y"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Container flex="row" gap="xs" center="y">
          <Text color="primaryText" data-testid="tokenAmount" size="xxl">
            {formatNumber(Number(props.tokenAmount), 3)}
          </Text>

          <Container flex="row" gap="xxs" center="y">
            <TokenSymbol
              token={props.selectedToken}
              chain={props.selectedChain}
              size="md"
              color="secondaryText"
            />
            <PayTokenIcon
              chain={props.selectedChain}
              client={props.client}
              size="sm"
              token={props.selectedToken}
            />
          </Container>
        </Container>

        <ChainName
          chain={props.selectedChain}
          client={props.client}
          size="sm"
          short
        />
      </Container>
    </div>
  );
}

function MainScreen(props: {
  buyForTx: BuyForTx | null;
  client: ThirdwebClient;
  setTokenAmount: (amount: string) => void;
  account: Account | null;
  tokenAmount: string;
  payOptions: PayUIOptions;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  onSelectBuyToken: () => void;
  connectButton?: React.ReactNode;
  onViewPendingTx: () => void;
  setScreen: (screen: SelectedScreen) => void;
  supportedDestinations: SupportedChainAndTokens;
}) {
  const { showPaymentSelection, buyWithCryptoEnabled, buyWithFiatEnabled } =
    useEnabledPaymentMethods({
      payOptions: props.payOptions,
      supportedDestinations: props.supportedDestinations,
      toChain: props.toChain,
      toToken: props.toToken,
    });

  const [hasEditedAmount, setHasEditedAmount] = useState(false);
  const {
    buyForTx,
    setTokenAmount,
    account,
    client,
    tokenAmount,
    payOptions,
    toToken,
    toChain,
  } = props;

  // Buy Transaction flow states
  const { amountNeeded } = useBuyTxStates({
    setTokenAmount,
    buyForTx,
    hasEditedAmount,
    account,
  });

  const disableContinue = !tokenAmount;

  return (
    <Container p="lg">
      <ModalHeader
        title={
          props.buyForTx ? `Not enough ${props.buyForTx.tokenSymbol}` : "Buy"
        }
      />

      {/* Amount needed for Send Tx */}
      {amountNeeded && props.buyForTx ? (
        <>
          <Spacer y="lg" />
          <BuyForTxUI
            amountNeeded={String(
              formatNumber(Number(toEther(amountNeeded)), 4),
            )}
            buyForTx={props.buyForTx}
            client={client}
          />
        </>
      ) : (
        <Spacer y="xl" />
      )}

      {/* To */}
      <BuyTokenInput
        value={tokenAmount}
        onChange={async (value) => {
          setHasEditedAmount(true);
          setTokenAmount(value);
        }}
        freezeAmount={payOptions.prefillBuy?.allowEdits?.amount === false}
        freezeChainAndToken={
          payOptions.prefillBuy?.allowEdits?.chain === false &&
          payOptions.prefillBuy?.allowEdits?.token === false
        }
        token={toToken}
        chain={toChain}
        onSelectToken={props.onSelectBuyToken}
        client={props.client}
        hideTokenSelector={!!props.buyForTx}
      />

      <Spacer y="xl" />

      {/* Continue */}
      <Container flex="column" gap="sm">
        {!account && props.connectButton ? (
          <div>{props.connectButton}</div>
        ) : (
          <Button
            variant="accent"
            fullWidth
            disabled={disableContinue}
            data-disabled={disableContinue}
            onClick={() => {
              if (showPaymentSelection) {
                props.setScreen({ id: "select-payment-method" });
              } else if (buyWithCryptoEnabled) {
                props.setScreen({ id: "buy-with-crypto" });
              } else if (buyWithFiatEnabled) {
                props.setScreen({ id: "buy-with-fiat" });
              } else {
                console.error("No payment method enabled");
              }
            }}
          >
            Continue
          </Button>
        )}

        {/* Do we want to remove this? */}
        {account && (
          <Button
            variant="outline"
            fullWidth
            style={{
              padding: spacing.xs,
              fontSize: fontSize.sm,
            }}
            onClick={props.onViewPendingTx}
          >
            View all transactions
          </Button>
        )}
      </Container>
    </Container>
  );
}

function TokenSelectedLayout(props: {
  children: React.ReactNode;
  tokenAmount: string;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title={"Buy"} onBack={props.onBack} />
      </Container>

      <Container
        px="lg"
        style={{
          paddingBottom: spacing.lg,
        }}
      >
        <Spacer y="xs" />
        <SelectedTokenInfo
          selectedToken={props.selectedToken}
          selectedChain={props.selectedChain}
          tokenAmount={props.tokenAmount}
          client={props.client}
        />

        <Spacer y="md" />
        <Line />
        <Spacer y="lg" />

        <Text size="sm"> Pay with </Text>
        <Spacer y="sm" />

        {props.children}
      </Container>
    </Container>
  );
}

function PaymentMethodSelection(props: {
  setScreen: (screenId: "buy-with-crypto" | "buy-with-fiat") => void;
}) {
  return (
    <Container animate="fadein">
      {/* Credit Card */}
      <Container flex="column" gap="sm">
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-fiat")}
          gap="sm"
          style={{
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <Container color="secondaryText" flex="row" center="both">
            <IdCardIcon
              style={{
                width: iconSize.md,
                height: iconSize.md,
              }}
            />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Credit Card
            </Text>
            <Text size="xs">Easily and securely make payments</Text>
          </Container>
        </Button>

        {/* Crypto */}
        <Button
          variant="outline"
          bg="tertiaryBg"
          onClick={() => props.setScreen("buy-with-crypto")}
          style={{
            justifyContent: "flex-start",
          }}
          gap="sm"
        >
          <Container color="secondaryText" flex="row" center="both">
            <CoinsIcon size={iconSize.md} />
          </Container>

          <Container flex="column" gap="xxs">
            <Text size="md" color="primaryText">
              Crypto
            </Text>
            <Text size="xs">Pay with confidence using crypto</Text>
          </Container>
        </Button>
      </Container>
    </Container>
  );
}

function SwapScreenContent(props: {
  setDrawerScreen: (screen: React.ReactNode) => void;
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  fromChain: Chain;
  fromToken: ERC20OrNativeToken;
  showFromTokenSelector: () => void;
  account: Account;
  activeChain: Chain;
  client: ThirdwebClient;
  payOptions: PayUIOptions;
  buyForTx: BuyForTx | null;
  isEmbed: boolean;
  onViewPendingTx: () => void;
  onDone: () => void;
}) {
  const {
    setDrawerScreen,
    setScreen,
    account,
    client,
    toChain,
    tokenAmount,
    toToken,
    fromChain,
    fromToken,
    showFromTokenSelector,
    payOptions,
  } = props;

  const fromTokenBalanceQuery = useWalletBalance({
    address: account.address,
    chain: fromChain,
    tokenAddress: isNativeToken(fromToken) ? undefined : fromToken.address,
    client,
  });

  const quoteParams: GetBuyWithCryptoQuoteParams | undefined =
    tokenAmount && !(fromChain.id === toChain.id && fromToken === toToken)
      ? {
          // wallet
          fromAddress: account.address,
          // from
          fromChainId: fromChain.id,
          fromTokenAddress: isNativeToken(fromToken)
            ? NATIVE_TOKEN_ADDRESS
            : fromToken.address,
          // to
          toChainId: toChain.id,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          purchaseData: payOptions.purchaseData,
        }
      : undefined;

  const quoteQuery = useBuyWithCryptoQuote(quoteParams, {
    // refetch every 30 seconds
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    gcTime: 30 * 1000,
  });

  const sourceTokenAmount = quoteQuery.data?.swapDetails.fromAmount;

  const isNotEnoughBalance =
    !!sourceTokenAmount &&
    !!fromTokenBalanceQuery.data &&
    Number(fromTokenBalanceQuery.data.displayValue) < Number(sourceTokenAmount);

  const disableContinue = !quoteQuery.data || isNotEnoughBalance;
  const switchChainRequired = props.activeChain.id !== fromChain.id;

  function getErrorMessage(err: Error) {
    const defaultMessage = "Unable to get price quote";
    try {
      if (err instanceof Error) {
        if (err.message.includes("Minimum")) {
          const msg = err.message;
          return msg.replace("Fetch failed: Error: ", "");
        }
      }
      return defaultMessage;
    } catch {
      return defaultMessage;
    }
  }

  function showSwapFlow() {
    if (!quoteQuery.data) {
      return;
    }

    setScreen({
      id: "node",
      node: (
        <SwapFlow
          isBuyForTx={!!props.buyForTx}
          isEmbed={props.isEmbed}
          client={client}
          onBack={() => {
            setScreen({
              id: "buy-with-crypto",
            });
          }}
          buyWithCryptoQuote={quoteQuery.data}
          account={account}
          onViewPendingTx={props.onViewPendingTx}
          isFiatFlow={false}
          onDone={props.onDone}
          onTryAgain={() => {
            setScreen({
              id: "buy-with-crypto",
            });
            quoteQuery.refetch();
          }}
        />
      ),
    });
  }

  function showFees() {
    if (!quoteQuery.data) {
      return;
    }

    setDrawerScreen(
      <div>
        <Text size="lg" color="primaryText">
          Fees
        </Text>
        <Spacer y="lg" />
        <SwapFees quote={quoteQuery.data} align="left" />
      </div>,
    );
  }

  const prefillSource =
    payOptions.buyWithCrypto !== false
      ? payOptions.buyWithCrypto?.prefillSource
      : undefined;

  return (
    <Container flex="column" gap="md" animate="fadein">
      {/* Quote info */}
      <div>
        <PayWithCrypto
          value={sourceTokenAmount || ""}
          onSelectToken={showFromTokenSelector}
          chain={fromChain}
          token={fromToken}
          isLoading={quoteQuery.isLoading && !sourceTokenAmount}
          client={client}
          freezeChainAndTokenSelection={
            prefillSource?.allowEdits?.chain === false &&
            prefillSource?.allowEdits?.token === false
          }
        />
        <EstimatedTimeAndFees
          quoteIsLoading={quoteQuery.isLoading}
          estimatedSeconds={
            quoteQuery.data?.swapDetails.estimated.durationSeconds
          }
          onViewFees={showFees}
        />
      </div>

      {/* Error */}
      {quoteQuery.error && (
        <Text color="danger" size="sm" center>
          {getErrorMessage(quoteQuery.error)}
        </Text>
      )}

      {/* Button */}
      {switchChainRequired &&
      !quoteQuery.isLoading &&
      !isNotEnoughBalance &&
      !quoteQuery.error ? (
        <SwitchNetworkButton variant="accent" fullWidth chain={fromChain} />
      ) : (
        <Button
          variant={disableContinue ? "outline" : "accent"}
          fullWidth
          data-disabled={disableContinue}
          disabled={disableContinue}
          onClick={async () => {
            if (!disableContinue) {
              showSwapFlow();
            }
          }}
          gap="xs"
        >
          {isNotEnoughBalance ? (
            <Text color="danger">Not Enough Funds</Text>
          ) : quoteQuery.isLoading ? (
            <>
              Getting price quote
              <Spinner size="sm" color="accentText" />
            </>
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </Container>
  );
}

function FiatScreenContent(props: {
  setDrawerScreen: (screen: React.ReactNode) => void;
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  selectedCurrency: CurrencyMeta;
  showCurrencySelector: () => void;
  account: Account;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  buyForTx: BuyForTx | null;
  client: ThirdwebClient;
  onViewPendingTx: () => void;
  onDone: () => void;
  isEmbed: boolean;
}) {
  const {
    toToken,
    tokenAmount,
    account,
    client,
    setScreen,
    setDrawerScreen,
    toChain,
    showCurrencySelector,
    selectedCurrency,
  } = props;

  const buyWithFiatOptions = props.payOptions.buyWithFiat;

  const fiatQuoteQuery = useBuyWithFiatQuote(
    buyWithFiatOptions !== false && tokenAmount
      ? {
          fromCurrencySymbol: selectedCurrency.shorthand,
          toChainId: toChain.id,
          toAddress: account.address,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          isTestMode: buyWithFiatOptions?.testMode,
          purchaseData: props.payOptions.purchaseData,
          fromAddress: account.address,
        }
      : undefined,
  );

  function handleSubmit() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    const hasTwoSteps = isSwapRequiredPostOnramp(fiatQuoteQuery.data);
    let openedWindow: Window | null = null;

    if (!hasTwoSteps) {
      openedWindow = openOnrampPopup(
        fiatQuoteQuery.data.onRampLink,
        typeof props.theme === "string" ? props.theme : props.theme.type,
      );

      addPendingTx({
        type: "fiat",
        intentId: fiatQuoteQuery.data.intentId,
      });
    }

    setScreen({
      id: "node",
      node: (
        <FiatFlow
          isBuyForTx={!!props.buyForTx}
          quote={fiatQuoteQuery.data}
          onBack={() => {
            setScreen({
              id: "buy-with-fiat",
            });
          }}
          client={client}
          testMode={
            buyWithFiatOptions !== false
              ? buyWithFiatOptions?.testMode || false
              : false
          }
          theme={
            typeof props.theme === "string" ? props.theme : props.theme.type
          }
          onViewPendingTx={props.onViewPendingTx}
          openedWindow={openedWindow}
          onDone={props.onDone}
          isEmbed={props.isEmbed}
        />
      ),
    });
  }

  function showFees() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    setDrawerScreen(
      <div>
        <Text size="lg" color="primaryText">
          Fees
        </Text>

        <Spacer y="lg" />
        <FiatFees quote={fiatQuoteQuery.data} />
      </div>,
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function getErrorMessage(err: any): string[] {
    type AmountTooLowError = {
      code: "MINIMUM_PURCHASE_AMOUNT";
      data: {
        minimumAmountUSDCents: number;
        requestedAmountUSDCents: number;
      };
    };

    const defaultMessage = "Unable to get price quote";
    try {
      if (err.error.code === "MINIMUM_PURCHASE_AMOUNT") {
        const obj = err.error as AmountTooLowError;
        return [
          `Minimum purchase amount is $${obj.data.minimumAmountUSDCents / 100}`,
          `Requested amount is $${obj.data.requestedAmountUSDCents / 100}`,
        ];
      }
    } catch {}

    return [defaultMessage];
  }

  const disableSubmit = !fiatQuoteQuery.data;

  return (
    <Container flex="column" gap="md" animate="fadein">
      <div>
        <PayWithCreditCard
          isLoading={fiatQuoteQuery.isLoading}
          value={fiatQuoteQuery.data?.fromCurrencyWithFees.amount}
          client={client}
          currency={selectedCurrency}
          onSelectCurrency={showCurrencySelector}
        />
        {/* Estimated time + View fees button */}
        <EstimatedTimeAndFees
          quoteIsLoading={fiatQuoteQuery.isLoading}
          estimatedSeconds={fiatQuoteQuery.data?.estimatedDurationSeconds}
          onViewFees={showFees}
        />
      </div>

      {/* Error message */}
      {fiatQuoteQuery.error && (
        <div>
          {getErrorMessage(fiatQuoteQuery.error).map((msg) => (
            <Text color="danger" size="sm" center multiline key={msg}>
              {msg}
            </Text>
          ))}
        </div>
      )}

      {/* Continue */}
      <Button
        variant={disableSubmit ? "outline" : "accent"}
        data-disabled={disableSubmit}
        disabled={disableSubmit}
        fullWidth
        onClick={handleSubmit}
        gap="xs"
      >
        {fiatQuoteQuery.isLoading ? (
          <>
            Getting price quote
            <Spinner size="sm" color="accentText" />
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </Container>
  );
}

function BuyForTxUI(props: {
  amountNeeded: string;
  buyForTx: BuyForTx;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.buyForTx.tx.chain);

  return (
    <Container>
      <Spacer y="xs" />
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Amount Needed</Text>
        <Container
          flex="column"
          style={{
            alignItems: "flex-end",
          }}
        >
          <Container flex="row" gap="xs" center="y">
            <Text color="primaryText" size="sm">
              {props.amountNeeded} {props.buyForTx.tokenSymbol}
            </Text>
            <TokenIcon
              chain={props.buyForTx.tx.chain}
              client={props.client}
              size="sm"
              token={NATIVE_TOKEN}
            />
          </Container>
          <Spacer y="xxs" />
          {chainQuery.data ? (
            <Text size="sm"> {chainQuery.data.name}</Text>
          ) : (
            <Skeleton height={fontSize.sm} width="50px" />
          )}
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="md" />

      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">Your Balance</Text>
        <Container flex="row" gap="xs">
          <Text color="primaryText" size="sm">
            {formatNumber(Number(toEther(props.buyForTx.balance)), 4)}{" "}
            {props.buyForTx.tokenSymbol}
          </Text>
          <TokenIcon
            chain={props.buyForTx.tx.chain}
            client={props.client}
            size="sm"
            token={NATIVE_TOKEN}
          />
        </Container>
      </Container>

      <Spacer y="md" />
      <Line />
      <Spacer y="xl" />

      <Text center size="sm">
        Purchase
      </Text>
      <Spacer y="xxs" />
    </Container>
  );
}

function createSupportedTokens(
  data: SupportedChainAndTokens,
  payOptions: PayUIOptions,
  supportedTokensOverrides?: SupportedTokens,
): SupportedTokens {
  const tokens: SupportedTokens = {};

  const isBuyWithFiatDisabled = payOptions.buyWithFiat === false;
  const isBuyWithCryptoDisabled = payOptions.buyWithCrypto === false;

  for (const x of data) {
    tokens[x.chain.id] = x.tokens.filter((t) => {
      // it token supports both - include it
      if (t.buyWithCryptoEnabled && t.buyWithFiatEnabled) {
        return true;
      }

      // if buyWithFiat is disabled, and buyWithCrypto is not supported by token - exclude the token
      if (!t.buyWithCryptoEnabled && isBuyWithFiatDisabled) {
        return false;
      }

      // if buyWithCrypto is disabled, and buyWithFiat is not supported by token - exclude the token
      if (!t.buyWithFiatEnabled && isBuyWithCryptoDisabled) {
        return false;
      }

      return true; // include the token
    });
  }

  // override with props.supportedTokens
  if (supportedTokensOverrides) {
    for (const k in supportedTokensOverrides) {
      const key = Number(k);
      const tokenList = supportedTokensOverrides[key];

      if (tokenList) {
        tokens[key] = tokenList;
      }
    }
  }

  return tokens;
}

function ChainSelectionScreen(props: {
  goBack: () => void;
  chains: Chain[];
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  setChain: (chain: Chain) => void;
}) {
  return (
    <NetworkSelectorContent
      client={props.client}
      connectLocale={props.connectLocale}
      showTabs={false}
      onBack={props.goBack}
      chains={props.chains}
      closeModal={props.goBack}
      networkSelector={{
        renderChain(renderChainProps) {
          return (
            <ChainButton
              chain={renderChainProps.chain}
              confirming={false}
              switchingFailed={false}
              onClick={() => {
                props.setChain(renderChainProps.chain);
                props.goBack();
              }}
              client={props.client}
              connectLocale={props.connectLocale}
            />
          );
        },
      }}
    />
  );
}
