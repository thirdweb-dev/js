import { type StyleProp, View, type ViewStyle } from "react-native";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  type TransactionButtonProps,
  useTransactionButtonMutation,
} from "../../../core/hooks/transaction/transaction-button-utils.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { ThemedButton } from "../components/button.js";
import { ThemedSpinner } from "../components/spinner.js";

/**
 * TransactionButton component is used to render a button that triggers a transaction.
 * It shows a "Switch Network" button if the connected wallet is on a different chain than the transaction.
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
 * @component
 * @transaction
 */
export function TransactionButton(props: TransactionButtonProps) {
  const { children, gasless, payModal, disabled, ...buttonProps } = props;
  const account = useActiveAccount();
  const sendTransaction = useSendTransaction({ gasless, payModal });
  const { mutate: handleClick, isPending } = useTransactionButtonMutation(
    props,
    sendTransaction.mutateAsync,
  );
  const theme = parseTheme(buttonProps.theme);

  return (
    <ThemedButton
      disabled={!account || disabled || isPending}
      onPress={() => handleClick()}
      style={buttonProps.style as StyleProp<ViewStyle>}
      theme={theme}
      variant="primary"
    >
      <View style={{ opacity: isPending ? 0 : 1 }}>{children}</View>
      {isPending && (
        <View
          style={{
            alignItems: "center",
            bottom: 0,
            flex: 1,
            justifyContent: "center",
            margin: "auto",
            position: "absolute",
            top: 0,
          }}
        >
          <ThemedSpinner color={theme.colors.primaryButtonText} />
        </View>
      )}
    </ThemedButton>
  );
}
