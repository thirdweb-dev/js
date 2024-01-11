---
"@thirdweb-dev/react-core": minor
"@thirdweb-dev/react": minor
---

### New `ConnectEmbed` component and `useShowConnectEmbed` hook

- Add `ConnectEmbed` component and `useShowConnectEmbed` hook allow embedding the `ConnectWallet`'s Modal directly into the page.
- `useShowConnectEmbed` returns `true` if the `<ConnectEmbed />`should be rendered. It returns`true` if either one of the following conditions are met:

  - Wallet is NOT connected
  - Wallet IS connected but the user is NOT signed in and `auth` is required ( loginOptional is NOT set to false )

  ```tsx
  function Example() {
    const loginOptional = false;
    const showConnectEmbed = useShowConnectEmbed(loginOptional);

    if (!showConnectEmbed) {
      return <div> Wallet is connected </div>;
    }

    return (
      <ConnectEmbed
        auth={{
          loginOptional,
        }}
      />
    );
  }
  ```

### `ConnectWallet` component changes

- Fix double connection issue when Connecting a Safe / Smart Wallet. Now the personal wallet will not be set as the active wallet - only the final wallet will be set as the active wallet. This fixes the issue of hooks like `useWallet`, `useAddress`, `useConnectionStatus` etc showing the wrong wallet / address / connection status for a brief moment when connecting a Safe / Smart Wallet.

- Add "Disconnect Wallet" button in "Sign in" Screen and don't disconnect wallet when the "Sign in" screen is dismissed by closing the modal. This makes this screen reusable for both `ConnectWallet` and `ConnectEmbed` components and also improves the user experience.

### API changed for creating wallet configurator

_This is only relevant if you are creating your own wallet configurator - If you are using the wallet configurators provided by thirdweb such as `metamaskWallet()`, `coinbaseWallet()` etc - This API change does not affect you_

To Fix the above mentioned "double connection" issue in the `ConnectWallet` component, We have introduce a few changes to how the wallet configurator should be created.

Do not use any wallet connection hooks in the wallet configurator. Only use the `props` passed in the `connectUI` and `selectUI`. The wallet configurator's `connectUI` and `selectUI` now gets below mentioned additional props so that you can avoid using the wallet connection hooks

- `props.connect` - replaces the `useConnect` hook usage
- `props.connectionStatus` - replaces the `useConnectionStatus` hook usage
- `props.setConnectionStatus` - replaces the `useSetConnectionStatus` hook usage
- `props.setConnectedWallet` - replaces the `useSetConnectedWallet` hook usage
- `props.createWalletInstance` - replaces the `useCreateWalletInstance` hook usage
- `props.connectedWalletAddress` - replaces the `useAddress` hook usage

#### Example

```tsx
import { WalletConfig } from "@thirdweb-dev/react";
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
