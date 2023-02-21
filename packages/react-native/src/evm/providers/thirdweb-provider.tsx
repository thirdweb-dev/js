import { ThirdwebProvider as ThirdwebProviderCore, ThirdwebProviderProps } from "@thirdweb-dev/react-core";
import React from "react";
import { createAsyncLocalStorage } from "../../core/AsyncStorage";

export function ThirdwebProviderRN({children, createWalletStorage: createWalletStorageProp, ...props} : 
  React.PropsWithChildren<{createWalletStorage?: ThirdwebProviderProps['createWalletStorage']} & Omit<
    ThirdwebProviderProps,
    "createWalletStorage"
  >>,
) {
  return (
    <ThirdwebProviderCore
      {...props}
      createWalletStorage={createWalletStorageProp || createAsyncLocalStorage}
    >
      {children}
    </ThirdwebProviderCore>
  );
}
