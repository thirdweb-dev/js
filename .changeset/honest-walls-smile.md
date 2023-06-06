---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Export WCV1 and WCV2 abstract classes to facilitate creation of wallet connect based wallets

You can now extend the abstract classes `WalletConnectV1` or `WalletConnectV2` and set your own metadata when implementing a wallet.

Find an example below implementing `MyWallet` that supports the `WalletConnectV2` protocol.

```javascript
import {
  WCMeta,
  WalletConnectV2,
  WalletOptions,
  WalletConfig,
} from '@thirdweb-dev/react-native';

export class MyWallet extends WalletConnectV2 {
  static id = 'mywallet' as const; // ID needed to identify your wallet in the SDK.
  static meta = {
    name: 'My Wallet', // Name that will show up in our Connect Modal.
    iconURL:
      'my-wallet-icon-url-ipfs-or-png', // Icon that will show up in our Connect Modal.
    links: { // The WalletConnect mobile links.
      native: 'mywallet://',
      universal: 'https://mywallet.com',
    },
  };

  getMeta(): WCMeta {
    return MyWallet.meta;
  }
}

/**
 * The WalletConnectV2 projectId.
 *
 * We provide a default projectId but recommend you get your own
 * when launching your app in production.
 */
type MyWalletConfig = { projectId?: string };

export const myWallet = (config?: MyWalletConfig): WalletConfig<WalletConnectV2> => {
  return {
    id: MyWallet.id,
    meta: MyWallet.meta,
    create: (options: WalletOptions) =>
      new MyWallet({
        ...options,
        projectId: config?.projectId,
        walletId: MyWallet.id,
      }),
  };
};
```

You can then use your new wallet in the `ThirdwebProvider`'s `supportedWallets` prop:

```javascript
import { ThirdwebProvider } from "@thirdweb-dev/react-native";

<ThirdwebProvider supportedWallets={[myWallet()]}>
  <App />
</ThirdwebProvider>;
```
