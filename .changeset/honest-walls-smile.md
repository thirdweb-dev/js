---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Export WCV1 and WCV2 abstract classes to facilitate creation of wallet connect based wallets

You can now extend the abstract classes `WalletConnectV1` or `WalletConnectV2` and set your own metadata when implementing a wallet.

Find an example below implementing `MyWallet` that supports the `WalletConnectV2` protocol.

```javascript
import {
  WC2Options,
  WCMeta,
  WalletConnectV2,
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from '@thirdweb-dev/react-native';

export class MyWallet extends WalletConnectV2 {
  static id = 'mywallet' as const;
  static meta = {
    id: 'mywallet',
    name: 'My Wallet',
    iconURL:
      'my-wallet-icon-url-ipfs-or-png',
    links: {
      native: 'mywallet://',
      universal: 'https://mywallet.com',
    },
  };

  constructor(options: WC2Options) {
    super({
      ...options,
      walletId: MyWallet.id,
    });
  }

  getMeta(): WCMeta {
    return MyWallet.meta;
  }
}

type MyWalletConfig = { projectId?: string };

export const myWallet = (config?: MyWalletConfig) => {
  return {
    id: MyWallet.id,
    meta: MyWallet.meta,
    create: (options: WalletOptionsRC) =>
      new MyWallet({
        ...options,
        projectId: config?.projectId,
        walletId: MyWallet.id,
      }),
    config: {
      projectId: config?.projectId,
    },
  } satisfies WalletConfig<WalletConnectV2, MyWalletConfig>;
};
```

You can then use your new wallet in the `ThirdwebProvider`'s `supportedWallets` prop:

```javascript
import { ThirdwebProvider } from "@thirdweb-dev/react-native";

<ThirdwebProvider supportedWallets={[myWallet()]}>
  <App />
</ThirdwebProvider>;
```
