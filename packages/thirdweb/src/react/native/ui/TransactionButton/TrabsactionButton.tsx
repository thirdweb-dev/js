import { View } from "react-native";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  type TransactionButtonProps,
  useTransactionButtonCore,
} from "../../../core/hooks/transaction/button-core.js";
import { ThemedButton } from "../components/button.js";
import { ThemedSpinner } from "../components/spinner.js";

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
 * Customize the styling by passing the `unstyled` prop and your inline styles and/or classes:
 * ```tsx
 * <TransactionButton
 *   transaction={() => {}}
 *   onSuccess={handleSuccess}
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
  const { account, handleClick, isPending } = useTransactionButtonCore(props);
  const theme = parseTheme(buttonProps.theme);

  return (
    <ThemedButton
      disabled={!account || disabled || isPending}
      variant={"primary"}
      onPress={handleClick}
      theme={theme}
    >
      <View style={{ opacity: isPending ? 0 : 1 }}>{children}</View>
      {isPending && (
        <View
          style={{
            position: "absolute",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            bottom: 0,
            margin: "auto",
          }}
        >
          <ThemedSpinner color={theme.colors.primaryButtonText} />
        </View>
      )}
    </ThemedButton>
  );
}
