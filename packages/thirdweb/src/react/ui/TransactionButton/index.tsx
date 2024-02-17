import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { Button } from "../components/buttons.js";
import { Spinner } from "../components/Spinner.js";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import {
  estimateGas,
  type PreparedTransaction,
} from "../../../transaction/index.js";
import { spacing } from "../design-system/index.js";
import { useChainQuery } from "../../hooks/others/useChainQuery.js";
import { useEffect, useState } from "react";
import { formatEther } from "../../../utils/units.js";

export type TransactionButtonProps = React.PropsWithChildren<{
  transaction: PreparedTransaction;
  onSuccess?: (transactionHash: WaitForReceiptOptions) => void;
  onError?: (error: Error) => void;
  onSubmit?: () => void;
  className?: string;
  style?: React.CSSProperties;
}>;

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
    ...buttonProps
  } = props;
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const connectedWalletChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const txChain = transaction.chain;
  const sendTransaction = useSendTransaction();
  const chainQuery = useChainQuery(txChain.id);

  const [gasCost, setGasCost] = useState<string | undefined>();
  useEffect(() => {
    estimateGas({ transaction, wallet }).then(async (value) => {
      const txValueWei =
        (typeof transaction.value === "function"
          ? await transaction.value()
          : transaction.value) || BigInt(0);
      const gasCostWei = value * BigInt(10 ** 9);
      setGasCost(formatEther(gasCostWei + txValueWei, "wei"));
    });
  }, [transaction, wallet]);

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

  if (gasCost && chainQuery.data && !sendTransaction.isPending) {
    return (
      <Button
        gap="xs"
        {...buttonProps}
        disabled={!account}
        variant={"primary"}
        data-is-loading={sendTransaction.isPending}
        onClick={() => {
          sendTransaction.mutate(transaction, {
            onSuccess,
            onError,
          });
          if (onSubmit) {
            onSubmit();
          }
        }}
        style={{
          ...buttonProps.style,
          opacity: !account ? 0.5 : 1,
        }}
      >
        {children}{" "}
        <span
          style={{
            borderLeft: "2px solid",
            paddingLeft: spacing.xs,
          }}
        >
          {gasCost} {chainQuery.data.nativeCurrency.symbol}
        </span>
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
};
