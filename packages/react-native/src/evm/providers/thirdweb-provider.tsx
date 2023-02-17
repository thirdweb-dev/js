import { ThirdwebProvider as ThirdwebProviderCore, ThirdwebProviderProps } from "@thirdweb-dev/react-core";
import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import React from "react";
import { DeviceBrowserWallet } from "@thirdweb-dev/wallets";

export function ThirdwebProviderW({children, ...props} : React.PropsWithChildren<{createWalletStorage?: ThirdwebProviderProps['createWalletStorage']} & Omit<
    ThirdwebProviderProps,
    "createWalletStorage"
  >>,
) {
  return (
    <ThirdwebProviderCore
      {...props}
      createWalletStorage={createAsyncLocalStorage}
      supportedWallets={[DeviceBrowserWallet]}
    >
      {children}
    </ThirdwebProviderCore>
  );
}
