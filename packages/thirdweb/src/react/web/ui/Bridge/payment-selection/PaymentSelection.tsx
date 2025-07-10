"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import type { Token } from "../../../../../bridge/types/Token.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import type { Address } from "../../../../../utils/address.js";
import { toUnits } from "../../../../../utils/units.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { usePaymentMethods } from "../../../../core/hooks/usePaymentMethods.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useConnectedWallets } from "../../../../core/hooks/wallets/useConnectedWallets.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import type { ConnectLocale } from "../../ConnectWallet/locale/types.js";
import { WalletSwitcherConnectionScreen } from "../../ConnectWallet/screens/WalletSwitcherConnectionScreen.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import type { PayEmbedConnectOptions } from "../../PayEmbed.js";
import { FiatProviderSelection } from "./FiatProviderSelection.js";
import { TokenSelection } from "./TokenSelection.js";
import { WalletFiatSelection } from "./WalletFiatSelection.js";

export interface PaymentSelectionProps {
  /**
   * The destination token to bridge to
   */
  destinationToken: Token;

  /**
   * The destination amount to bridge
   */
  destinationAmount: string;

  /**
   * The receiver address
   */
  receiverAddress?: Address;

  /**
   * ThirdwebClient for API calls
   */
  client: ThirdwebClient;

  /**
   * Called when user selects a payment method
   */
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;

  /**
   * Called when an error occurs
   */
  onError: (error: Error) => void;

  /**
   * Called when user wants to go back
   */
  onBack?: () => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;

  /**
   * Locale for connect UI
   */
  connectLocale: ConnectLocale;

  /**
   * Whether to include the destination token in the payment methods
   */
  includeDestinationToken?: boolean;

  /**
   * Allowed payment methods
   * @default ["crypto", "card"]
   */
  paymentMethods?: ("crypto" | "card")[];

  /**
   * Fee payer
   */
  feePayer?: "sender" | "receiver";

  /**
   * The currency to use for the payment.
   * @default "USD"
   */
  currency?: SupportedFiatCurrency;
}

type Step =
  | { type: "walletSelection" }
  | { type: "tokenSelection"; selectedWallet: Wallet }
  | { type: "fiatProviderSelection" }
  | { type: "walletConnection" };

export function PaymentSelection({
  destinationToken,
  client,
  destinationAmount,
  receiverAddress,
  onPaymentMethodSelected,
  onError,
  onBack,
  connectOptions,
  connectLocale,
  includeDestinationToken,
  paymentMethods = ["crypto", "card"],
  feePayer,
  currency,
}: PaymentSelectionProps) {
  const connectedWallets = useConnectedWallets();
  const activeWallet = useActiveWallet();

  const [currentStep, setCurrentStep] = useState<Step>({
    type: "walletSelection",
  });

  useQuery({
    queryFn: () => {
      trackPayEvent({
        client,
        event: "payment_selection",
        toChainId: destinationToken.chainId,
        toToken: destinationToken.address,
      });
      return true;
    },
    queryKey: ["payment_selection"],
  });

  const payerWallet =
    currentStep.type === "tokenSelection"
      ? currentStep.selectedWallet
      : activeWallet;
  const {
    data: suitableTokenPaymentMethods,
    isLoading: paymentMethodsLoading,
    error: paymentMethodsError,
  } = usePaymentMethods({
    client,
    destinationAmount,
    destinationToken,
    includeDestinationToken:
      includeDestinationToken ||
      receiverAddress?.toLowerCase() !==
        payerWallet?.getAccount()?.address?.toLowerCase(),
    payerWallet,
  });

  // Handle error from usePaymentMethods
  useEffect(() => {
    if (paymentMethodsError) {
      onError(paymentMethodsError as Error);
    }
  }, [paymentMethodsError, onError]);

  const handlePaymentMethodSelected = (paymentMethod: PaymentMethod) => {
    try {
      onPaymentMethodSelected(paymentMethod);
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleWalletSelected = (wallet: Wallet) => {
    setCurrentStep({ selectedWallet: wallet, type: "tokenSelection" });
  };

  const handleConnectWallet = async () => {
    setCurrentStep({ type: "walletConnection" });
  };

  const handleFiatSelected = () => {
    setCurrentStep({ type: "fiatProviderSelection" });
  };

  const handleBackToWalletSelection = () => {
    setCurrentStep({ type: "walletSelection" });
  };

  const handleOnrampProviderSelected = (
    provider: "coinbase" | "stripe" | "transak",
  ) => {
    if (!payerWallet) {
      onError(new Error("No wallet available for fiat payment"));
      return;
    }

    const fiatPaymentMethod: PaymentMethod = {
      currency: "USD",
      onramp: provider,
      payerWallet, // Default to USD for now
      type: "fiat",
    };
    handlePaymentMethodSelected(fiatPaymentMethod);
  };

  const getStepTitle = () => {
    switch (currentStep.type) {
      case "walletSelection":
        return "Choose Payment Method";
      case "tokenSelection":
        return "Select Token";
      case "fiatProviderSelection":
        return "Select Payment Provider";
      case "walletConnection":
        return "Connect Wallet";
    }
  };

  const getBackHandler = () => {
    switch (currentStep.type) {
      case "walletSelection":
        return onBack;
      case "tokenSelection":
      case "fiatProviderSelection":
      case "walletConnection":
        return handleBackToWalletSelection;
    }
  };

  // Handle rendering WalletSwitcherConnectionScreen
  if (currentStep.type === "walletConnection") {
    const destinationChain = destinationToken
      ? defineChain(destinationToken.chainId)
      : undefined;
    const chains = destinationChain
      ? [destinationChain, ...(connectOptions?.chains || [])]
      : connectOptions?.chains;

    return (
      <WalletSwitcherConnectionScreen
        accountAbstraction={connectOptions?.accountAbstraction}
        appMetadata={connectOptions?.appMetadata}
        chain={destinationChain || connectOptions?.chain}
        chains={chains}
        client={client}
        connectLocale={connectLocale}
        hiddenWallets={[]}
        isEmbed={false}
        onBack={handleBackToWalletSelection}
        onSelect={handleWalletSelected}
        recommendedWallets={connectOptions?.recommendedWallets}
        showAllWallets={
          connectOptions?.showAllWallets === undefined
            ? true
            : connectOptions?.showAllWallets
        }
        walletConnect={connectOptions?.walletConnect}
        wallets={connectOptions?.wallets?.filter((w) => w.id !== "inApp")}
      />
    );
  }

  return (
    <Container flex="column" p="lg">
      <ModalHeader onBack={getBackHandler()} title={getStepTitle()} />

      <Spacer y="xl" />

      <Container flex="column">
        {currentStep.type === "walletSelection" && (
          <WalletFiatSelection
            client={client}
            connectedWallets={connectedWallets}
            onConnectWallet={handleConnectWallet}
            onFiatSelected={handleFiatSelected}
            onWalletSelected={handleWalletSelected}
            paymentMethods={paymentMethods}
          />
        )}

        {currentStep.type === "tokenSelection" && (
          <TokenSelection
            client={client}
            destinationAmount={toUnits(
              destinationAmount,
              destinationToken.decimals,
            )}
            destinationToken={destinationToken}
            feePayer={feePayer}
            onBack={handleBackToWalletSelection}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            paymentMethods={suitableTokenPaymentMethods}
            paymentMethodsLoading={paymentMethodsLoading}
          />
        )}

        {currentStep.type === "fiatProviderSelection" && (
          <FiatProviderSelection
            client={client}
            onProviderSelected={handleOnrampProviderSelected}
            toAddress={receiverAddress || ""}
            toAmount={destinationAmount}
            toChainId={destinationToken.chainId}
            toTokenAddress={destinationToken.address}
            currency={currency}
          />
        )}
      </Container>
    </Container>
  );
}
