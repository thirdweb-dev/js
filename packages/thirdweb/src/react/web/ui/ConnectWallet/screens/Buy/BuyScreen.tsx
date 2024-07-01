import { useMemo, useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../constants/addresses.js";
import type { Theme } from "../../../../../core/design-system/index.js";
import { useChainsQuery } from "../../../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../hooks/wallets/useActiveWalletChain.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../components/Drawer.js";
import { DynamicHeight } from "../../../components/DynamicHeight.js";
import { Container } from "../../../components/basic.js";
import type { PayUIOptions } from "../../ConnectButtonProps.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import type { SupportedTokens } from "../../defaultTokens.js";
import type { ConnectLocale } from "../../locale/types.js";
import { TokenSelector } from "../TokenSelector.js";
import { isNativeToken } from "../nativeToken.js";
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatFlow } from "./fiat/FiatFlow.js";
import { FiatScreenMain } from "./fiat/FiatScreenMain.js";
import { BuyUIMainScreen } from "./main/BuyUIMainScreen.js";
import { PaymentMethodSelectionScreen } from "./main/PaymentMethodSelection.js";
import type { BuyForTx, SelectedScreen } from "./main/types.js";
import { useUISelectionStates } from "./main/useUISelectionStates.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { SwapScreenMain } from "./swap/SwapScreenMain.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";

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
  const activeWallet = useActiveWallet();

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

  if (screen.id === "fiatFlow" && account && activeChain && activeWallet) {
    return (
      <FiatFlow
        account={account}
        activeChain={activeChain}
        activeWallet={activeWallet}
        client={client}
        isBuyForTx={!!props.buyForTx}
        isEmbed={props.isEmbed}
        onBack={() => {
          setScreen({ id: "buy-with-fiat" });
        }}
        onDone={props.onDone}
        quote={screen.quote}
        theme={typeof props.theme === "string" ? props.theme : props.theme.type}
        testMode={
          !!(
            props.payOptions.buyWithFiat !== false &&
            props.payOptions.buyWithFiat?.testMode === true
          )
        }
      />
    );
  }

  if (screen.id === "swapFlow" && account && activeChain && activeWallet) {
    return (
      <SwapFlow
        account={account}
        activeChain={activeChain}
        activeWallet={activeWallet}
        buyWithCryptoQuote={screen.quote}
        client={client}
        isEmbed={props.isEmbed}
        onBack={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        onDone={props.onDone}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
      />
    );
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
          <BuyUIMainScreen
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
            onBack={props.onBack}
          />
        )}

        {screen.id === "select-payment-method" && (
          <PaymentMethodSelectionScreen
            setScreen={(id) => setScreen({ id })}
            selectedChain={toChain}
            selectedToken={toToken}
            tokenAmount={tokenAmount}
            client={client}
            onBack={() => {
              setScreen({ id: "main" });
            }}
          />
        )}

        {screen.id === "buy-with-crypto" &&
          account &&
          activeChain &&
          activeWallet && (
            <SwapScreenMain
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
              onBack={() => setScreen({ id: "select-payment-method" })}
              activeWallet={activeWallet}
            />
          )}

        {screen.id === "buy-with-fiat" &&
          account &&
          activeChain &&
          activeWallet && (
            <FiatScreenMain
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
              onBack={() => setScreen({ id: "select-payment-method" })}
              activeChain={activeChain}
              activeWallet={activeWallet}
            />
          )}
      </div>
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

// const swapQuoteFor5PolygonMaticWithPolygonUSDC =
