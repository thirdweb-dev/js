"use client";
import { useCallback, useMemo } from "react";
import type { Token } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { PurchaseData } from "../../../../pay/types.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../utils/address.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import type {
  BridgePrepareRequest,
  BridgePrepareResult,
} from "../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../core/hooks/useStepExecutor.js";
import {
  type PaymentMethod,
  usePaymentMachine,
} from "../../../core/machines/paymentMachine.js";
import { webWindowAdapter } from "../../adapters/WindowAdapter.js";
import en from "../ConnectWallet/locale/en.js";
import type { ConnectLocale } from "../ConnectWallet/locale/types.js";
import { Container } from "../components/basic.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ExecutingTxScreen } from "../TransactionButton/ExecutingScreen.js";
import { DirectPayment } from "./DirectPayment.js";
import { ErrorBanner } from "./ErrorBanner.js";
import { FundWallet } from "./FundWallet.js";
import { PaymentDetails } from "./payment-details/PaymentDetails.js";
import { PaymentSelection } from "./payment-selection/PaymentSelection.js";
import { SuccessScreen } from "./payment-success/SuccessScreen.js";
import { QuoteLoader } from "./QuoteLoader.js";
import { StepRunner } from "./StepRunner.js";
import { TransactionPayment } from "./TransactionPayment.js";

export type UIOptions = Prettify<
  {
    metadata?: {
      title?: string;
      description?: string;
      image?: string;
    };
    currency?: SupportedFiatCurrency;
  } & (
    | {
        mode: "fund_wallet";
        destinationToken: Token;
        initialAmount?: string;
        presetOptions?: [number, number, number];
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
  receiverAddress: Address | undefined;

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when the flow is completed successfully
   */
  onComplete: () => void;

  /**
   * Called when the flow encounters an error
   */
  onError: (error: Error) => void;

  /**
   * Called when the user cancels the flow
   */
  onCancel: () => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions: PayEmbedConnectOptions | undefined;

  /**
   * Locale for connect UI
   */
  connectLocale: ConnectLocale | undefined;

  /**
   * Optional purchase data for the payment
   */
  purchaseData?: PurchaseData;

  /**
   * Optional payment link ID for the payment
   */
  paymentLinkId: string | undefined;

  /**
   * Quick buy amounts
   */
  presetOptions: [number, number, number] | undefined;

  /**
   * Allowed payment methods
   * @default ["crypto", "card"]
   */
  paymentMethods?: ("crypto" | "card")[];

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
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
  presetOptions,
  paymentMethods = ["crypto", "card"],
  showThirdwebBranding = true,
}: BridgeOrchestratorProps) {
  // Initialize adapters
  const adapters = useMemo(
    () => ({
      storage: webLocalStorage,
      window: webWindowAdapter,
    }),
    [],
  );

  // Create modified connect options with branding setting
  const modifiedConnectOptions = useMemo(() => {
    if (!connectOptions) return undefined;
    return {
      ...connectOptions,
      connectModal: {
        ...connectOptions.connectModal,
        showThirdwebBranding,
      },
    };
  }, [connectOptions, showThirdwebBranding]);

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
      send({ error, type: "ERROR_OCCURRED" });
    },
    [onError, send],
  );

  // Handle payment method selection
  const handlePaymentMethodSelected = useCallback(
    (paymentMethod: PaymentMethod) => {
      send({ paymentMethod, type: "PAYMENT_METHOD_SELECTED" });
    },
    [send],
  );

  // Handle quote received
  const handleQuoteReceived = useCallback(
    (quote: BridgePrepareResult, request: BridgePrepareRequest) => {
      send({ quote, request, type: "QUOTE_RECEIVED" });
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
      send({ completedStatuses, type: "EXECUTION_COMPLETE" });
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
        destinationAmount: amount,
        destinationToken: token,
        receiverAddress,
        type: "DESTINATION_CONFIRMED",
      });
    },
    [send],
  );

  return (
    <Container flex="column" fullHeight>
      {/* Error Banner */}
      {state.value === "error" && state.context.currentError && (
        <ErrorBanner
          client={client}
          error={state.context.currentError}
          onCancel={() => {
            send({ type: "RESET" });
            onCancel?.();
          }}
          onRetry={handleRetry}
        />
      )}

      {/* Render current screen based on state */}
      {state.value === "init" && uiOptions.mode === "fund_wallet" && (
        <FundWallet
          client={client}
          connectOptions={modifiedConnectOptions}
          onContinue={handleRequirementsResolved}
          presetOptions={presetOptions}
          receiverAddress={receiverAddress}
          showThirdwebBranding={showThirdwebBranding}
          uiOptions={uiOptions}
        />
      )}

      {state.value === "init" && uiOptions.mode === "direct_payment" && (
        <DirectPayment
          client={client}
          connectOptions={modifiedConnectOptions}
          onContinue={handleRequirementsResolved}
          showThirdwebBranding={showThirdwebBranding}
          uiOptions={uiOptions}
        />
      )}

      {state.value === "init" && uiOptions.mode === "transaction" && (
        <TransactionPayment
          client={client}
          connectOptions={modifiedConnectOptions}
          onContinue={handleRequirementsResolved}
          showThirdwebBranding={showThirdwebBranding}
          uiOptions={uiOptions}
        />
      )}

      {state.value === "methodSelection" &&
        state.context.destinationToken &&
        state.context.destinationAmount &&
        state.context.receiverAddress && (
          <PaymentSelection
            client={client}
            connectLocale={connectLocale || en}
            connectOptions={modifiedConnectOptions}
            destinationAmount={state.context.destinationAmount}
            destinationToken={state.context.destinationToken}
            feePayer={
              uiOptions.mode === "direct_payment"
                ? uiOptions.paymentInfo.feePayer
                : undefined
            }
            includeDestinationToken={uiOptions.mode !== "fund_wallet"}
            onBack={() => {
              send({ type: "BACK" });
            }}
            onError={handleError}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            paymentMethods={paymentMethods}
            receiverAddress={state.context.receiverAddress}
            currency={uiOptions.currency}
          />
        )}

      {state.value === "quote" &&
        state.context.selectedPaymentMethod &&
        state.context.receiverAddress &&
        state.context.destinationToken &&
        state.context.destinationAmount && (
          <QuoteLoader
            amount={state.context.destinationAmount}
            client={client}
            destinationToken={state.context.destinationToken}
            onBack={() => {
              send({ type: "BACK" });
            }}
            onError={handleError}
            onQuoteReceived={handleQuoteReceived}
            paymentLinkId={paymentLinkId}
            paymentMethod={state.context.selectedPaymentMethod}
            purchaseData={purchaseData}
            receiver={state.context.receiverAddress}
            uiOptions={uiOptions}
          />
        )}

      {state.value === "preview" &&
        state.context.selectedPaymentMethod &&
        state.context.quote && (
          <PaymentDetails
            client={client}
            onBack={() => {
              send({ type: "BACK" });
            }}
            onConfirm={handleRouteConfirmed}
            onError={handleError}
            paymentMethod={state.context.selectedPaymentMethod}
            preparedQuote={state.context.quote}
            uiOptions={uiOptions}
          />
        )}

      {state.value === "execute" &&
        state.context.quote &&
        state.context.request &&
        state.context.selectedPaymentMethod?.payerWallet && (
          <StepRunner
            autoStart={true}
            client={client}
            onBack={() => {
              send({ type: "BACK" });
            }}
            onCancel={onCancel}
            onComplete={handleExecutionComplete}
            request={state.context.request}
            wallet={state.context.selectedPaymentMethod?.payerWallet}
            windowAdapter={webWindowAdapter}
          />
        )}

      {state.value === "success" &&
        state.context.quote &&
        state.context.completedStatuses && (
          <SuccessScreen
            client={client}
            completedStatuses={state.context.completedStatuses}
            onDone={handleBuyComplete}
            preparedQuote={state.context.quote}
            uiOptions={uiOptions}
            windowAdapter={webWindowAdapter}
          />
        )}

      {state.value === "post-buy-transaction" &&
        uiOptions.mode === "transaction" &&
        uiOptions.transaction && (
          <ExecutingTxScreen
            closeModal={handlePostBuyTransactionComplete}
            onTxSent={() => {
              // Do nothing
            }}
            tx={uiOptions.transaction}
            windowAdapter={webWindowAdapter}
          />
        )}
    </Container>
  );
}
