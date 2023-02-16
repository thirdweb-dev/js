import { createAsyncLocalStorage } from "../../core/WalletStorage";
import { ThirdwebProvider as ThirdwebProviderCore } from "@thirdweb-dev/react-core";
import { ComponentProps } from "react";

export function ThirdwebProvider(
  props: Omit<
    ComponentProps<typeof ThirdwebProviderCore>,
    "createWalletStorage"
  >,
) {
  return (
    <ThirdwebProviderCore
      {...props}
      createWalletStorage={createAsyncLocalStorage}
    />
  );
}
