import { useState } from "react";
import { trackPayEvent } from "../../../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import {
  type FiatProvider,
  FiatProviders,
} from "../../../../../../../pay/utils/commonTypes.js";
import type { Theme } from "../../../../../../core/design-system/index.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useBuyWithFiatQuote } from "../../../../../../core/hooks/pay/useBuyWithFiatQuote.js";
import { PREFERRED_FIAT_PROVIDER_STORAGE_KEY } from "../../../../../../core/utils/storage.js";
import { getErrorMessage } from "../../../../../utils/errors.js";
import {
  Drawer,
  DrawerOverlay,
  useDrawer,
} from "../../../../components/Drawer.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import { EstimatedTimeAndFees } from "../EstimatedTimeAndFees.js";
import { PayProviderSelection } from "../PayProviderSelection.js";
import { PayWithCreditCard } from "../PayWIthCreditCard.js";
import type { SelectedScreen } from "../main/types.js";
import { FiatFees } from "../swap/Fees.js";
import type { PayerInfo } from "../types.js";
import { Providers } from "./Providers.js";
import type { CurrencyMeta } from "./currencies.js";

export function FiatScreenContent(props: {
  setScreen: (screen: SelectedScreen) => void;
  tokenAmount: string;
  toToken: ERC20OrNativeToken;
  toChain: Chain;
  selectedCurrency: CurrencyMeta;
  showCurrencySelector: () => void;
  payOptions: PayUIOptions;
  theme: "light" | "dark" | Theme;
  client: ThirdwebClient;
  onDone: () => void;
  isEmbed: boolean;
  payer: PayerInfo;
  setTokenAmount: (amount: string) => void;
  setHasEditedAmount: (hasEdited: boolean) => void;
  paymentLinkId: undefined | string;
}) {
  const {
    toToken,
    tokenAmount,
    payer,
    client,
    setScreen,
    toChain,
    showCurrencySelector,
    selectedCurrency,
    paymentLinkId,
  } = props;
  const defaultRecipientAddress = (
    props.payOptions as Extract<PayUIOptions, { mode: "direct_payment" }>
  )?.paymentInfo?.sellerAddress;
  const receiverAddress =
    defaultRecipientAddress || props.payer.account.address;
  const { drawerRef, drawerOverlayRef, isOpen, setIsOpen } = useDrawer();
  const [drawerScreen, setDrawerScreen] = useState<"fees" | "providers">(
    "fees",
  );

  const buyWithFiatOptions = props.payOptions.buyWithFiat;
  const [preferredProvider, setPreferredProvider] = useState<
    FiatProvider | undefined
  >(
    buyWithFiatOptions !== false
      ? buyWithFiatOptions?.preferredProvider ||
          ((localStorage.getItem(
            PREFERRED_FIAT_PROVIDER_STORAGE_KEY,
          ) as FiatProvider | null) ??
            undefined)
      : undefined,
  );

  const supportedProviders = (() => {
    if (!buyWithFiatOptions) return [...FiatProviders];
    const options = buyWithFiatOptions?.supportedProviders ?? [];
    const optionsWithPreferred =
      options.length > 0
        ? new Set([
            ...(preferredProvider ? [preferredProvider] : []),
            ...options,
          ])
        : FiatProviders;
    return Array.from(optionsWithPreferred);
  })();

  const fiatQuoteQuery = useBuyWithFiatQuote(
    buyWithFiatOptions !== false && tokenAmount
      ? {
          fromCurrencySymbol: selectedCurrency.shorthand,
          toChainId: toChain.id,
          toAddress: receiverAddress,
          toTokenAddress: isNativeToken(toToken)
            ? NATIVE_TOKEN_ADDRESS
            : toToken.address,
          toAmount: tokenAmount,
          client,
          isTestMode: buyWithFiatOptions?.testMode,
          purchaseData: props.payOptions.purchaseData,
          fromAddress: payer.account.address,
          paymentLinkId: paymentLinkId,
          preferredProvider: preferredProvider ?? supportedProviders[0],
        }
      : undefined,
  );

  function handleSubmit() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    setScreen({
      id: "fiat-flow",
      quote: fiatQuoteQuery.data,
    });
  }

  function showFees() {
    if (!fiatQuoteQuery.data) {
      return;
    }

    setDrawerScreen("fees");
    setIsOpen(true);
  }

  function showProviders() {
    setDrawerScreen("providers");
    setIsOpen(true);
  }

  const disableSubmit = !fiatQuoteQuery.data;

  const errorMsg =
    !fiatQuoteQuery.isLoading && fiatQuoteQuery.error
      ? getErrorMessage(fiatQuoteQuery.error)
      : undefined;

  return (
    <Container flex="column" gap="lg" animate="fadein">
      {isOpen && (
        <>
          <DrawerOverlay ref={drawerOverlayRef} />
          <Drawer ref={drawerRef} close={() => setIsOpen(false)}>
            {drawerScreen === "fees" && fiatQuoteQuery.data && (
              <div>
                <Text size="lg" color="primaryText">
                  Fees
                </Text>

                <Spacer y="lg" />
                <FiatFees quote={fiatQuoteQuery.data} />
              </div>
            )}
            {drawerScreen === "providers" && (
              <div>
                <Text size="lg" color="primaryText">
                  Providers
                </Text>
                <Spacer y="lg" />
                <Providers
                  supportedProviders={supportedProviders}
                  preferredProvider={
                    preferredProvider || fiatQuoteQuery.data?.provider
                  }
                  onSelect={(provider) => {
                    setPreferredProvider(provider);
                    // save the pref in local storage
                    localStorage.setItem(
                      PREFERRED_FIAT_PROVIDER_STORAGE_KEY,
                      provider,
                    );
                    setIsOpen(false);
                  }}
                />
              </div>
            )}
          </Drawer>
        </>
      )}

      <Container flex="column" gap="sm">
        <Text size="sm">Pay with card</Text>
        <div>
          <PayWithCreditCard
            isLoading={fiatQuoteQuery.isLoading}
            value={fiatQuoteQuery.data?.fromCurrencyWithFees.amount}
            client={client}
            currency={selectedCurrency}
            onSelectCurrency={showCurrencySelector}
          />
          {/** Shows preferred or quoted provider and conditional selection */}
          <PayProviderSelection
            onShowProviders={showProviders}
            quotedProvider={fiatQuoteQuery.data?.provider}
            preferredProvider={preferredProvider}
            supportedProviders={supportedProviders}
          />
          {/* Estimated time + View fees button */}
          <EstimatedTimeAndFees
            quoteIsLoading={fiatQuoteQuery.isLoading}
            estimatedSeconds={fiatQuoteQuery.data?.estimatedDurationSeconds}
            onViewFees={showFees}
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div>
            <Text color="danger" size="xs" center multiline>
              {errorMsg.title}
            </Text>
            <Text size="xs" center multiline>
              {errorMsg.message}
            </Text>
          </div>
        )}
      </Container>

      <Button
        variant="accent"
        data-disabled={disableSubmit}
        disabled={disableSubmit}
        fullWidth
        onClick={() => {
          trackPayEvent({
            event: "confirm_onramp_quote",
            client: client,
            walletAddress: payer.account.address,
            walletType: payer.wallet.id,
            toChainId: toChain.id,
            toToken: isNativeToken(toToken) ? undefined : toToken.address,
          });
          handleSubmit();
        }}
        gap="xs"
      >
        {fiatQuoteQuery.isLoading ? (
          <>
            Getting price quote
            <Spinner size="sm" />
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </Container>
  );
}
