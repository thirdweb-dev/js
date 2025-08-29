import { useTheme } from "next-themes";
import {
  type SendTransactionConfig,
  // eslint-disable-next-line no-restricted-imports
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function useSendAndConfirmTx(config?: SendTransactionConfig) {
  const { theme } = useTheme();
  const sendAndConfirmTransaction = useSendAndConfirmTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
    ...config,
  });

  return sendAndConfirmTransaction;
}
