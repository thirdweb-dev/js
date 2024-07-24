"use client";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import {
  type TransactionButtonProps,
  useTransactionButtonMutation,
} from "../../../core/hooks/transaction/transaction-button-utils.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * - It shows a "Switch Network" button if the connected wallet is on a different chain than the transaction.
 * @param props - The props for this component.
 * Refer to [TransactionButtonProps](https://portal.thirdweb.com/references/typescript/v5/TransactionButtonProps) for details.
 * @example
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   onTransactionConfirmed={handleSuccess}
 *   onError={handleError}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 * Customize the styling by passing the `unstyled` prop and your inline styles and/or classes:
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   onTransactionConfirmed={handleSuccess}
 *   onError={handleError}
 *   unstyled
 *   className="bg-white text-black rounded-md p-4 flex items-center justify-center"
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 * @component
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
        variant={"primary"}
        unstyled={unstyled}
        data-is-loading={isPending}
        onClick={() => handleClick()}
        {...buttonProps}
        style={
          !unstyled
            ? {
                opacity: !account || disabled ? 0.5 : 1,
                minWidth: "150px",
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
