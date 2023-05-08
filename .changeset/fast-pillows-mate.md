---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/wallets": patch
---

## [ReactNative] Allow custom wallets be added to the ConnectWallet button modal

With this new API you can build your own wallet and wallet UI and integrate it into our ConnectWallet modal:

```
import type { ConfiguredWallet, ConnectUIProps } from '@thirdweb-dev/react-native';
import { createAsyncLocalStorage, ConnectUIProps } from '@thirdweb-dev/react-native';
import { WalletOptions } from '@thirdweb-dev/wallets';

const WALLET_ID = "my-wallet-id";

export const myWallet = (): ConfiguredWallet => {
  const asyncStorage = createAsyncLocalStorage(WALLET_ID);
  const configuredWallet = {
    id: WALLET_ID,
    meta: {
        id: WALLET_ID,
        name: "My Custom Wallet", // This will be displayed in the connect wallet modal
        iconURL: "ipfs or https url to an image or svg" // This will be used to fetch the icon to show in the connect wallet modal
    },
    create: (options: WalletOptions) =>
      new MyWallet({
        ...options,
        walletStorage: asyncStorage,
      }),
    connectUI(props: ConnectUIProps) {
      return <MyWalletUI {...props} />; // This will show up in the modal after the user selects your wallet
    },
  };

  return configuredWallet;
};
```

You can then add the wallet to your `supportedWallets` in the `ThirdwebProvider`:

```
import { Goerli } from '@thirdweb-dev/chains';
import {
  ThirdwebProvider,
  metamaskWallet,
} from '@thirdweb-dev/react-native';

const activeChain = Goerli;

const App = () => {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedChains={[activeChain]}
      supportedWallets={[
        myWallet(),
        metamaskWallet(),
      ]}>
      <AppInner />
    </ThirdwebProvider>
  );
};
```

This new version exposes some utility functions:

1. `formatWalletConnectDisplayUri`

Formats the wallet connect `wc://` url for usage with custom wallet links

2. `shortenWalletAddress`

Shortens a wallet address for display purposes

3. `createAsyncLocalStorage` and `createSecureStorage`

You can use these methods to get wallet compatible storage types.

- `createAsyncLocalStorage` uses MMKV in the background
- `createSecureStorage` uses Expo SecureStore in the background
