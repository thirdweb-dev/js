import { useMutation } from "@tanstack/react-query";
import type { TransactionReceipt } from "viem";
import type { GaslessOptions } from "../../../../transaction/actions/gasless/types.js";
import {
  type WaitForReceiptOptions,
  waitForReceipt,
} from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { stringify } from "../../../../utils/json.js";
import type { Theme } from "../../design-system/index.js";
import type {
  SendTransactionPayModalConfig,
  useSendTransactionCore,
} from "./useSendTransaction.js";

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
  onClick?: () => void;
  /**
   * The className to apply to the button element for custom styling
   */
  className?: string;
  /**
   * The style to apply to the button element for custom styling
   */
  style?: React.CSSProperties;
  /**
   * Remove all default styling from the button
   */
  unstyled?: boolean;
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

  /**
   * Configuration for the "Pay Modal" that opens when the user doesn't have enough funds to send a transaction.
   * Set `payModal: false` to disable the "Pay Modal" popup
   *
   * This configuration object includes the following properties to configure the "Pay Modal" UI:
   *
   * ### `locale`
   * The language to use for the "Pay Modal" UI. Defaults to `"en_US"`.
   *
   * ### `supportedTokens`
   * An object of type [`SupportedTokens`](https://portal.thirdweb.com/references/typescript/v5/SupportedTokens) to configure the tokens to show for a chain.
   *
   * ### `theme`
   * The theme to use for the "Pay Modal" UI. Defaults to `"dark"`.
   *
   * It can be set to `"light"` or `"dark"` or an object of type [`Theme`](https://portal.thirdweb.com/references/typescript/v5/Theme) for a custom theme.
   *
   * Refer to [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme) helper functions to use the default light or dark theme and customize it.
   */
  payModal?: SendTransactionPayModalConfig;

  /**
   * The theme to use for the button
   */
  theme?: "dark" | "light" | Theme;
};

export const useTransactionButtonMutation = (
  props: TransactionButtonProps,
  sendTransactionFn: ReturnType<typeof useSendTransactionCore>["mutateAsync"],
) => {
  const {
    transaction,
    onTransactionSent,
    onTransactionConfirmed,
    onError,
    onClick,
  } = props;
  return useMutation({
    mutationFn: async () => {
      if (onClick) {
        onClick();
      }
      try {
        const resolvedTx = await transaction();
        const result = await sendTransactionFn(resolvedTx);

        if (onTransactionSent) {
          onTransactionSent(result);
        }

        if (onTransactionConfirmed) {
          const receipt = await waitForReceipt(result);
          if (receipt.status === "reverted") {
            throw new Error(
              `Execution reverted: ${stringify(receipt, null, 2)}`,
            );
          }
          onTransactionConfirmed(receipt);
        }
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      } finally {
      }
    },
  });
};
