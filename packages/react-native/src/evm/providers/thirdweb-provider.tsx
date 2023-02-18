import { ThirdwebProvider as ThirdwebProviderCore, ThirdwebProviderProps } from "@thirdweb-dev/react-core";
import React from "react";
import { DeviceBrowserWallet } from "@thirdweb-dev/wallets";

export function ThirdwebProviderW({children, createWalletStorage: createWalletStorageProp, ...props} : 
  React.PropsWithChildren<{createWalletStorage: ThirdwebProviderProps['createWalletStorage']} & Omit<
    ThirdwebProviderProps,
    "createWalletStorage"
  >>,
) {
  console.log('rendering');
  console.log('rendering now');
  console.log('lol')

  console.log('rendering');

  console.log('tomaaaaa');
  return (
    <ThirdwebProviderCore
      {...props}
      createWalletStorage={createWalletStorageProp}
      supportedWallets={[DeviceBrowserWallet]}
    >
      {children}
    </ThirdwebProviderCore>
  );
}
