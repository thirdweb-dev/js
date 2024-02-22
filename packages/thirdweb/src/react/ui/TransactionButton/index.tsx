import {
  waitForReceipt,
  type WaitForReceiptOptions,
} from "../../../transaction/actions/wait-for-tx-receipt.js";
import { Button } from "../components/buttons.js";
import { Spinner } from "../components/Spinner.js";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { useState } from "react";

export type TransactionButtonProps = React.PropsWithChildren<{
  /**
   * The transaction object of type [`PreparedTransaction`](https://portal.thirdweb.com/references/typescript/v5/PreparedTransaction) to be sent when the button is clicked
   */
  transaction: PreparedTransaction;
  /**
   * Whether to wait for the transaction receipt after sending the transaction
   */
  waitForReceipt?: boolean;
  /**
   * Callback to be called when the transaction is successful
   * @param transactionHash - The object of type [`WaitForReceiptOptions`](https://portal.thirdweb.com/references/typescript/v5/WaitForReceiptOptions)
   * @param receipt - The transaction receipt object of type [`TransactionReceipt`](https://portal.thirdweb.com/references/typescript/v5/TransactionReceipt)
   */
  onSuccess?: (
    transactionHash: WaitForReceiptOptions,
    receipt?: TransactionReceipt,
  ) => void;
  /**
   * The Error thrown when trying to send the transaction
   * @param error - The `Error` object thrown
   */
  onError?: (error: Error) => void;
  /**
   * Callback to be called when the button is clicked
   */
  onSubmit?: () => void;
  /**
   * The className to apply to the button element for custom styling
   */
  className?: string;
  /**
   * The style to apply to the button element for custom styling
   */
  style?: React.CSSProperties;
}>;

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * - It shows a "Switch Network" button if the connected wallet is on a different chain than the transaction.
 * - It also estimates gas and displays a loading spinner while the transaction is pending.
 * @param props - The props for this component.
 * Refer to [TransactionButtonProps](https://portal.thirdweb.com/references/typescript/v5/TransactionButtonProps) for details.
 * @example
 * ```tsx
 * <TransactionButton
 *   transaction={transaction}
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
    onSuccess,
    onError,
    onSubmit,
    ...buttonProps
  } = props;
  const account = useActiveAccount();
  const [isPending, setIsPending] = useState(false);

  const connectedWalletChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const txChain = transaction.chain;
  const sendTransaction = useSendTransaction();

  // if the connected wallet is on a different chain than the transaction, show a switch chain button
  if (connectedWalletChain && connectedWalletChain.id !== txChain.id) {
    return (
      <Button
        {...buttonProps}
        variant="primary"
        onClick={() => {
          switchChain(txChain);
        }}
      >
        Switch Chain
      </Button>
    );
  }

  if (!isPending) {
    return (
      <Button
        gap="xs"
        {...buttonProps}
        disabled={!account}
        variant={"primary"}
        data-is-loading={isPending}
        onClick={async () => {
          try {
            setIsPending(true);
            const result = await sendTransaction.mutateAsync(transaction);
            let receipt;
            if (props.waitForReceipt) {
              receipt = await waitForReceipt(result);
            }
            if (onSuccess) {
              onSuccess(result, receipt);
            }
          } catch (error) {
            if (onError) {
              onError(error as Error);
            }
          }
          setIsPending(false);
          if (onSubmit) {
            onSubmit();
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
