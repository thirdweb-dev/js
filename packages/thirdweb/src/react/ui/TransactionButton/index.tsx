import { getChainIdFromChain } from "../../../chain/index.js";

import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { Button } from "../components/buttons.js";
import { Spinner } from "../components/Spinner.js";
import {
  useActiveAccount,
  useActiveWalletChainId,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import { type PreparedTransaction } from "../../../transaction/index.js";
import { estimateGas, formatEther } from "../../../index.js";
import { spacing } from "../design-system/index.js";
import { useChainQuery } from "../../hooks/others/useChainQuery.js";
import { useEffect, useState } from "react";

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
  const account = useActiveAccount();
  const address = account?.address;
  const connectedWalletChainId = useActiveWalletChainId();
  const switchChain = useSwitchActiveWalletChain();
  const txChainId = getChainIdFromChain(transaction.chain);
  const sendTransaction = useSendTransaction();
  const chainQuery = useChainQuery(txChainId);

  const [gasCost, setGasCost] = useState<string | undefined>();
  useEffect(() => {
    estimateGas({ transaction, account }).then(async (value) => {
      const txValueWei =
        (typeof transaction.value === "function"
          ? await transaction.value()
          : transaction.value) || BigInt(0);
      const gasCostWei = value * BigInt(10 ** 9);
      setGasCost(formatEther(gasCostWei + txValueWei, "wei"));
    });
  }, [transaction, account]);

  // if the connected wallet is on a different chain than the transaction, show a switch chain button
  if (connectedWalletChainId && connectedWalletChainId !== txChainId) {
    return (
      <Button
        {...buttonProps}
        variant="primary"
        onClick={() => {
          switchChain(txChainId);
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
        disabled={!address}
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
          opacity: !address ? 0.5 : 1,
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
