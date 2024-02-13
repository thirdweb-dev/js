import { getChainIdFromChain } from "../../../chain/index.js";

import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { Button, type ButtonProps } from "../components/buttons.js";
import { Spinner } from "../components/Spinner.js";
import {
  useActiveAccount,
  useActiveWalletChainId,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import type { PreparedTransaction } from "../../../transaction/transaction.js";

export type TransactionButtonProps = React.PropsWithChildren<
  ButtonProps & {
    transaction: PreparedTransaction;
    onSuccess?: (transactionHash: WaitForReceiptOptions) => void;
    onError?: (error: Error) => void;
    onSubmit?: () => void;
    className?: string;
  }
>;

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * It handles switching chains if the connected wallet is on a different chain than the transaction.
 * It also estimates gas and displays a loading spinner while the transaction is pending.
 * @param props - The props for this component.
 * @returns The rendered component.
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
 */
export const TransactionButton: React.FC<TransactionButtonProps> = (props) => {
  const {
    children,
    transaction,
    onSuccess,
    onError,
    onSubmit,
    className,
    ...buttonProps
  } = props;
  const { address } = useActiveAccount() || {};
  const connectedWalletChainId = useActiveWalletChainId();
  const switchChain = useSwitchActiveWalletChain();
  const txChainId = getChainIdFromChain(transaction.chain);
  const { mutate, isPending } = useSendTransaction();

  // if the connected wallet is on a different chain than the transaction, show a switch chain button
  if (connectedWalletChainId && connectedWalletChainId !== txChainId) {
    return (
      <Button
        {...buttonProps}
        className={className}
        onClick={() => {
          switchChain(txChainId);
        }}
      >
        Switch Chain
      </Button>
    );
  }

  // TODO: estimate gas and display on button

  return (
    <Button
      gap="sm"
      {...buttonProps}
      className={className}
      disabled={!address || isPending}
      data-is-loading={isPending}
      onClick={() => {
        mutate(transaction, {
          onSuccess,
          onError,
        });
        if (onSubmit) {
          onSubmit();
        }
      }}
    >
      {isPending && <Spinner size="sm" color="primaryButtonText" />}
      {children}
    </Button>
  );
};
