import { useState } from "react";
import {
  type WaitForReceiptOptions,
  waitForReceipt as doWaitForReceipt,
} from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import { useSendTransaction } from "../../../core/hooks/contract/useSendTransaction.js";
import {
  useActiveAccount,
  useActiveWallet,
} from "../../../core/hooks/wallets/wallet-hooks.js";
import { Spinner } from "../components/Spinner.js";
import { Button } from "../components/buttons.js";

/**
 * Props for the [`TransactionButton`](https://portal.thirdweb.com/references/typescript/v5/TransactionButton) component.
 */
export type TransactionButtonProps = {
  /**
   * The a function returning a prepared transaction of type [`PreparedTransaction`](https://portal.thirdweb.com/references/typescript/v5/PreparedTransaction) to be sent when the button is clicked
   */
  transaction: () => // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
    | PreparedTransaction<any>
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
    | Promise<PreparedTransaction<any>>;

  /**
   * Callback that will be called when the transaction is submitted onchain
   * @param transactionResult - The object of type [`WaitForReceiptOptions`](https://portal.thirdweb.com/references/typescript/v5/WaitForReceiptOptions)
   */
  onTransactionSent?: (transactionResult: WaitForReceiptOptions) => void;
  /**
   *
   * Callback that will be called when the transaction is confirmed onchain.
   * If this callback is set, the component will wait for the transaction to be confirmed.
   * @param receipt - The transaction receipt object of type [`TransactionReceipt`](https://portal.thirdweb.com/references/typescript/v5/TransactionReceipt)
   */
  onTransactionConfirmed?: (receipt: TransactionReceipt) => void;
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
export function TransactionButton(props: TransactionButtonProps) {
  const {
    children,
    transaction,
    onTransactionSent,
    onTransactionConfirmed,
    onError,
    onClick,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const wallet = useActiveWallet();
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

            if (wallet && wallet.getChain()?.id !== resolvedTx.chain.id) {
              await wallet?.switchChain(resolvedTx.chain);
            }

            const result = await sendTransaction.mutateAsync(resolvedTx);

            if (onTransactionSent) {
              onTransactionSent(result);
            }

            if (onTransactionConfirmed) {
              const receipt = await doWaitForReceipt(result);
              onTransactionConfirmed(receipt);
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
      disabled={true}
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
