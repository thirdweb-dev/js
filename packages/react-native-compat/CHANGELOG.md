# @thirdweb-dev/react-native-compat

## 0.6.5

## 0.6.4

## 0.6.3

## 0.6.2

## 0.6.1

## 0.6.0

## 0.5.6

## 0.5.5

## 0.5.4

## 0.5.3

## 0.5.2

## 0.5.1

## 0.5.0

## 0.4.14

## 0.4.13

## 0.4.12

## 0.4.11

## 0.4.10

## 0.4.9

## 0.4.8

## 0.4.7

## 0.4.6

## 0.4.5

## 0.4.4

## 0.4.3

## 0.4.2

## 0.4.1

## 0.4.0

## 0.3.16

## 0.3.15

## 0.3.14

## 0.3.13

## 0.3.12

## 0.3.11

## 0.3.10

## 0.3.9

## 0.3.8

## 0.3.7

## 0.3.6

## 0.3.5

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

## 0.3.0

### Patch Changes

- [#1561](https://github.com/thirdweb-dev/js/pull/1561) [`5dc372fc`](https://github.com/thirdweb-dev/js/commit/5dc372fc460beced53fdaa3a62c780c1163bcdf2) Thanks [@iketw](https://github.com/iketw)! - Adds EmbeddedWallet (email) to React Native

  You can now do:

  ```javascript
  import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react-native";

  <ThirdwebProvider
    clientId="your-client-id"
    supportedWallets={[embeddedWallet()]}
  >
    <App />
  </ThirdwebProvider>;
  ```

  To use the `embeddedWallet` you need to add the following dependencies to your project:

  - `"amazon-cognito-identity-js": "^6.3.3"`
  - react-native-quick-base64
  - react-native-quick-crypto

    - There's an open issue on RN > 0.72: https://github.com/margelo/react-native-quick-crypto/issues/186 which you can [fix by](https://github.com/margelo/react-native-quick-crypto/issues/186#issuecomment-1663666739) adding the following to your `android/app/build.gradle` file:

      ```
      packagingOptions {
          pickFirst 'lib/x86/libcrypto.so'
          pickFirst 'lib/x86_64/libcrypto.so'
          pickFirst 'lib/armeabi-v7a/libcrypto.so'
          pickFirst 'lib/arm64-v8a/libcrypto.so'
      }
      ```

    - When building the iOS app in release mode for RN 0.71 you need to enable the OpenSSL framework in XCode. There are several solutions for this here:
      - https://github.com/margelo/react-native-quick-crypto/issues/121#issuecomment-1369924076
      - https://github.com/margelo/react-native-quick-crypto/issues/121#issuecomment-1537576444

  - react-native-aes-gcm-crypto
    - This package requires minSdkVersion = 26 on Android

## 0.2.62

## 0.2.61

## 0.2.60

## 0.2.59

## 0.2.58

## 0.2.57

## 0.2.56

## 0.2.55

## 0.2.54

## 0.2.53

## 0.2.52

## 0.2.51

## 0.2.50

## 0.2.49

## 0.2.48

## 0.2.47

## 0.2.46

## 0.2.45

## 0.2.44

## 0.2.43

## 0.2.42

## 0.2.41

## 0.2.40

### Patch Changes

- [#1409](https://github.com/thirdweb-dev/js/pull/1409) [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

## 0.2.39

## 0.2.38

## 0.2.37

## 0.2.36

### Patch Changes

- [#1316](https://github.com/thirdweb-dev/js/pull/1316) [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b) Thanks [@iketw](https://github.com/iketw)! - Adds support for clientId / secretKey

## 0.2.35

## 0.2.34

## 0.2.33

## 0.2.32

## 0.2.31

## 0.2.30

## 0.2.29

## 0.2.28

## 0.2.27

### Patch Changes

- [#1278](https://github.com/thirdweb-dev/js/pull/1278) [`8a389f12`](https://github.com/thirdweb-dev/js/commit/8a389f1295d2bf726059997ea0ca10cf0424f2a2) Thanks [@jnsdls](https://github.com/jnsdls)! - updated various dependencies

## 0.2.26

## 0.2.25

## 0.2.24

## 0.2.23

## 0.2.22

## 0.2.21

## 0.2.20

## 0.2.19

## 0.2.18

## 0.2.17

## 0.2.16

## 0.2.15

## 0.2.14

## 0.2.13

## 0.2.12

## 0.2.11

## 0.2.10

## 0.2.9

## 0.2.8

## 0.2.7

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.1

## 0.2.0

### Minor Changes

- [#584](https://github.com/thirdweb-dev/js/pull/584) [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db) Thanks [@MananTank](https://github.com/MananTank)! - [Wallets, RN, React, ReactCore] New Wallets SDK implementation

  #### Breaking changes:

  ### React and React Native

  1. Replaced `walletConnectors` with `supportedWallets` in the ThirdwebProvider.

  ```diff
    import { coinbaseWallet, metamaskWallet, ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    - return <ThirdwebProvider walletConnectors={["metamask", "coinbaseWallet"]}>{...}</ThirdwebProvider>
    + return <ThirdwebProvider supportedWallets={[metamaskWallet(), coinbaseWallet()]}>{...}</ThirdwebProvider>
    }
  ```

  2. `magicLinkConnector` not yet implemented in this version

  3. Removed `desiredChainId`, use `activeChain` instead

  4. `DAppMetaData` type now requires the `url` field to be passed in

  5. Removed `chainRpc` prop from the ThirdwebProvider. You can pass custom rpcs in the Chain object through the `activeChain` and `supportedChains` props.

  6. Replaced the `useNetwork` hook for `useChain` and `useSwitchChain`

  7. Updated `ConnectWallet` button in React:

  - Removed `accentColor` and `colorMode`
  - Added a `theme` prop with `dark` and `light` values

  8. Updated the `Web3Button` button in React:

  - Removed `accentColor` and `colorMode`
  - Added a `theme` prop with `dark` and `light` values

  ### Patch Changes

  - You can now pass a `theme` prop to the ThirdwebProvider. Values are `light` and `dark`

  ```
    import { ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    return <ThirdwebProvider theme='light'>{...}</ThirdwebProvider>
    }
  ```

  - New wallet hooks added

    - useWallet()
    - useConenct()
    - useConnectionStatus()
    - useSwitchChain()

  - Removed `wagmi` dependency from the `react-native-compat` package and updated shims

  - New `ConnectWallet` and `Web3Button` components in React Native

  - New wallets package with support for the most common wallets. MetaMask, Coinbase, WalletConnect V1 and V2 and PaperWallet

  - Added `autoSwitch` prop to the ThirdwebProvider to control whether or not to automatically switch to wallet's network to active chain

  ```
    import { ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    return <ThirdwebProvider autoSwitch>{...}</ThirdwebProvider>
    }
  ```

### Patch Changes

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

- [#771](https://github.com/thirdweb-dev/js/pull/771) [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36) Thanks [@iketw](https://github.com/iketw)! - [ReactNativeSDK] Use wallet metadata from the wallet class

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

## 0.1.0

### Minor Changes

- [#522](https://github.com/thirdweb-dev/js/pull/522) [`18ba6b3`](https://github.com/thirdweb-dev/js/commit/18ba6b381ee5c72e0fe599ab9b32f2ef66443d5f) Thanks [@iketw](https://github.com/iketw)! - [React Native SDK] init package
