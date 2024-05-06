"use client";
import { useState } from "react";
import type { GaslessOptions } from "../../../../transaction/actions/gasless/types.js";
import {
  type WaitForReceiptOptions,
  waitForReceipt as doWaitForReceipt,
} from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import { useSendTransactionCore } from "../../../core/hooks/contract/useSendTransaction.js";
import {
  useActiveAccount,
  useActiveWallet,
  useSwitchActiveWalletChain,
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

  /**
   * Configuration for gasless transactions.
   * Refer to [`GaslessOptions`](https://portal.thirdweb.com/references/typescript/v5/GaslessOptions) for more details.
   */
  gasless?: GaslessOptions;

  /**
   * The button's disabled state
   */
  disabled?: boolean;
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
    gasless,
    disabled,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [isPending, setIsPending] = useState(false);
  const switchChain = useSwitchActiveWalletChain();

  const sendTransaction = useSendTransactionCore(undefined, gasless);

  return (
    <Button
      gap="xs"
      disabled={!account || disabled || isPending}
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
            await switchChain(resolvedTx.chain);
          }

          const result = await sendTransaction.mutateAsync(resolvedTx);

          if (onTransactionSent) {
            onTransactionSent(result);
          }

          if (onTransactionConfirmed) {
            const receipt = await doWaitForReceipt(result);
            if (receipt.status === "reverted")
              throw new Error(
                `Execution reverted: ${JSON.stringify(receipt, null, 2)}`,
              );
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
        opacity: !account || disabled ? 0.5 : 1,
        minWidth: "150px",
        position: "relative",
        ...buttonProps.style,
      }}
      {...buttonProps}
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
  );
}
