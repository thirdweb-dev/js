---
"@thirdweb-dev/react-native": minor
---

### API changed for creating wallet configurator

( This is only relevant if you are creating your own wallet configurator - If you are using the wallet configurators provided by thirdweb such as `metamaskWallet()`, `coinbaseWallet()` etc - This API change does not affect you )

We have introduce a few changes to how the wallet configurator should be created:

Do not use any wallet connection hooks in the wallet configurator. Only use the `props` passed in the `connectUI` and `selectUI`. The wallet configurator's `connectUI` and `selectUI` now gets below mentioned additional props so that you can avoid using the wallet connection hooks

- `props.connect` - replaces the `useConnect` hook usage
- `props.connectionStatus` - replaces the `useConnectionStatus` hook usage
- `props.setConnectionStatus` - replaces the `useSetConnectionStatus` hook usage
- `props.setConnectedWallet` - replaces the `useSetConnectedWallet` hook usage
- `props.createWalletInstance` - replaces the `useCreateWalletInstance` hook usage
- `props.connectedWalletAddress` - replaces the `useAddress` hook usage

#### Example

```tsx
import { WalletConfig } from "@thirdweb-dev/react-native";
import { MyCustomWallet } from "./MyCustomWallet"; // your custom wallet class

// your custom wallet configurator
function myCustomWallet(): WalletConfig<MyCustomWallet> {
  return {
    id: "MyCustomWallet",
    meta: {
      name: "FooBar",
      iconURL: "https://link-to-the-wallet-icon.png",
    },
    create(walletOptions) {
      return new MyCustomWallet(walletOptions);
    },
    // only use the props passed in the connectUI and selectUI
    // do not use any wallet connection hooks that read or write to the wallet connection state
    connectUI(props) {
      // const connect = useConnect(); -> old
      const connect = props.connect; // new

      return <div> .... </div>;
    },
    selectUI(props) {
      return <div> .... </div>;
    },
  };
}
```

`onLocallyConnected` has been removed from the `connectUI` props - You no longer need to worry about whether a wallet is part of another wallet's connection flow or not - just use the regular `props` passed in the `connectUI` and `selectUI` and it will be handled automatically.
