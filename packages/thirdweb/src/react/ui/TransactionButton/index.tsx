import {
  waitForReceipt as doWaitForReceipt,
  type WaitForReceiptOptions,
} from "../../../transaction/actions/wait-for-tx-receipt.js";
import { Button } from "../components/buttons.js";
import { Spinner } from "../components/Spinner.js";
import { useActiveAccount } from "../../providers/wallet-provider.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { useState } from "react";

/**
 * Props for the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton) component.
 */
export type TransactionButtonProps<TWaitForReceipt extends boolean> = {
  /**
   * The a function returning a prepared transaction of type [`PreparedTransaction`](https://portal.thirdweb.com/references/typescript/v5/PreparedTransaction) to be sent when the button is clicked
   */
  transaction: () =>
    | PreparedTransaction<any>
    | Promise<PreparedTransaction<any>>;
  /**
   * Whether to wait for the transaction receipt after sending the transaction
   */
  waitForReceipt?: TWaitForReceipt;

  /**
   * Callback that will be called when the transaction is submitted onchain
   * @param transactionResult - The object of type [`WaitForReceiptOptions`](https://portal.thirdweb.com/references/typescript/v5/WaitForReceiptOptions)
   */
  onSubmitted?: (transactionResult: WaitForReceiptOptions) => void;
  /**
   *
   *Callback that will be called when the transaction is confirmed onchain
   *
   ***NOTE**: This callback will only be called if `waitForReceipt` is also set to true!
   * @param receipt - The transaction receipt object of type [`TransactionReceipt`](https://portal.thirdweb.com/references/typescript/v5/TransactionReceipt)
   */
  onReceipt?: (receipt: TransactionReceipt) => void;
  /**
   * The Error thrown when trying to send the transaction
   * @param error - The `Error` object thrown
   */
  onError?: (error: Error) => void;
  /**
   * Callback to be called when the button is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * The className to apply to the button element for custom styling
   */
  className?: string;
  /**
   * The style to apply to the button element for custom styling
   */
  style?: React.CSSProperties;
  /**
   * The `React.ReactNode` to be rendered inside the button
   */
  children: React.ReactNode;
};

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * - It shows a "Switch Network" button if the connected wallet is on a different chain than the transaction.
 * @param props - The props for this component.
 * Refer to [TransactionButtonProps](https://portal.thirdweb.com/references/typescript/v5/TransactionButtonProps) for details.
 * @example
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   onSuccess={handleSuccess}
 *   onError={handleError}
 * >
 *   Confirm Transaction
 * </TransactionButton>
 * ```
 * @component
 */
export function TransactionButton<
  const TWaitForReceipt extends boolean = false,
>(props: TransactionButtonProps<TWaitForReceipt>) {
  const {
    children,
    transaction,
    onSubmitted,
    onReceipt,
    onError,
    onClick,
    waitForReceipt,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const [isPending, setIsPending] = useState(false);

  const sendTransaction = useSendTransaction();

  if (!isPending) {
    return (
      <Button
        gap="xs"
        {...buttonProps}
        disabled={!account}
        variant={"primary"}
        data-is-loading={isPending}
        onClick={async (e) => {
          if (onClick) {
            onClick(e);
          }
          try {
            setIsPending(true);
            const resolvedTx = await transaction();

            const result = await sendTransaction.mutateAsync(resolvedTx);

            if (onSubmitted) {
              onSubmitted(result);
            }

            if (waitForReceipt) {
              const receipt = await doWaitForReceipt(result);
              if (onReceipt) {
                onReceipt(receipt);
              }
            }
          } catch (error) {
            if (onError) {
              onError(error as Error);
            }
          } finally {
            setIsPending(false);
          }
        }}
        style={{
          ...buttonProps.style,
          opacity: !account ? 0.5 : 1,
        }}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      {...buttonProps}
      data-disabled={true}
      variant={"primary"}
      style={{
        ...buttonProps.style,
        minWidth: "150px",
      }}
    >
      <Spinner size="md" color="primaryButtonText" />
    </Button>
  );
}
