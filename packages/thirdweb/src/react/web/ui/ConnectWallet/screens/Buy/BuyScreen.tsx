import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { trackPayEvent } from "../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../../../constants/addresses.js";
import type { BuyWithCryptoStatus } from "../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../pay/buyWithFiat/getStatus.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../../../wallets/wallet-types.js";
import {
  fontSize,
  spacing,
  type Theme,
} from "../../../../../core/design-system/index.js";
import type {
  FundWalletOptions,
  PayUIOptions,
} from "../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../../../core/hooks/wallets/useActiveAccount.js";
import { invalidateWalletBalance } from "../../../../../core/providers/invalidateWalletBalance.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../core/utils/defaultTokens.js";
import { ErrorState } from "../../../../wallets/shared/ErrorState.js";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { ChainName } from "../../../components/ChainName.js";
import { Input } from "../../../components/formElements.js";
import { Spacer } from "../../../components/Spacer.js";
import { TokenSymbol } from "../../../components/token/TokenSymbol.js";
import type { PayEmbedConnectOptions } from "../../../PayEmbed.js";
import { ConnectButton } from "../../ConnectButton.js";
import type { ConnectLocale } from "../../locale/types.js";
import { ChainButton, NetworkSelectorContent } from "../../NetworkSelector.js";
import { PoweredByThirdweb } from "../../PoweredByTW.js";
import { type ERC20OrNativeToken, isNativeToken } from "../nativeToken.js";
import { TokenSelector } from "../TokenSelector.js";
import { WalletSwitcherConnectionScreen } from "../WalletSwitcherConnectionScreen.js";
import { DirectPaymentModeScreen } from "./DirectPaymentModeScreen.js";
import { CurrencySelection } from "./fiat/CurrencySelection.js";
import { FiatScreenContent } from "./fiat/FiatScreenContent.js";
import { OnRampScreen } from "./fiat/OnRampScreen.js";
import type { SelectedScreen } from "./main/types.js";
import {
  type PaymentMethods,
  useEnabledPaymentMethods,
} from "./main/useEnabledPaymentMethods.js";
import {
  useFiatCurrencySelectionStates,
  useFromTokenSelectionStates,
  useToTokenSelectionStates,
} from "./main/useUISelectionStates.js";
import { PayTokenIcon } from "./PayTokenIcon.js";
import { BuyTokenInput } from "./swap/BuyTokenInput.js";
import { FiatValue } from "./swap/FiatValue.js";
import { useWalletsAndBalances } from "./swap/fetchBalancesForWallet.js";
import { SwapFlow } from "./swap/SwapFlow.js";
import { SwapScreenContent } from "./swap/SwapScreenContent.js";
import { TokenSelectorScreen } from "./swap/TokenSelectorScreen.js";
import { TransferFlow } from "./swap/TransferFlow.js";
import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
  useBuySupportedSources,
} from "./swap/useSwapSupportedChains.js";
import { TransactionModeScreen } from "./TransactionModeScreen.js";
import { usePayerSetup } from "./usePayerSetup.js";

export type BuyScreenProps = {
  title: string;
  onBack: (() => void) | undefined;
  supportedTokens: SupportedTokens | undefined;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  onDone: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  hiddenWallets?: WalletId[];
  isEmbed: boolean;
  paymentLinkId?: string;
};

/**
 * @internal
 */
export default function BuyScreen(props: BuyScreenProps) {
  const isTestMode = props.payOptions.buyWithCrypto
    ? props.payOptions.buyWithCrypto.testMode
    : undefined;
  const supportedDestinationsQuery = useBuySupportedDestinations(
    props.client,
    isTestMode,
  );

  if (supportedDestinationsQuery.isError) {
    return (
      <Container
        center="both"
        flex="row"
        fullHeight
        style={{
          minHeight: "350px",
        }}
      >
        <ErrorState
          onTryAgain={supportedDestinationsQuery.refetch}
          title="Something went wrong"
        />
      </Container>
    );
  }

  if (!supportedDestinationsQuery.data) {
    return <LoadingScreen />;
  }

  const supportedDestinations = props.supportedTokens
    ? Object.entries(props.supportedTokens).map(([chainId, tokens]) => ({
        chain: getCachedChain(Number.parseInt(chainId)),
        tokens: tokens.map((t) => ({
          ...t,
          buyWithCryptoEnabled: true,
          buyWithFiatEnabled: true,
        })),
      }))
    : supportedDestinationsQuery.data;

  return (
    <BuyScreenContent
      {...props}
      supportedDestinations={supportedDestinations}
    />
  );
}

type BuyScreenContentProps = {
  title: string;
  client: ThirdwebClient;
  onBack?: () => void;
  supportedTokens?: SupportedTokens;
  supportedDestinations: SupportedChainAndTokens;
  connectLocale: ConnectLocale;
  theme: "light" | "dark" | Theme;
  payOptions: PayUIOptions;
  onDone: () => void;
  hiddenWallets?: WalletId[];
  connectOptions: PayEmbedConnectOptions | undefined;
  isEmbed: boolean;
  paymentLinkId?: string;
};

/**
 * @internal
 */
function BuyScreenContent(props: BuyScreenContentProps) {
  const { client, supportedDestinations, connectLocale, payOptions } = props;

  const activeAccount = useActiveAccount();
  const { payer, setPayer } = usePayerSetup();

  const [screen, setScreen] = useState<SelectedScreen>({
    id: "main",
  });

  const {
    tokenAmount,
    setTokenAmount,
    toChain,
    setToChain,
    deferredTokenAmount,
    toToken,
    setToToken,
  } = useToTokenSelectionStates({
    payOptions,
    supportedDestinations,
  });

  const [hasEditedAmount, setHasEditedAmount] = useState(false);

  const onDone = useCallback(() => {
    setScreen({ id: "main" });
    props.onDone();
  }, [props.onDone]);

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

    const supportedSources = supportedSourcesQuery.data;

    return createSupportedTokens(
      supportedSources,
      payOptions,
      props.supportedTokens,
    );
  }, [props.supportedTokens, supportedSourcesQuery.data, payOptions]);

  // preload wallets and balances
  useWalletsAndBalances({
    client: props.client,
    mode: payOptions.mode,
    sourceSupportedTokens: sourceSupportedTokens || [],
    toChain: toChain,
    toToken: toToken,
  });

  const { fromChain, setFromChain, fromToken, setFromToken } =
    useFromTokenSelectionStates({
      payOptions,
      supportedSources: supportedSourcesQuery.data || [],
    });

  const { selectedCurrency, setSelectedCurrency } =
    useFiatCurrencySelectionStates({
      payOptions,
    });

  const enabledPaymentMethods = useEnabledPaymentMethods({
    payOptions: props.payOptions,
    supportedDestinations: props.supportedDestinations,
    toChain: toChain,
    toToken: toToken,
  });

  const payDisabled =
    enabledPaymentMethods.buyWithCryptoEnabled === false &&
    enabledPaymentMethods.buyWithFiatEnabled === false;

  // screens ----------------------------

  const queryClient = useQueryClient();

  const onSwapSuccess = useCallback(
    (_status: BuyWithCryptoStatus) => {
      props.payOptions.onPurchaseSuccess?.({
        status: _status,
        type: "crypto",
      });
      invalidateWalletBalance(queryClient);
    },
    [props.payOptions.onPurchaseSuccess, queryClient],
  );

  const onFiatSuccess = useCallback(
    (_status: BuyWithFiatStatus) => {
      props.payOptions.onPurchaseSuccess?.({
        status: _status,
        type: "fiat",
      });
      invalidateWalletBalance(queryClient);
    },
    [props.payOptions.onPurchaseSuccess, queryClient],
  );

  if (screen.id === "connect-payer-wallet") {
    return (
      <WalletSwitcherConnectionScreen
        accountAbstraction={props.connectOptions?.accountAbstraction}
        appMetadata={props.connectOptions?.appMetadata}
        chain={toChain || props.connectOptions?.chain}
        chains={[toChain, ...(props.connectOptions?.chains || [])]}
        client={props.client}
        connectLocale={props.connectLocale}
        hiddenWallets={props.hiddenWallets}
        isEmbed={props.isEmbed}
        onBack={() => setScreen(screen.backScreen)}
        onSelect={(w) => {
          const account = w.getAccount();
          const chain = w.getChain();
          if (w && account && chain) {
            setPayer({
              account,
              chain,
              wallet: w,
            });
          }
        }}
        recommendedWallets={props.connectOptions?.recommendedWallets}
        showAllWallets={
          props.connectOptions?.showAllWallets === undefined
            ? true
            : props.connectOptions?.showAllWallets
        }
        walletConnect={props.connectOptions?.walletConnect}
        wallets={props.connectOptions?.wallets?.filter((w) => w.id !== "inApp")}
      />
    );
  }

  if (screen.id === "swap-flow" && payer) {
    return (
      <SwapFlow
        approvalAmount={screen.approvalAmount}
        buyWithCryptoQuote={screen.quote}
        client={client}
        isEmbed={props.isEmbed}
        isFiatFlow={false}
        onBack={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        onDone={onDone}
        onSuccess={onSwapSuccess}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        payer={payer}
        title={props.title}
        transactionMode={payOptions.mode === "transaction"}
      />
    );
  }

  if (screen.id === "fiat-flow" && payer) {
    const defaultRecipientAddress = (
      props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
    )?.paymentInfo?.sellerAddress;
    const receiverAddress = defaultRecipientAddress || payer.account.address;
    return (
      <OnRampScreen
        client={client}
        isEmbed={props.isEmbed}
        onBack={() => {
          setScreen({
            id: "buy-with-fiat",
          });
        }}
        onDone={onDone}
        onSuccess={onFiatSuccess}
        payer={payer}
        paymentLinkId={props.paymentLinkId}
        quote={screen.quote}
        receiverAddress={receiverAddress}
        testMode={
          props.payOptions.buyWithFiat !== false &&
          props.payOptions.buyWithFiat?.testMode === true
        }
        theme={typeof props.theme === "string" ? props.theme : props.theme.type}
        title={props.title}
        transactionMode={payOptions.mode === "transaction"}
      />
    );
  }

  if (screen.id === "transfer-flow" && payer && activeAccount) {
    const goBack = () => setScreen({ id: "buy-with-crypto" });
    // TODO (pay) pass it via screen props
    const defaultRecipientAddress = (
      props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
    )?.paymentInfo?.sellerAddress;
    const receiverAddress = defaultRecipientAddress || activeAccount.address;
    return (
      <TransferFlow
        chain={toChain}
        client={props.client}
        isEmbed={props.isEmbed}
        onBack={goBack}
        onDone={onDone}
        onSuccess={onSwapSuccess}
        onTryAgain={() => {
          setScreen({
            id: "buy-with-crypto",
          });
        }}
        payer={payer}
        paymentLinkId={props.paymentLinkId}
        payOptions={payOptions}
        receiverAddress={receiverAddress}
        title={props.title}
        token={toToken}
        tokenAmount={tokenAmount}
        transactionMode={props.payOptions.mode === "transaction"}
      />
    );
  }

  if (screen.id === "select-currency") {
    const goBack = () => setScreen(screen.backScreen);
    return (
      <CurrencySelection
        onBack={goBack}
        onSelect={(currency) => {
          goBack();
          setSelectedCurrency(currency);
        }}
      />
    );
  }

  if (screen.id === "select-to-token") {
    const chains = supportedDestinations.map((x) => x.chain);
    const goBack = () => setScreen(screen.backScreen);
    const allowEdits = (payOptions as FundWalletOptions)?.prefillBuy
      ?.allowEdits;
    // if token selection is disabled - only show network selector screen
    if (allowEdits?.token === false) {
      return (
        <ChainSelectionScreen
          chains={chains}
          client={props.client}
          connectLocale={props.connectLocale}
          goBack={goBack}
          setChain={setToChain}
        />
      );
    }

    return (
      <TokenSelector
        chain={toChain}
        chainSelection={
          // hide chain selection if it's disabled
          allowEdits?.chain !== false
            ? {
                chains: chains,
                select: (c) => {
                  setToChain(c);
                },
              }
            : undefined
        }
        client={client}
        connectLocale={connectLocale}
        modalTitle={props.title}
        onBack={goBack}
        onTokenSelect={(tokenInfo) => {
          setToToken(tokenInfo);
          goBack();
        }}
        tokenList={(
          (toChain?.id ? destinationSupportedTokens[toChain.id] : undefined) ||
          []
        ).filter(
          (x) => x.address.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase(),
        )}
      />
    );
  }

  return (
    <Container animate="fadein">
      <div>
        {screen.id === "main" && (
          <MainScreen
            client={client}
            connectOptions={props.connectOptions}
            enabledPaymentMethods={enabledPaymentMethods}
            hasEditedAmount={hasEditedAmount}
            onBack={props.onBack}
            onSelectBuyToken={() =>
              setScreen({ backScreen: screen, id: "select-to-token" })
            }
            payerAccount={payer?.account}
            payOptions={payOptions}
            setFromChain={setFromChain}
            setFromToken={setFromToken}
            setHasEditedAmount={setHasEditedAmount}
            setScreen={setScreen}
            setToChain={setToChain}
            setTokenAmount={setTokenAmount}
            setToToken={setToToken}
            supportedDestinations={supportedDestinations}
            theme={props.theme}
            title={props.title}
            toChain={toChain}
            tokenAmount={tokenAmount}
            toToken={toToken}
          />
        )}

        {(screen.id === "select-payment-method" ||
          screen.id === "buy-with-crypto" ||
          screen.id === "buy-with-fiat" ||
          screen.id === "select-from-token") &&
          payer && (
            <TokenSelectedLayout
              client={client}
              disabled={
                ("prefillBuy" in payOptions &&
                  payOptions.prefillBuy?.allowEdits?.amount === false) ||
                payOptions.mode !== "fund_wallet"
              }
              onBack={() => {
                if (
                  (screen.id === "buy-with-crypto" ||
                    screen.id === "buy-with-fiat") &&
                  enabledPaymentMethods.buyWithCryptoEnabled
                ) {
                  setScreen({
                    backScreen: { id: "main" },
                    id: "select-from-token",
                  });
                } else if (screen.id === "select-from-token") {
                  setScreen(screen.backScreen);
                } else {
                  setScreen({ id: "main" });
                }
              }}
              selectedChain={toChain}
              selectedToken={toToken}
              setTokenAmount={setTokenAmount}
              title={props.title}
              tokenAmount={tokenAmount}
            >
              {screen.id === "buy-with-crypto" && activeAccount && (
                <SwapScreenContent
                  activeAccount={activeAccount}
                  client={client}
                  connectLocale={connectLocale}
                  connectOptions={props.connectOptions}
                  disableTokenSelection={
                    payDisabled === true ||
                    (payOptions.buyWithCrypto !== false &&
                      payOptions.buyWithCrypto?.prefillSource?.allowEdits
                        ?.chain === false &&
                      payOptions.buyWithCrypto?.prefillSource?.allowEdits
                        ?.token === false)
                  }
                  fromChain={fromChain}
                  fromToken={fromToken as TokenInfo}
                  isEmbed={props.isEmbed}
                  onDone={onDone}
                  payer={payer}
                  paymentLinkId={props.paymentLinkId}
                  payOptions={payOptions}
                  setHasEditedAmount={setHasEditedAmount}
                  setPayer={setPayer}
                  setScreen={setScreen}
                  setTokenAmount={setTokenAmount}
                  // pass it even though we are passing payer, because payer might be different
                  showFromTokenSelector={() => {
                    setScreen({
                      backScreen: screen,
                      id: "select-from-token",
                    });
                  }}
                  toChain={toChain}
                  tokenAmount={deferredTokenAmount}
                  toToken={toToken}
                />
              )}

              {screen.id === "buy-with-fiat" && (
                <FiatScreenContent
                  client={client}
                  isEmbed={props.isEmbed}
                  onDone={onDone}
                  payer={payer}
                  paymentLinkId={props.paymentLinkId}
                  payOptions={payOptions}
                  selectedCurrency={selectedCurrency}
                  setHasEditedAmount={setHasEditedAmount}
                  setScreen={setScreen}
                  setTokenAmount={setTokenAmount}
                  showCurrencySelector={() => {
                    setScreen({
                      backScreen: screen,
                      id: "select-currency",
                    });
                  }}
                  theme={props.theme}
                  toChain={toChain}
                  tokenAmount={deferredTokenAmount}
                  toToken={toToken}
                />
              )}

              {screen.id === "select-from-token" &&
                supportedSourcesQuery.data &&
                sourceSupportedTokens && (
                  <TokenSelectorScreen
                    client={props.client}
                    fiatSupported={props.payOptions.buyWithFiat !== false}
                    hiddenWallets={props.hiddenWallets}
                    mode={payOptions.mode}
                    onConnect={() => {
                      setScreen({
                        backScreen: screen,
                        id: "connect-payer-wallet",
                      });
                    }}
                    onPayWithFiat={() => {
                      setScreen({
                        id: "buy-with-fiat",
                      });
                    }}
                    onSelectToken={(w, token, chain) => {
                      const account = w.getAccount();
                      if (account) {
                        setPayer({
                          account,
                          chain,
                          wallet: w,
                        });
                        setFromToken(token);
                        setFromChain(chain);
                      }
                      setScreen({ id: "buy-with-crypto" });
                    }}
                    sourceSupportedTokens={sourceSupportedTokens}
                    sourceTokens={sourceSupportedTokens}
                    toChain={toChain}
                    tokenAmount={tokenAmount}
                    toToken={toToken}
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
  setTokenAmount: (amount: string) => void;
  client: ThirdwebClient;
  disabled?: boolean;
}) {
  const getWidth = () => {
    const amount = formatNumber(Number(props.tokenAmount), 6).toString();
    let chars = amount.replace(".", "").length;
    const hasDot = amount.includes(".");
    if (hasDot) {
      chars += 0.3;
    }
    return `calc(${`${Math.max(1, chars)}ch + 2px`})`;
  };
  return (
    <div>
      <Container
        center="y"
        flex="row"
        gap="sm"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Container center="y" flex="row" gap="xxs">
          <Input
            data-placeholder={props.tokenAmount === ""}
            disabled={props.disabled}
            inputMode="decimal"
            onChange={(e) => {
              let value = e.target.value;

              // Replace comma with period if it exists
              value = value.replace(",", ".");

              if (value.startsWith(".")) {
                value = `0${value}`;
              }

              if (value.length > 10) {
                return;
              }

              const numValue = Number(value);
              if (Number.isNaN(numValue)) {
                return;
              }

              if (value.startsWith("0") && !value.startsWith("0.")) {
                props.setTokenAmount(value.slice(1));
              } else {
                props.setTokenAmount(value);
              }
            }}
            onClick={(e) => {
              // put cursor at the end of the input
              if (props.tokenAmount === "") {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }
            }}
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0"
            style={{
              border: "none",
              borderRadius: "0",
              boxShadow: "none",
              fontSize: fontSize.lg,
              fontWeight: 600,
              padding: "0",
              paddingBlock: "2px",
              textAlign: "left",
              width: getWidth(),
            }}
            tabIndex={-1}
            type="text"
            value={props.tokenAmount || "0"}
            variant="outline"
          />

          <Container center="y" flex="row" gap="xxs">
            <TokenSymbol
              chain={props.selectedChain}
              color="secondaryText"
              size="md"
              token={props.selectedToken}
            />
            <PayTokenIcon
              chain={props.selectedChain}
              client={props.client}
              size="sm"
              token={props.selectedToken}
            />
          </Container>

          <FiatValue
            chain={props.selectedChain}
            client={props.client}
            size="sm"
            token={props.selectedToken}
            tokenAmount={props.tokenAmount}
          />
        </Container>

        <ChainName
          chain={props.selectedChain}
          client={props.client}
          short
          size="sm"
        />
      </Container>
    </div>
  );
}

function MainScreen(props: {
  title: string;
  client: ThirdwebClient;
  setTokenAmount: (amount: string) => void;
  setFromChain: (chain: Chain) => void;
  setFromToken: (token: ERC20OrNativeToken) => void;
  setToChain: (chain: Chain) => void;
  setToToken: (token: ERC20OrNativeToken) => void;
  payerAccount: Account | undefined;
  tokenAmount: string;
  payOptions: PayUIOptions;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  onSelectBuyToken: () => void;
  connectOptions: PayEmbedConnectOptions | undefined;
  setScreen: (screen: SelectedScreen) => void;
  supportedDestinations: SupportedChainAndTokens;
  onBack: (() => void) | undefined;
  theme: "light" | "dark" | Theme;
  hasEditedAmount: boolean;
  setHasEditedAmount: (hasEdited: boolean) => void;
  enabledPaymentMethods: PaymentMethods;
}) {
  const {
    setTokenAmount,
    setToChain,
    setToToken,
    setFromChain,
    setFromToken,
    payerAccount,
    client,
    tokenAmount,
    payOptions,
    toToken,
    toChain,
    supportedDestinations,
    enabledPaymentMethods,
  } = props;

  const { buyWithCryptoEnabled, buyWithFiatEnabled } = enabledPaymentMethods;
  const disableContinue = !tokenAmount;

  switch (payOptions.mode) {
    case "transaction": {
      return (
        <TransactionModeScreen
          client={client}
          connectOptions={props.connectOptions}
          onContinue={(tokenAmount, toChain, toToken) => {
            setTokenAmount(tokenAmount);
            setToChain(toChain);
            setFromChain(toChain);
            setFromToken(toToken);
            setToToken(toToken);
            if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
              props.setScreen({ id: "buy-with-fiat" });
            } else {
              props.setScreen({
                backScreen: { id: "main" },
                id: "select-from-token",
              });
            }
          }}
          payerAccount={payerAccount}
          payUiOptions={payOptions}
          supportedDestinations={supportedDestinations}
        />
      );
    }
    case "direct_payment": {
      return (
        <DirectPaymentModeScreen
          client={client}
          connectOptions={props.connectOptions}
          onContinue={(tokenAmount, toChain, toToken) => {
            setTokenAmount(tokenAmount);
            setToChain(toChain);
            setFromChain(toChain);
            setFromToken(toToken);
            setToToken(toToken);
            if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
              props.setScreen({ id: "buy-with-fiat" });
            } else {
              props.setScreen({
                backScreen: { id: "main" },
                id: "select-from-token",
              });
            }
          }}
          payerAccount={payerAccount}
          payUiOptions={payOptions}
          supportedDestinations={supportedDestinations}
        />
      );
    }
    default: {
      return (
        <Container px="lg">
          <Spacer y="lg" />
          <ModalHeader onBack={props.onBack} title={props.title} />

          <Spacer y="xl" />

          {/* To */}
          <BuyTokenInput
            chain={toChain}
            client={props.client}
            freezeAmount={payOptions.prefillBuy?.allowEdits?.amount === false}
            freezeChainAndToken={
              (payOptions.prefillBuy?.allowEdits?.chain === false &&
                payOptions.prefillBuy?.allowEdits?.token === false) ||
              (payOptions.buyWithCrypto !== false &&
                payOptions.buyWithCrypto?.prefillSource?.allowEdits?.token ===
                  false &&
                payOptions.buyWithCrypto?.prefillSource?.allowEdits?.chain ===
                  false)
            }
            onChange={async (value) => {
              props.setHasEditedAmount(true);
              setTokenAmount(value);
            }}
            onSelectToken={props.onSelectBuyToken}
            token={toToken}
            value={tokenAmount}
          />

          <Spacer y="md" />

          {/* Continue */}
          <Container flex="column" gap="sm">
            {!payerAccount ? (
              <div>
                <ConnectButton
                  {...props.connectOptions}
                  client={props.client}
                  connectButton={{
                    style: {
                      width: "100%",
                    },
                  }}
                  theme={props.theme}
                />
              </div>
            ) : (
              <Button
                data-disabled={disableContinue}
                disabled={disableContinue}
                fullWidth
                onClick={() => {
                  if (buyWithFiatEnabled && !buyWithCryptoEnabled) {
                    props.setScreen({ id: "buy-with-fiat" });
                  } else {
                    props.setScreen({
                      backScreen: { id: "main" },
                      id: "select-from-token",
                    });
                  }
                  trackPayEvent({
                    client,
                    event: "choose_payment_method_fund_wallet_mode",
                    toChainId: toChain.id,
                    toToken: isNativeToken(toToken)
                      ? undefined
                      : toToken.address,
                    walletAddress: payerAccount.address,
                  });
                }}
                variant="accent"
              >
                Continue
              </Button>
            )}
          </Container>
          <Spacer y="lg" />
          {payOptions.showThirdwebBranding !== false && (
            <>
              <PoweredByThirdweb link="https://playground.thirdweb.com/connect/pay?utm_source=ub_text" />
              <Spacer y="sm" />
            </>
          )}
        </Container>
      );
    }
  }
}

function TokenSelectedLayout(props: {
  title: string;
  children: React.ReactNode;
  tokenAmount: string;
  setTokenAmount: (amount: string) => void;
  selectedToken: ERC20OrNativeToken;
  selectedChain: Chain;
  client: ThirdwebClient;
  onBack: () => void;
  disabled?: boolean;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.title} />
      </Container>

      <Container
        px="lg"
        style={{
          paddingBottom: spacing.lg,
        }}
      >
        <Spacer y="xs" />
        <SelectedTokenInfo
          client={props.client}
          disabled={props.disabled}
          selectedChain={props.selectedChain}
          selectedToken={props.selectedToken}
          setTokenAmount={props.setTokenAmount}
          tokenAmount={props.tokenAmount}
        />

        <Spacer y="sm" />
        <Line />
        <Spacer y="sm" />
        {props.children}
      </Container>
    </Container>
  );
}

function createSupportedTokens(
  data: SupportedChainAndTokens,
  payOptions: PayUIOptions,
  supportedTokensOverrides?: SupportedTokens,
): SupportedTokens {
  // dev override
  if (supportedTokensOverrides) {
    return supportedTokensOverrides;
  }

  const tokens: SupportedTokens = {};
  const isBuyWithFiatDisabled = payOptions.buyWithFiat === false;
  const isBuyWithCryptoDisabled = payOptions.buyWithCrypto === false;

  for (const x of data) {
    tokens[x.chain.id] = x.tokens.filter((t) => {
      if (t.address === ZERO_ADDRESS) {
        return false;
      }
      // for source tokens, data is not provided, so we include all of them
      if (
        t.buyWithCryptoEnabled === undefined &&
        t.buyWithFiatEnabled === undefined
      ) {
        return true;
      }
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
      chains={props.chains}
      client={props.client}
      closeModal={props.goBack}
      connectLocale={props.connectLocale}
      networkSelector={{
        renderChain(renderChainProps) {
          return (
            <ChainButton
              chain={renderChainProps.chain}
              client={props.client}
              confirming={false}
              connectLocale={props.connectLocale}
              onClick={() => {
                props.setChain(renderChainProps.chain);
                props.goBack();
              }}
              switchingFailed={false}
            />
          );
        },
      }}
      onBack={props.goBack}
      showTabs={false}
    />
  );
}
