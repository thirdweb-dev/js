"use client";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import {
  type TransactionButtonProps,
  useTransactionButtonMutation,
} from "../../../core/hooks/transaction/transaction-button-utils.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * It shows a "Switch Network" button if the connected wallet is on a different chain than the transaction.
 * @param props - The props for this component.
 * Refer to [TransactionButtonProps](https://portal.thirdweb.com/references/typescript/v5/TransactionButtonProps) for details.
 * @example
 *
 * ### Basic usage
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   onTransactionConfirmed={handleSuccess}
 *   onError={handleError}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 *
 * ### Customize the styling by passing the `unstyled` prop and your inline styles and/or classes:
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   unstyled
 *   className="bg-white text-black rounded-md p-4 flex items-center justify-center"
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 *
 * ### Handle errors
 * ```tsx
 * <TransactionButton
 *   transaction={() => ...}
 *   onError={(err) => {
 *     alert(err.message);
 *     // Add your own logic here
 *   }}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 *
 * ### Alert when a transaction is sent
 * ```tsx
 * <TransactionButton
 *   transaction={() => ...}
 *   onTransactionSent={(tx) => {
 *     alert("transaction sent!");
 *     // Add your own logic here. For example, a toast
 *   }}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 *
 * ### Alert when a transaction is completed
 * ```tsx
 * <TransactionButton
 *   transaction={() => ...}
 *   onTransactionConfirmed={(tx) => {
 *     alert("transaction sent!");
 *     console.log(tx);
 *     // Add your own logic here. For example, a toast
 *   }}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 *
 * ### The onClick prop, if provided, will be called before the transaction is sent.
 * ```tsx
 * <TransactionButton
 *   onClick={() => alert("Transaction is about to be sent")}
 *   transaction={...}
 * >
 *   ...
 * </TransactionButton>
 * ```
 *
 * ### Attach custom Pay metadata
 * ```tsx
 * <TransactionButton
 *   payModal={{
 *     // This image & title will show up in the Pay modal
 *     metadata: {
 *       name: "Van Gogh Starry Night",
 *       image: "https://unsplash.com/starry-night.png"
 *     }
 *   }}
 * >
 *   ...
 * </TransactionButton>
 * ```
 *
 * ### Gasless usage with [thirdweb Engine](https://portal.thirdweb.com/engine)
 * ```tsx
 * <TransactionButton
 *   gasless={{
 *     provider: "engine",
 *     relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
 *     relayerForwarderAddress: "0x...",
 *   }}
 * >
 *   ...
 * </TransactionButton>
 * ```
 *
 * ### Gasless usage with OpenZeppelin
 * ```tsx
 * <TransactionButton
 *   gasless={{
 *     provider: "openzeppelin",
 *     relayerUrl: "https://...",
 *     relayerForwarderAddress: "0x...",
 *   }}
 * >
 *   ...
 * </TransactionButton>
 * ```
 * @component
 * @transaction
 */
export function TransactionButton(props: TransactionButtonProps) {
  const {
    children,
    transaction,
    onTransactionSent,
    onTransactionConfirmed,
    onError,
    onClick,
    gasless,
    payModal,
    disabled,
    unstyled,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const sendTransaction = useSendTransaction({ gasless, payModal });
  const { mutate: handleClick, isPending } = useTransactionButtonMutation(
    props,
    sendTransaction.mutateAsync,
  );

  return (
    <CustomThemeProvider theme={props.theme}>
      <Button
        gap="xs"
        disabled={!account || disabled || isPending}
        variant="primary"
        unstyled={unstyled}
        data-is-loading={isPending}
        onClick={() => handleClick()}
        {...buttonProps}
        style={
          !unstyled
            ? {
                opacity: !account || disabled ? 0.5 : 1,
                minWidth: "165px",
                position: "relative",
                ...buttonProps.style,
              }
            : {
                position: "relative",
                ...buttonProps.style,
              }
        }
      >
        <span style={{ visibility: isPending ? "hidden" : "visible" }}>
          {children}
        </span>
        {isPending && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              height: "100%",
              top: 0,
              bottom: 0,
              margin: "auto",
            }}
          >
            <Spinner size="md" color="primaryButtonText" />
          </div>
        )}
      </Button>
    </CustomThemeProvider>
  );
}
