"use client";
import { useCallback, useMemo } from "react";
import type { Token } from "../../../../bridge/types/Token.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../utils/address.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { BridgePrepareResult } from "../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../core/hooks/useStepExecutor.js";
import {
  type PaymentMethod,
  usePaymentMachine,
} from "../../../core/machines/paymentMachine.js";
import { webWindowAdapter } from "../../adapters/WindowAdapter.js";
import en from "../ConnectWallet/locale/en.js";
import type { ConnectLocale } from "../ConnectWallet/locale/types.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { Container } from "../components/basic.js";
import { DirectPayment } from "./DirectPayment.js";
import { ErrorBanner } from "./ErrorBanner.js";
import { FundWallet } from "./FundWallet.js";
import { QuoteLoader } from "./QuoteLoader.js";
import { RoutePreview } from "./RoutePreview.js";
import { StepRunner } from "./StepRunner.js";
import { SuccessScreen } from "./SuccessScreen.js";
import { PaymentSelection } from "./payment-selection/PaymentSelection.js";

export type UIOptions =
  | {
      mode: "fund_wallet";
      destinationToken: Token;
      initialAmount?: string;
    }
  | {
      mode: "direct_payment";
      paymentInfo: {
        sellerAddress: Address;
        token: Token;
        amount: string;
        feePayer?: "sender" | "receiver";
        metadata: {
          name: string;
          image: string;
        };
      };
    }
  | { mode: "transaction"; transaction: PreparedTransaction };

export interface BridgeOrchestratorProps {
  /**
   * UI configuration and mode
   */
  uiOptions: UIOptions;

  /**
   * The receiver address, defaults to the connected wallet address
   */
  receiverAddress?: Address;

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when the flow is completed successfully
   */
  onComplete?: () => void;

  /**
   * Called when the flow encounters an error
   */
  onError?: (error: Error) => void;

  /**
   * Called when the user cancels the flow
   */
  onCancel?: () => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;

  /**
   * Locale for connect UI
   */
  connectLocale?: ConnectLocale;

  /**
   * Optional purchase data for the payment
   */
  purchaseData?: object;

  /**
   * Optional payment link ID for the payment
   */
  paymentLinkId?: string;
}

export function BridgeOrchestrator({
  client,
  uiOptions,
  receiverAddress,
  onComplete,
  onError,
  onCancel,
  connectOptions,
  connectLocale,
  purchaseData,
  paymentLinkId,
}: BridgeOrchestratorProps) {
  // Initialize adapters
  const adapters = useMemo(
    () => ({
      window: webWindowAdapter,
      storage: webLocalStorage,
    }),
    [],
  );

  // Use the payment machine hook
  const [state, send] = usePaymentMachine(adapters, uiOptions.mode);

  // Get destination token and amount based on mode
  const getDestinationInfo = () => {
    switch (uiOptions.mode) {
      case "fund_wallet":
        return {
          token: uiOptions.destinationToken,
          amount: uiOptions.initialAmount,
        };
      case "direct_payment":
        return {
          token: uiOptions.paymentInfo.token,
          amount: uiOptions.paymentInfo.amount,
        };
      case "transaction":
        // For transaction mode, we'll need to define what token/amount to use
        return {
          token: undefined,
          amount: undefined,
        };
    }
  };

  const destinationInfo = getDestinationInfo();

  // Handle completion
  const handleComplete = useCallback(() => {
    onComplete?.();
    send({ type: "RESET" });
  }, [onComplete, send]);

  // Handle errors
  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);
      send({ type: "ERROR_OCCURRED", error });
    },
    [onError, send],
  );

  // Handle payment method selection
  const handlePaymentMethodSelected = useCallback(
    (paymentMethod: PaymentMethod) => {
      send({ type: "PAYMENT_METHOD_SELECTED", paymentMethod });
    },
    [send],
  );

  // Handle quote received
  const handleQuoteReceived = useCallback(
    (preparedQuote: BridgePrepareResult) => {
      send({ type: "QUOTE_RECEIVED", preparedQuote });
    },
    [send],
  );

  // Handle route confirmation
  const handleRouteConfirmed = useCallback(() => {
    send({ type: "ROUTE_CONFIRMED" });
  }, [send]);

  // Handle execution complete
  const handleExecutionComplete = useCallback(
    (completedStatuses: CompletedStatusResult[]) => {
      send({ type: "EXECUTION_COMPLETE", completedStatuses });
    },
    [send],
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    send({ type: "RETRY" });
  }, [send]);

  // Handle requirements resolved from FundWallet and DirectPayment
  const handleRequirementsResolved = useCallback(
    (amount: string, token: Token, chain: Chain, receiverAddress: Address) => {
      send({
        type: "REQUIREMENTS_RESOLVED",
        destinationChainId: chain.id,
        destinationTokenAddress: token.address,
        destinationAmount: amount,
        receiverAddress: receiverAddress,
      });
    },
    [send],
  );

  return (
    <Container flex="column" fullHeight>
      {/* Error Banner */}
      {state.value === "error" && state.context.currentError && (
        <ErrorBanner
          error={state.context.currentError}
          onRetry={handleRetry}
          onCancel={onCancel}
        />
      )}

      {/* Render current screen based on state */}
      {state.value === "resolveRequirements" &&
        uiOptions.mode === "fund_wallet" && (
          <FundWallet
            token={uiOptions.destinationToken}
            receiverAddress={receiverAddress}
            initialAmount={uiOptions.initialAmount}
            client={client}
            onContinue={handleRequirementsResolved}
            connectOptions={connectOptions}
          />
        )}

      {state.value === "resolveRequirements" &&
        uiOptions.mode === "direct_payment" && (
          <DirectPayment
            paymentInfo={uiOptions.paymentInfo}
            client={client}
            onContinue={handleRequirementsResolved}
            connectOptions={connectOptions}
          />
        )}

      {state.value === "methodSelection" &&
        destinationInfo.token &&
        destinationInfo.amount && (
          <PaymentSelection
            destinationToken={destinationInfo.token}
            client={client}
            destinationAmount={destinationInfo.amount}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            onError={handleError}
            onBack={() => {
              send({ type: "BACK" });
            }}
            connectOptions={connectOptions}
            connectLocale={connectLocale || en}
          />
        )}

      {state.value === "quote" &&
        state.context.selectedPaymentMethod &&
        state.context.receiverAddress &&
        destinationInfo.token &&
        destinationInfo.amount && (
          <QuoteLoader
            destinationToken={destinationInfo.token}
            purchaseData={purchaseData}
            paymentLinkId={paymentLinkId}
            paymentMethod={state.context.selectedPaymentMethod}
            receiver={state.context.receiverAddress}
            amount={destinationInfo.amount}
            client={client}
            onQuoteReceived={handleQuoteReceived}
            onError={handleError}
            onBack={() => {
              send({ type: "BACK" });
            }}
          />
        )}

      {state.value === "preview" &&
        state.context.selectedPaymentMethod &&
        state.context.preparedQuote && (
          <RoutePreview
            client={client}
            paymentMethod={state.context.selectedPaymentMethod}
            preparedQuote={state.context.preparedQuote}
            onConfirm={handleRouteConfirmed}
            onBack={() => {
              send({ type: "BACK" });
            }}
            onError={handleError}
          />
        )}

      {state.value === "execute" &&
        state.context.preparedQuote &&
        state.context.selectedPaymentMethod?.payerWallet && (
          <StepRunner
            preparedQuote={state.context.preparedQuote}
            wallet={state.context.selectedPaymentMethod?.payerWallet}
            client={client}
            autoStart={true}
            windowAdapter={webWindowAdapter}
            onComplete={handleExecutionComplete}
            onCancel={onCancel}
            onBack={() => {
              send({ type: "BACK" });
            }}
          />
        )}

      {state.value === "success" &&
        state.context.preparedQuote &&
        state.context.completedStatuses && (
          <SuccessScreen
            preparedQuote={state.context.preparedQuote}
            completedStatuses={state.context.completedStatuses}
            onClose={handleComplete}
            onNewPayment={() => send({ type: "RESET" })}
            windowAdapter={webWindowAdapter}
          />
        )}
    </Container>
  );
}
