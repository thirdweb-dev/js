"use client";
import { useCallback, useMemo } from "react";
import type { Token } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../utils/address.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { Prettify } from "../../../../utils/type-utils.js";
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
import { ExecutingTxScreen } from "../TransactionButton/ExecutingScreen.js";
import { Container } from "../components/basic.js";
import { DirectPayment } from "./DirectPayment.js";
import { ErrorBanner } from "./ErrorBanner.js";
import { FundWallet } from "./FundWallet.js";
import { QuoteLoader } from "./QuoteLoader.js";
import { StepRunner } from "./StepRunner.js";
import { TransactionPayment } from "./TransactionPayment.js";
import { PaymentDetails } from "./payment-details/PaymentDetails.js";
import { PaymentSelection } from "./payment-selection/PaymentSelection.js";
import { SuccessScreen } from "./payment-success/SuccessScreen.js";

export type UIOptions = Prettify<
  {
    metadata?: {
      title?: string;
      description?: string;
      image?: string;
    };
  } & (
    | {
        mode: "fund_wallet";
        destinationToken: Token;
        initialAmount?: string;
        quickOptions?: [number, number, number];
      }
    | {
        mode: "direct_payment";
        paymentInfo: {
          sellerAddress: Address;
          token: Token;
          amount: string;
          feePayer?: "sender" | "receiver";
        };
      }
    | { mode: "transaction"; transaction: PreparedTransaction }
  )
>;

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

  /**
   * Quick buy amounts
   */
  quickOptions?: [number, number, number];
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
  quickOptions,
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

  // Handle buy completion
  const handleBuyComplete = useCallback(() => {
    if (uiOptions.mode === "transaction") {
      send({ type: "CONTINUE_TO_TRANSACTION" });
    } else {
      onComplete?.();
      send({ type: "RESET" });
    }
  }, [onComplete, send, uiOptions.mode]);

  // Handle post-buy transaction completion
  const handlePostBuyTransactionComplete = useCallback(() => {
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
    (amount: string, token: Token, receiverAddress: Address) => {
      send({
        type: "DESTINATION_CONFIRMED",
        destinationToken: token,
        receiverAddress,
        destinationAmount: amount,
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
      {state.value === "init" && uiOptions.mode === "fund_wallet" && (
        <FundWallet
          uiOptions={uiOptions}
          receiverAddress={receiverAddress}
          client={client}
          onContinue={handleRequirementsResolved}
          connectOptions={connectOptions}
          quickOptions={quickOptions}
        />
      )}

      {state.value === "init" && uiOptions.mode === "direct_payment" && (
        <DirectPayment
          uiOptions={uiOptions}
          client={client}
          onContinue={handleRequirementsResolved}
          connectOptions={connectOptions}
        />
      )}

      {state.value === "init" && uiOptions.mode === "transaction" && (
        <TransactionPayment
          uiOptions={uiOptions}
          client={client}
          onContinue={handleRequirementsResolved}
          connectOptions={connectOptions}
        />
      )}

      {state.value === "methodSelection" &&
        state.context.destinationToken &&
        state.context.destinationAmount &&
        state.context.receiverAddress && (
          <PaymentSelection
            destinationToken={state.context.destinationToken}
            client={client}
            destinationAmount={state.context.destinationAmount}
            receiverAddress={state.context.receiverAddress}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            onError={handleError}
            onBack={() => {
              send({ type: "BACK" });
            }}
            connectOptions={connectOptions}
            connectLocale={connectLocale || en}
            includeDestinationToken={uiOptions.mode !== "fund_wallet"}
          />
        )}

      {state.value === "quote" &&
        state.context.selectedPaymentMethod &&
        state.context.receiverAddress &&
        state.context.destinationToken &&
        state.context.destinationAmount && (
          <QuoteLoader
            destinationToken={state.context.destinationToken}
            purchaseData={purchaseData}
            paymentLinkId={paymentLinkId}
            paymentMethod={state.context.selectedPaymentMethod}
            receiver={state.context.receiverAddress}
            amount={state.context.destinationAmount}
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
          <PaymentDetails
            uiOptions={uiOptions}
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
            uiOptions={uiOptions}
            preparedQuote={state.context.preparedQuote}
            completedStatuses={state.context.completedStatuses}
            onDone={handleBuyComplete}
            windowAdapter={webWindowAdapter}
          />
        )}

      {state.value === "post-buy-transaction" &&
        uiOptions.mode === "transaction" &&
        uiOptions.transaction && (
          <ExecutingTxScreen
            tx={uiOptions.transaction}
            windowAdapter={webWindowAdapter}
            closeModal={handlePostBuyTransactionComplete}
            onTxSent={() => {
              // Do nothing
            }}
          />
        )}
    </Container>
  );
}
