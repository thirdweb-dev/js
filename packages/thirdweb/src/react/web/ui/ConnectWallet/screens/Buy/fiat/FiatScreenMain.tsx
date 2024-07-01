import type { UseQueryResult } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import { isSwapRequiredPostOnramp } from "../../../../../../../pay/buyWithFiat/isSwapRequiredPostOnramp.js";
import type {
  Account,
  Wallet,
} from "../../../../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../../../../core/design-system/index.js";
import { useBuyWithFiatQuote } from "../../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import type { PayUIOptions } from "../../../ConnectButtonProps.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { EstimatedTimeAndFees } from "../EstimatedTimeAndFees.js";
import { PayWithCreditCard } from "../PayWIthCreditCard.js";
import { TokenSelectedLayout } from "../main/TokenSelectedLayout.js";
import type { BuyForTx, SelectedScreen } from "../main/types.js";
import { openOnrampPopup } from "../openOnRamppopup.js";
import { FiatFees } from "../swap/Fees.js";
import { addPendingTx } from "../swap/pendingSwapTx.js";
import { FiatFlow } from "./FiatFlow.js";
import type { CurrencyMeta } from "./currencies.js";

export function FiatScreenMain(props: {
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
  onBack: () => void;
  activeChain: Chain;
  activeWallet: Wallet;
}) {
  const { toToken, tokenAmount, account, client, toChain, selectedCurrency } =
    props;

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

  return <FiatScreenMainUI {...props} quoteQuery={fiatQuoteQuery} />;
}

export function FiatScreenMainUI(props: {
  setDrawerScreen: (screen: React.ReactNode) => void;
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  selectedCurrency: CurrencyMeta;
  showCurrencySelector: () => void;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  buyForTx: BuyForTx | null;
  client: ThirdwebClient;
  onViewPendingTx: () => void;
  onDone: () => void;
  isEmbed: boolean;
  onBack: () => void;
  quoteQuery: UseQueryResult<BuyWithFiatQuote>;
  activeChain: Chain;
  activeWallet: Wallet;
}) {
  const {
    toToken,
    tokenAmount,
    client,
    setScreen,
    setDrawerScreen,
    toChain,
    showCurrencySelector,
    selectedCurrency,
  } = props;

  const buyWithFiatOptions = props.payOptions.buyWithFiat;
  const fiatQuoteQuery = props.quoteQuery;

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
          activeChain={props.activeChain}
          activeWallet={props.activeWallet}
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

  const content = (
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

  return (
    <TokenSelectedLayout
      selectedChain={toChain}
      selectedToken={toToken}
      tokenAmount={tokenAmount}
      client={props.client}
      onBack={props.onBack}
    >
      {content}
    </TokenSelectedLayout>
  );
}
