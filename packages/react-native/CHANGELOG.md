# @thirdweb-dev/react-native

## 0.3.1

### Patch Changes

- Updated dependencies [[`f64b7236`](https://github.com/thirdweb-dev/js/commit/f64b7236bbcc5b15fea582db22f120d71d9e126f)]:
  - @thirdweb-dev/chains@0.1.54
  - @thirdweb-dev/react-core@3.16.2
  - @thirdweb-dev/sdk@3.10.64
  - @thirdweb-dev/wallets@1.3.2

## 0.3.0

### Minor Changes

- [#1676](https://github.com/thirdweb-dev/js/pull/1676) [`81797ffd`](https://github.com/thirdweb-dev/js/commit/81797ffde34817b457fdbf5241b1c06a13627e51) Thanks [@iketw](https://github.com/iketw)! - Minor version bump for React Native

### Patch Changes

- [#1675](https://github.com/thirdweb-dev/js/pull/1675) [`69e82085`](https://github.com/thirdweb-dev/js/commit/69e8208538886a13072b640013a8f4b46850903b) Thanks [@iketw](https://github.com/iketw)! - Lots of small UI fixes

- [#1683](https://github.com/thirdweb-dev/js/pull/1683) [`bd23cec7`](https://github.com/thirdweb-dev/js/commit/bd23cec7d1101a422e5c0abebf683595f1bac99f) Thanks [@iketw](https://github.com/iketw)! - Update guest wallet icon

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

- [#1680](https://github.com/thirdweb-dev/js/pull/1680) [`ed4172dd`](https://github.com/thirdweb-dev/js/commit/ed4172dddf63eca19cc6cce265bdfef8b702c5d1) Thanks [@iketw](https://github.com/iketw)! - Small UI improvements

- Updated dependencies [[`54f83a50`](https://github.com/thirdweb-dev/js/commit/54f83a5013ed65ddd5a787e13ba7e5d86625537d), [`a9b4b0c5`](https://github.com/thirdweb-dev/js/commit/a9b4b0c5d875dec660694466e5e322cc574bb21b), [`c7e7ec95`](https://github.com/thirdweb-dev/js/commit/c7e7ec9502b46312d36cad5177c4f4a50c34f1a3), [`96e832cc`](https://github.com/thirdweb-dev/js/commit/96e832cc80692da38279c53f1289265b3728cb19), [`b16c09df`](https://github.com/thirdweb-dev/js/commit/b16c09df75c7193a91b832db7d9c92612ae09357), [`6897ad65`](https://github.com/thirdweb-dev/js/commit/6897ad6502d585d55a8c7b2312b4af30663336c3), [`ee028e12`](https://github.com/thirdweb-dev/js/commit/ee028e12092fd306f076f6ea1d49a2295802dd6b), [`d28b1c0f`](https://github.com/thirdweb-dev/js/commit/d28b1c0f1e1e53eedc8f331be555e22b64fb920d), [`c085d690`](https://github.com/thirdweb-dev/js/commit/c085d69060c68b3335761bdb2cc0c3e082548702), [`de05c2da`](https://github.com/thirdweb-dev/js/commit/de05c2da174a69315f2d34dd32a811bbd9a0b604), [`bdb2ccc7`](https://github.com/thirdweb-dev/js/commit/bdb2ccc7a66c33ec5dc331b6fa792e6361769e88), [`c7e7ec95`](https://github.com/thirdweb-dev/js/commit/c7e7ec9502b46312d36cad5177c4f4a50c34f1a3)]:
  - @thirdweb-dev/wallets@1.3.1
  - @thirdweb-dev/sdk@3.10.63
  - @thirdweb-dev/react-core@3.16.1

## 0.2.62

### Patch Changes

- [#1644](https://github.com/thirdweb-dev/js/pull/1644) [`2ce89cfe`](https://github.com/thirdweb-dev/js/commit/2ce89cfea905a669511acfcca43be2044579ab90) Thanks [@iketw](https://github.com/iketw)! - Update ipfs json upload to new endpoint

- [#1632](https://github.com/thirdweb-dev/js/pull/1632) [`cbbb8ccb`](https://github.com/thirdweb-dev/js/commit/cbbb8ccbe3435b6cc7b3f6ab83d412626e9550de) Thanks [@iketw](https://github.com/iketw)! - Coinbase url listener should only listen for the Coinbase callbackURL

- [#1635](https://github.com/thirdweb-dev/js/pull/1635) [`57af96c2`](https://github.com/thirdweb-dev/js/commit/57af96c28845d5e292970655e2ff967169f3724c) Thanks [@iketw](https://github.com/iketw)! - Correctly return json uploads results

- Updated dependencies [[`64528263`](https://github.com/thirdweb-dev/js/commit/64528263f42bd2c564aad5e777f9f6dbba30af54), [`dd3d1a87`](https://github.com/thirdweb-dev/js/commit/dd3d1a87c2dadbadecc9ac3722941a8992bc8131), [`9d553746`](https://github.com/thirdweb-dev/js/commit/9d553746b025ac489f9b8ee357372c9d01c835e1), [`64528263`](https://github.com/thirdweb-dev/js/commit/64528263f42bd2c564aad5e777f9f6dbba30af54), [`d5fafdde`](https://github.com/thirdweb-dev/js/commit/d5fafddea58bc307c9b514a1c9578cafd18b5861), [`c29042b7`](https://github.com/thirdweb-dev/js/commit/c29042b71e266cb11d70d67f0fe2ffcc0fc1f5fa), [`b5b7e524`](https://github.com/thirdweb-dev/js/commit/b5b7e5243df83e3ab60d0917c099fb6967b63439), [`b6df6b89`](https://github.com/thirdweb-dev/js/commit/b6df6b895723947427c515411a7a833edaa324c6), [`94bdcc14`](https://github.com/thirdweb-dev/js/commit/94bdcc142a7fe1e9f53273560404fa6b5ac3a7c4), [`48906a9d`](https://github.com/thirdweb-dev/js/commit/48906a9d8ef2cfdd9ac489822a72d50cbd825628), [`43f188c8`](https://github.com/thirdweb-dev/js/commit/43f188c8a7ec02f394604120b414a039a2650525), [`ea5b9c3e`](https://github.com/thirdweb-dev/js/commit/ea5b9c3ecdd588461fb00f0e9da463de4a30ed1d), [`def6d400`](https://github.com/thirdweb-dev/js/commit/def6d400ab463bda3118d4c9cb00e5cc25a415c2)]:
  - @thirdweb-dev/react-core@3.16.0
  - @thirdweb-dev/chains@0.1.53
  - @thirdweb-dev/wallets@1.3.0
  - @thirdweb-dev/sdk@3.10.62

## 0.2.61

### Patch Changes

- [#1592](https://github.com/thirdweb-dev/js/pull/1592) [`1fe867e2`](https://github.com/thirdweb-dev/js/commit/1fe867e20510a43d2a19ba553709aeaca1d46bb3) Thanks [@iketw](https://github.com/iketw)! - Improved ConnectWallet UX/DevX :)

  1. Devs can now pass a `recommended` field to `supportedWallets` to recommend wallets to users.

  When recommending a wallet, this wallet will show up at the top of the wallets list.

  ```javascript
  import { metamaskWallet, ThirdwebProvider } from "@thirdweb-dev/react-native";

  <ThirdwebProvider
    clientId="your-client-id"
    supportedWallets={[
      metamaskWallet({
        recommended: true,
      }),
    ]}
  >
    <App />
  </ThirdwebProvider>;
  ```

  2. Better theme customization

  You can now more easily customize the theme of the ConnectWallet component:

  ```javascript
  import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";

  <ConnectWallet
    theme={darkTheme({
      colors: {
        textPrimary: "yellow",
        textSecondary: "blue",
      },
    })}
    buttonTitle="Enter web3"
    modalTitle="Sign in"
  />;
  ```

  Note that you can still pass `light` or `dark` if you want to use one of the predefined thems :)

  3. You can now pass your Privacy Policy and Terms of Service urls, they will show up
     at the bottom of the modal:

  ```javascript
  import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";

  <ConnectWallet
    privacyPolicyUrl="https://your-privacy-policy"
    termsOfServiceUrl="https://your-terms-of-service"
  />;
  ```

  4. Fixed a bug when you only specify an email wallet. In this case the app shouldn't auto connect, it should show the email field.

- [#1550](https://github.com/thirdweb-dev/js/pull/1550) [`3f3c63c0`](https://github.com/thirdweb-dev/js/commit/3f3c63c01e34242ae1f074e62b51787b305c059e) Thanks [@MananTank](https://github.com/MananTank)! - ConnectWallet v3 updates

- Updated dependencies [[`3fd39cea`](https://github.com/thirdweb-dev/js/commit/3fd39cea0df71f80255106329db62660f2fd6e3a), [`3f3c63c0`](https://github.com/thirdweb-dev/js/commit/3f3c63c01e34242ae1f074e62b51787b305c059e), [`48295c06`](https://github.com/thirdweb-dev/js/commit/48295c060499371035980d08e362d9858d0fc18b), [`48295c06`](https://github.com/thirdweb-dev/js/commit/48295c060499371035980d08e362d9858d0fc18b)]:
  - @thirdweb-dev/sdk@3.10.61
  - @thirdweb-dev/wallets@1.2.1
  - @thirdweb-dev/react-core@3.15.0
  - @thirdweb-dev/chains@0.1.52

## 0.2.60

### Patch Changes

- [#1590](https://github.com/thirdweb-dev/js/pull/1590) [`87ed24e1`](https://github.com/thirdweb-dev/js/commit/87ed24e1b40675f6e06e7ecde24fd14e24b802fd) Thanks [@iketw](https://github.com/iketw)! - Sets correct UI types for some React Native components

  Type composition in some components was being done incorrectly, which made
  types be `any`, which in turn hide some typescript issues easily recognizable
  by our linter.

- [#1587](https://github.com/thirdweb-dev/js/pull/1587) [`4a7f41b3`](https://github.com/thirdweb-dev/js/commit/4a7f41b3ee15914000ea23c3136c24b26290e8dd) Thanks [@iketw](https://github.com/iketw)! - Remove signer from ThirdwebProvider as it is not being used

  The idea of the React/RN ThirdwebProvider is to provider support for wallets. If devs want to pass their own signer they can directly use ThirdwebSDKProvider

- [#1605](https://github.com/thirdweb-dev/js/pull/1605) [`bb320c7e`](https://github.com/thirdweb-dev/js/commit/bb320c7e97fc6a10bbc0f32564d31f8bc8e564c6) Thanks [@iketw](https://github.com/iketw)! - Pass options to download an correctly pass clientId to RN storage.

- Updated dependencies [[`c0070c2c`](https://github.com/thirdweb-dev/js/commit/c0070c2cc08f23ffe50991d9d3090fcdcd1e720c), [`f55fd291`](https://github.com/thirdweb-dev/js/commit/f55fd291bf751c44608dd9ef6b3a29fb36c2de93), [`2a873d2f`](https://github.com/thirdweb-dev/js/commit/2a873d2f80271208819bac88b32cea0b48761c8d), [`d50863f4`](https://github.com/thirdweb-dev/js/commit/d50863f455ffbfd433924da8fe94394c42408bdc), [`f9042765`](https://github.com/thirdweb-dev/js/commit/f90427650c037b2c437685734ddc3398ad3e2612), [`6df24a2e`](https://github.com/thirdweb-dev/js/commit/6df24a2eb9b922a31bdcb0ccb260d99bdcbb1f17), [`8b73abfd`](https://github.com/thirdweb-dev/js/commit/8b73abfd83c7a8235f5d65f07dc3ad1296b40ae0), [`3056c34c`](https://github.com/thirdweb-dev/js/commit/3056c34c646e1a8c80f1323899c163e0fa867fd1), [`defe5fce`](https://github.com/thirdweb-dev/js/commit/defe5fced3fd738157616a9f1644c5092dcaa5a8), [`2f187d13`](https://github.com/thirdweb-dev/js/commit/2f187d13754f571b7205fc1b743efde767b1b1c8), [`7e564163`](https://github.com/thirdweb-dev/js/commit/7e564163cef43f9196250156373de9bf9fdbf334), [`931ee793`](https://github.com/thirdweb-dev/js/commit/931ee7930f16c25e4d775d2d93538a5cfe770353)]:
  - @thirdweb-dev/sdk@3.10.60
  - @thirdweb-dev/wallets@1.2.0
  - @thirdweb-dev/chains@0.1.51
  - @thirdweb-dev/react-core@3.14.41

## 0.2.59

### Patch Changes

- Updated dependencies [[`3eb9592e`](https://github.com/thirdweb-dev/js/commit/3eb9592e10154e06d2fa5effbc0c1a483f62498f), [`066b9cfa`](https://github.com/thirdweb-dev/js/commit/066b9cfa09df2531c9e5440477a24edc1374e0e0), [`a00cbaf7`](https://github.com/thirdweb-dev/js/commit/a00cbaf78c05ea43d3814ba9f9ec8e667f0ddb25), [`a023cb8c`](https://github.com/thirdweb-dev/js/commit/a023cb8cf1e4f08be56a2e33c146c8d307c80f40), [`2088de1c`](https://github.com/thirdweb-dev/js/commit/2088de1cacbc903d4f18a84c21a8f27af8d06b29), [`1e6f9dcc`](https://github.com/thirdweb-dev/js/commit/1e6f9dcc04022c6a8a39d490123a3e22e52b5e0b)]:
  - @thirdweb-dev/storage@1.2.10
  - @thirdweb-dev/sdk@3.10.59
  - @thirdweb-dev/wallets@1.1.23
  - @thirdweb-dev/react-core@3.14.40

## 0.2.58

### Patch Changes

- [#1546](https://github.com/thirdweb-dev/js/pull/1546) [`cdc08c55`](https://github.com/thirdweb-dev/js/commit/cdc08c55282d5873972b85217c42ba2f97a1ffed) Thanks [@iketw](https://github.com/iketw)! - Use regular import for coinbase connector in React Native

- Updated dependencies [[`926dd7b0`](https://github.com/thirdweb-dev/js/commit/926dd7b03f38ed25ca303dc23d3323d5edd28005), [`e00dd123`](https://github.com/thirdweb-dev/js/commit/e00dd123579f75752b6fe4fcf613d2cae5419e19)]:
  - @thirdweb-dev/chains@0.1.50
  - @thirdweb-dev/sdk@3.10.58
  - @thirdweb-dev/react-core@3.14.39
  - @thirdweb-dev/wallets@1.1.22

## 0.2.57

### Patch Changes

- Updated dependencies [[`eb463735`](https://github.com/thirdweb-dev/js/commit/eb463735e2f784cd1d212a982835af95cf60766b), [`adec589e`](https://github.com/thirdweb-dev/js/commit/adec589ead8ceff1b57169e05a3e6733b4652cc7), [`b30566c6`](https://github.com/thirdweb-dev/js/commit/b30566c68436ad94ddc938a380eccc13a8a7147d), [`0f027069`](https://github.com/thirdweb-dev/js/commit/0f027069064bebe647f9235fa86ef7f165ffc7b3), [`f5aed34d`](https://github.com/thirdweb-dev/js/commit/f5aed34d3c71065c3f45df2c1eb84ba9c36162d5)]:
  - @thirdweb-dev/wallets@1.1.21
  - @thirdweb-dev/sdk@3.10.57
  - @thirdweb-dev/chains@0.1.49
  - @thirdweb-dev/storage@1.2.9
  - @thirdweb-dev/react-core@3.14.38

## 0.2.56

### Patch Changes

- [#1536](https://github.com/thirdweb-dev/js/pull/1536) [`387dddbd`](https://github.com/thirdweb-dev/js/commit/387dddbd87ff6c1a53ffaf663564a44b89a3a2a5) Thanks [@iketw](https://github.com/iketw)! - Adds switchToActiveChain prop to the ConnectWallet button.

  When set to true it will show a "Switch Network" button if the wallet
  is connected to a different chain than the `activeChain` provided in `ThirdwebProvider`

  **Note:** IF you support multiple networks in your app this prop should
  be set to `false` to allow users to switch between networks.

  Usage:

  ```javascript
  <ConnectWallet switchToActiveChain={true} />
  ```

- Updated dependencies [[`f59b729f`](https://github.com/thirdweb-dev/js/commit/f59b729f8b09aa86655b8e8a70fba644fc52009b), [`911e14fc`](https://github.com/thirdweb-dev/js/commit/911e14fcac743b07fa1a66440c72d662c08e971c), [`cd6b07b5`](https://github.com/thirdweb-dev/js/commit/cd6b07b591606d2671794cebebf8edcb59076c32)]:
  - @thirdweb-dev/sdk@3.10.56
  - @thirdweb-dev/chains@0.1.48
  - @thirdweb-dev/react-core@3.14.37
  - @thirdweb-dev/wallets@1.1.20

## 0.2.55

### Patch Changes

- Updated dependencies [[`586e91db`](https://github.com/thirdweb-dev/js/commit/586e91dbe610588cc7b24fade59172fed6481074), [`34a3bb8a`](https://github.com/thirdweb-dev/js/commit/34a3bb8ae3c1d7a506e5568a9e79ab7e469557a8), [`91f0245b`](https://github.com/thirdweb-dev/js/commit/91f0245be78ae523e1faea26b1032bfb283467d9), [`f65578d6`](https://github.com/thirdweb-dev/js/commit/f65578d637decc8b87cada5b5b0c8c504064d9d5), [`5a373a75`](https://github.com/thirdweb-dev/js/commit/5a373a75090da7e1e05724ed1a3a3a6aa9f7fd21), [`ae74b8ef`](https://github.com/thirdweb-dev/js/commit/ae74b8ef6200dba8affa8b52e7d834c5552350d0), [`bc003c2f`](https://github.com/thirdweb-dev/js/commit/bc003c2fef33fcf7ce5981d8634911ac4bcaa927), [`447d9846`](https://github.com/thirdweb-dev/js/commit/447d984653f77af6860ae907072e768b584b263d), [`f65578d6`](https://github.com/thirdweb-dev/js/commit/f65578d637decc8b87cada5b5b0c8c504064d9d5), [`088547f7`](https://github.com/thirdweb-dev/js/commit/088547f763294f1641c01ffe1aabac585f255dc0)]:
  - @thirdweb-dev/sdk@3.10.55
  - @thirdweb-dev/chains@0.1.47
  - @thirdweb-dev/storage@1.2.8
  - @thirdweb-dev/react-core@3.14.36
  - @thirdweb-dev/wallets@1.1.19

## 0.2.54

### Patch Changes

- Updated dependencies [[`184c325a`](https://github.com/thirdweb-dev/js/commit/184c325ab2ef028022a050c4274f2ab12b1a3a7f), [`046c9ad6`](https://github.com/thirdweb-dev/js/commit/046c9ad604587ff79bf028c4fe7b1f9c94f4ea54), [`c12f0874`](https://github.com/thirdweb-dev/js/commit/c12f0874b4dac43c263c7edb20d0343c16381c34)]:
  - @thirdweb-dev/chains@0.1.46
  - @thirdweb-dev/storage@1.2.7
  - @thirdweb-dev/react-core@3.14.35
  - @thirdweb-dev/sdk@3.10.54
  - @thirdweb-dev/wallets@1.1.18

## 0.2.53

### Patch Changes

- Updated dependencies [[`f97ddf4c`](https://github.com/thirdweb-dev/js/commit/f97ddf4c7f14854f3b204ad9741b52ddb8dac736)]:
  - @thirdweb-dev/chains@0.1.45
  - @thirdweb-dev/react-core@3.14.34
  - @thirdweb-dev/sdk@3.10.53
  - @thirdweb-dev/wallets@1.1.17

## 0.2.52

### Patch Changes

- Updated dependencies [[`e1962641`](https://github.com/thirdweb-dev/js/commit/e19626417218767a0e44c00f440761d7b86d02eb), [`bd1fcbae`](https://github.com/thirdweb-dev/js/commit/bd1fcbae327e788124f5635673511f0b72e9d7ab)]:
  - @thirdweb-dev/sdk@3.10.52
  - @thirdweb-dev/react-core@3.14.33
  - @thirdweb-dev/wallets@1.1.16

## 0.2.51

### Patch Changes

- [#1489](https://github.com/thirdweb-dev/js/pull/1489) [`07fb1b5f`](https://github.com/thirdweb-dev/js/commit/07fb1b5ffa4c170e252df31070852ddb9a81dec9) Thanks [@iketw](https://github.com/iketw)! - Adding walletConnect as a supportedWallet in React Native

  ```javascript
  import {
    localWallet,
    ThirdwebProvider,
    walletConnect,
  } from "@thirdweb-dev/react-native";
  import { Ethereum } from "@thirdweb-dev/chains";

  const App = () => {
    const activeChain = Ethereum;
    return (
      <ThirdwebProvider
        activeChain={activeChain}
        supportedChains={[activeChain]}
        clientId="your-client-id"
        supportedWallets={[
          localWallet(),
          walletConnect({
            projectId: "your-wallet-connect-project-id", // optional, but we recommend you get your own for production
          }),
        ]}
      >
        <AppInner />
      </ThirdwebProvider>
    );
  };
  ```

- [#1496](https://github.com/thirdweb-dev/js/pull/1496) [`26349f31`](https://github.com/thirdweb-dev/js/commit/26349f311d144d692c69a6c2a7ec0f34949851d4) Thanks [@iketw](https://github.com/iketw)! - Improves loading states when disconnecting and fetching balances

- Updated dependencies [[`07fb1b5f`](https://github.com/thirdweb-dev/js/commit/07fb1b5ffa4c170e252df31070852ddb9a81dec9), [`300a3c6f`](https://github.com/thirdweb-dev/js/commit/300a3c6f04d0ea7e25dfdb0a4c28b3a5796fcadf), [`d248aa2c`](https://github.com/thirdweb-dev/js/commit/d248aa2c5a89a297dd2623c961793026de1de346), [`d248aa2c`](https://github.com/thirdweb-dev/js/commit/d248aa2c5a89a297dd2623c961793026de1de346), [`8f3b685a`](https://github.com/thirdweb-dev/js/commit/8f3b685ad2bd73cb4d5d8c8aa25c04ffc10fb7cf), [`28975765`](https://github.com/thirdweb-dev/js/commit/2897576513eb6f497a9f92e3e473182b4fc9681b), [`b91d3e99`](https://github.com/thirdweb-dev/js/commit/b91d3e990198b77dc1358e738c11dc4acaa67491)]:
  - @thirdweb-dev/react-core@3.14.32
  - @thirdweb-dev/wallets@1.1.15
  - @thirdweb-dev/sdk@3.10.51
  - @thirdweb-dev/storage@1.2.6
  - @thirdweb-dev/chains@0.1.44

## 0.2.50

### Patch Changes

- Updated dependencies [[`39e2af6f`](https://github.com/thirdweb-dev/js/commit/39e2af6f2f4d933dca1b3de4a37de76375bafd74), [`a5ba9e4f`](https://github.com/thirdweb-dev/js/commit/a5ba9e4fbfee228e5b9ac27cd0157187e3a50117), [`39e2af6f`](https://github.com/thirdweb-dev/js/commit/39e2af6f2f4d933dca1b3de4a37de76375bafd74)]:
  - @thirdweb-dev/wallets@1.1.14
  - @thirdweb-dev/sdk@3.10.50
  - @thirdweb-dev/react-core@3.14.31

## 0.2.49

### Patch Changes

- [#1479](https://github.com/thirdweb-dev/js/pull/1479) [`14d9a71c`](https://github.com/thirdweb-dev/js/commit/14d9a71c928019907618cc8694af0bc631e94b68) Thanks [@iketw](https://github.com/iketw)! - Deprecates magicWallet in favor of magicLink for consistency with our React package

- [#1477](https://github.com/thirdweb-dev/js/pull/1477) [`34b31599`](https://github.com/thirdweb-dev/js/commit/34b315993c0abaccb9640a5d5804c2c93af569c2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Pass unauth'd RPCs to wallets when adding new chains

- Updated dependencies [[`34b31599`](https://github.com/thirdweb-dev/js/commit/34b315993c0abaccb9640a5d5804c2c93af569c2), [`7f531122`](https://github.com/thirdweb-dev/js/commit/7f5311222b14da04877df056baae36409dff4696)]:
  - @thirdweb-dev/wallets@1.1.13
  - @thirdweb-dev/sdk@3.10.49
  - @thirdweb-dev/react-core@3.14.30

## 0.2.48

### Patch Changes

- [#1458](https://github.com/thirdweb-dev/js/pull/1458) [`588b2106`](https://github.com/thirdweb-dev/js/commit/588b21060139a7c0bf5805e2c629a16792ed2c76) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add `hideTestnetFaucet` to hide the "Request Testnet funds" button in ConnectWallet details dropdown in `@thirdweb-dev/react-native` and `@thirdweb-dev/react`.

  ```ts
  <ConnectWallet hideTestnetFaucet={true} />
  ```

- Updated dependencies [[`73462ef1`](https://github.com/thirdweb-dev/js/commit/73462ef10800aeeb5976634e2bc6fb5d3e8501e4), [`27c225a5`](https://github.com/thirdweb-dev/js/commit/27c225a51221417592b5940887abd1ccb8b67e47), [`cb1c9937`](https://github.com/thirdweb-dev/js/commit/cb1c9937fadb2d06eb148cf9819f2b3601376308), [`70c4a119`](https://github.com/thirdweb-dev/js/commit/70c4a119d691a37ec999d9f6087902d532cc82ed), [`a1732663`](https://github.com/thirdweb-dev/js/commit/a17326634e758c3bf42f0cc3869b8792f1e18cc9), [`f0443bd9`](https://github.com/thirdweb-dev/js/commit/f0443bd989dbba50d0836d1cf274bfb2f44a53fd), [`cb1c9937`](https://github.com/thirdweb-dev/js/commit/cb1c9937fadb2d06eb148cf9819f2b3601376308), [`588b2106`](https://github.com/thirdweb-dev/js/commit/588b21060139a7c0bf5805e2c629a16792ed2c76), [`269e68c0`](https://github.com/thirdweb-dev/js/commit/269e68c0a15e8f78cb5b68c9456ca8094b9e1f30)]:
  - @thirdweb-dev/storage@1.2.5
  - @thirdweb-dev/wallets@1.1.12
  - @thirdweb-dev/sdk@3.10.48
  - @thirdweb-dev/chains@0.1.43
  - @thirdweb-dev/react-core@3.14.29

## 0.2.47

### Patch Changes

- Updated dependencies [[`4c37af49`](https://github.com/thirdweb-dev/js/commit/4c37af49aa4fa66beb8ffe8ef556068a29f3c5d4), [`4b0e63dc`](https://github.com/thirdweb-dev/js/commit/4b0e63dcc0ca871ce9cef76f8a41ff290316741c)]:
  - @thirdweb-dev/storage@1.2.4
  - @thirdweb-dev/react-core@3.14.28
  - @thirdweb-dev/wallets@1.1.11
  - @thirdweb-dev/sdk@3.10.47

## 0.2.46

### Patch Changes

- [#1452](https://github.com/thirdweb-dev/js/pull/1452) [`3ba8ba42`](https://github.com/thirdweb-dev/js/commit/3ba8ba428845f5b2ae90ca73855be275fc78373c) Thanks [@iketw](https://github.com/iketw)! - Upgrade Coinbase wallet SDK; it adds support for React Native 0.72.3

- Updated dependencies [[`262edc6a`](https://github.com/thirdweb-dev/js/commit/262edc6a46792da88f49ff6ef0a756a932a6a0cf), [`262edc6a`](https://github.com/thirdweb-dev/js/commit/262edc6a46792da88f49ff6ef0a756a932a6a0cf), [`dfd120a3`](https://github.com/thirdweb-dev/js/commit/dfd120a3a9d1582c8b174265c92bf43dbbaf5c86)]:
  - @thirdweb-dev/chains@0.1.42
  - @thirdweb-dev/sdk@3.10.46
  - @thirdweb-dev/react-core@3.14.27
  - @thirdweb-dev/wallets@1.1.10

## 0.2.45

### Patch Changes

- Updated dependencies [[`2a91113a`](https://github.com/thirdweb-dev/js/commit/2a91113a760733fcff2aec90041f69e15de33905)]:
  - @thirdweb-dev/sdk@3.10.45
  - @thirdweb-dev/react-core@3.14.26
  - @thirdweb-dev/wallets@1.1.9

## 0.2.44

### Patch Changes

- [#1429](https://github.com/thirdweb-dev/js/pull/1429) [`ab36d84f`](https://github.com/thirdweb-dev/js/commit/ab36d84f1ce5647fa52475b4a35ea29d5007ad9b) Thanks [@iketw](https://github.com/iketw)! - Pass secretKey in the React SDK for server-side rendering

- Updated dependencies [[`a5d0be93`](https://github.com/thirdweb-dev/js/commit/a5d0be939a143095e769b68cf86360bfe4720744), [`c0a6d2f1`](https://github.com/thirdweb-dev/js/commit/c0a6d2f18231310d143c9b0cb1b2ff59315087a4), [`a9f2ff73`](https://github.com/thirdweb-dev/js/commit/a9f2ff73c9f83f05c3e2d3c53b23b2843e8a2576), [`fd981655`](https://github.com/thirdweb-dev/js/commit/fd9816556fe595b0c764e34dbcf15b0ad1677edb), [`becbb637`](https://github.com/thirdweb-dev/js/commit/becbb637367285ed3d8d7d131e1020bf23e38298), [`2283d210`](https://github.com/thirdweb-dev/js/commit/2283d21027503e047c25df5ebb21bdde0734be9e), [`fd981655`](https://github.com/thirdweb-dev/js/commit/fd9816556fe595b0c764e34dbcf15b0ad1677edb), [`ab36d84f`](https://github.com/thirdweb-dev/js/commit/ab36d84f1ce5647fa52475b4a35ea29d5007ad9b), [`c9bf4f05`](https://github.com/thirdweb-dev/js/commit/c9bf4f05c161707c6eb799ecef82f462e4a82405), [`67b145b9`](https://github.com/thirdweb-dev/js/commit/67b145b94dafb2fb1d90553ed4829f0ed22e2907), [`5ee700e8`](https://github.com/thirdweb-dev/js/commit/5ee700e80438650fa253c25c0bee6658ce68d2cf), [`9f5adc5c`](https://github.com/thirdweb-dev/js/commit/9f5adc5c5c2782ffb878759df481e5fb1e1740e5)]:
  - @thirdweb-dev/sdk@3.10.44
  - @thirdweb-dev/wallets@1.1.8
  - @thirdweb-dev/react-core@3.14.25
  - @thirdweb-dev/chains@0.1.41

## 0.2.43

### Patch Changes

- Updated dependencies [[`3b6b0746`](https://github.com/thirdweb-dev/js/commit/3b6b0746b3fc792f4c5092814a7abfabcbc9801e), [`b0ec1d80`](https://github.com/thirdweb-dev/js/commit/b0ec1d80839efccad11b50afbf2216c2c132cf7e)]:
  - @thirdweb-dev/storage@1.2.3
  - @thirdweb-dev/wallets@1.1.7
  - @thirdweb-dev/sdk@3.10.43
  - @thirdweb-dev/react-core@3.14.24

## 0.2.42

### Patch Changes

- Updated dependencies [[`fbde927a`](https://github.com/thirdweb-dev/js/commit/fbde927a0cb36a6269e045d8e577536f23164ef7)]:
  - @thirdweb-dev/wallets@1.1.6
  - @thirdweb-dev/react-core@3.14.23

## 0.2.41

### Patch Changes

- Updated dependencies [[`256ee0d5`](https://github.com/thirdweb-dev/js/commit/256ee0d5ec9c8598aa79cd4cb1fd839c6cc7d390)]:
  - @thirdweb-dev/react-core@3.14.22
  - @thirdweb-dev/storage@1.2.2
  - @thirdweb-dev/wallets@1.1.5
  - @thirdweb-dev/chains@0.1.40
  - @thirdweb-dev/sdk@3.10.42

## 0.2.40

### Patch Changes

- [#1409](https://github.com/thirdweb-dev/js/pull/1409) [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#1376](https://github.com/thirdweb-dev/js/pull/1376) [`48ca58b7`](https://github.com/thirdweb-dev/js/commit/48ca58b7aa45348b928932b9c7b76b3dc233e429) Thanks [@iketw](https://github.com/iketw)! - Pass bundleId if present

- [#1385](https://github.com/thirdweb-dev/js/pull/1385) [`cc5e2ec5`](https://github.com/thirdweb-dev/js/commit/cc5e2ec51fce09af05be33811eb46980825829ee) Thanks [@iketw](https://github.com/iketw)! - Allow switching between supported chains in the React Native Wallet Details' modal

  - You can now enable showing a modal to switch between the supported chains defined in your ThirdwebProvider

  ```javascript
  <NetworkButton chain={chain} enableSwitchModal={true} />
  ```

  - You can also use the `NetworkButton` to switch to the chain represented on it:

  ```javascript
  <NetworkButton
    chain={chain}
    switchChainOnPress={true}
    onChainSwitched={onChainSwitched}
  />
  ```

- [#1391](https://github.com/thirdweb-dev/js/pull/1391) [`ff4fb7d3`](https://github.com/thirdweb-dev/js/commit/ff4fb7d36004eea0ae35eb92510bded0b2c49e22) Thanks [@iketw](https://github.com/iketw)! - Extend the thirdweb SDK and pass the correct React Native storage

  ```javascript
  import { ThirdwebSDK } from "@thirdweb-dev/react-native";

  const newSdk = new ThirdwebSDK("mumbai");
  const resp = await newSdk.storage.upload({ foo: "bar" });
  ```

- Updated dependencies [[`09b3b339`](https://github.com/thirdweb-dev/js/commit/09b3b339e65a6a9a1cfa32bab9e61e57532e7dbe), [`0a5eb19d`](https://github.com/thirdweb-dev/js/commit/0a5eb19d672909027bb6c7e79ea76d431535559c), [`98009cb3`](https://github.com/thirdweb-dev/js/commit/98009cb3ca6f1c2221a6a74ffa7df8d7ddac2c60), [`06b4f298`](https://github.com/thirdweb-dev/js/commit/06b4f2983161fc9ff5913fd05dacf17260902576), [`72fa3d22`](https://github.com/thirdweb-dev/js/commit/72fa3d22254d0415b9d264b3897173bd400cd948), [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2), [`51b36040`](https://github.com/thirdweb-dev/js/commit/51b3604021ca7b52fd00fd07c5a648a73464a61b), [`2025b8cb`](https://github.com/thirdweb-dev/js/commit/2025b8cb8d5157c03314e5db47a0d50382519c41), [`cbf486c2`](https://github.com/thirdweb-dev/js/commit/cbf486c21088ec1656933961e653e1d161939f63), [`01cc5408`](https://github.com/thirdweb-dev/js/commit/01cc54087b9d276968cb6dd3ceafa07c30bc2242), [`53400858`](https://github.com/thirdweb-dev/js/commit/53400858232ceb998d68da8a75a6d493668fcf0f), [`385895ca`](https://github.com/thirdweb-dev/js/commit/385895ca928a5276586f0a370fabdcece7620d83), [`9acf6854`](https://github.com/thirdweb-dev/js/commit/9acf6854dfdc5c0be768e660c1f174e017b06a9c), [`48ca58b7`](https://github.com/thirdweb-dev/js/commit/48ca58b7aa45348b928932b9c7b76b3dc233e429), [`aface46d`](https://github.com/thirdweb-dev/js/commit/aface46d7469ca2c1e45895e311a74363ceb8611), [`60fbb767`](https://github.com/thirdweb-dev/js/commit/60fbb767c18ffe1e49792c6ac8e808792acf594c), [`3152d4e9`](https://github.com/thirdweb-dev/js/commit/3152d4e9b42e2777316b1b58513657f4430cb79a), [`5fe3cec8`](https://github.com/thirdweb-dev/js/commit/5fe3cec894b98a2361d21bb72a5da843ec2a4d9b), [`8e6e55b1`](https://github.com/thirdweb-dev/js/commit/8e6e55b154ecdc4b09ded31387707571ff963fb7), [`aa6bdd08`](https://github.com/thirdweb-dev/js/commit/aa6bdd0809d1d5536c837c59b2d407ee974c1f9c), [`277cfd5c`](https://github.com/thirdweb-dev/js/commit/277cfd5ce1f3a576d29c95492c735b46a00c164e), [`75587c8b`](https://github.com/thirdweb-dev/js/commit/75587c8b38bbbcf68d2101526e9792349cce728f), [`2025b8cb`](https://github.com/thirdweb-dev/js/commit/2025b8cb8d5157c03314e5db47a0d50382519c41), [`cc5e2ec5`](https://github.com/thirdweb-dev/js/commit/cc5e2ec51fce09af05be33811eb46980825829ee), [`a9f9a403`](https://github.com/thirdweb-dev/js/commit/a9f9a403457b9e683bcfdb61034ee9c9ee08bbf8), [`7ae9f4cd`](https://github.com/thirdweb-dev/js/commit/7ae9f4cda1a2009dd414f836757bec8202c83172), [`5a02c5ec`](https://github.com/thirdweb-dev/js/commit/5a02c5ec0288fd6dfb2b765ef70bb18e714aca19)]:
  - @thirdweb-dev/sdk@3.10.41
  - @thirdweb-dev/chains@0.1.39
  - @thirdweb-dev/wallets@1.1.4
  - @thirdweb-dev/react-core@3.14.21
  - @thirdweb-dev/storage@1.2.1

## 0.2.39

### Patch Changes

- Updated dependencies [[`7cb55e70`](https://github.com/thirdweb-dev/js/commit/7cb55e7051617268bba1b80146865c606ff6e66d)]:
  - @thirdweb-dev/chains@0.1.38
  - @thirdweb-dev/react-core@3.14.20
  - @thirdweb-dev/sdk@3.10.40
  - @thirdweb-dev/wallets@1.1.3

## 0.2.38

### Patch Changes

- Updated dependencies [[`d665954f`](https://github.com/thirdweb-dev/js/commit/d665954fee0554985055bf06abbed8d7b8d5bc38)]:
  - @thirdweb-dev/chains@0.1.37
  - @thirdweb-dev/react-core@3.14.19
  - @thirdweb-dev/sdk@3.10.39
  - @thirdweb-dev/wallets@1.1.2

## 0.2.37

### Patch Changes

- Updated dependencies [[`02ab92cc`](https://github.com/thirdweb-dev/js/commit/02ab92cc5c97f475e3b5642e5a7bdbe63ca136ee), [`6cc4b8d2`](https://github.com/thirdweb-dev/js/commit/6cc4b8d28b982c5be3e1cd17d2a9a947001d1608)]:
  - @thirdweb-dev/chains@0.1.36
  - @thirdweb-dev/react-core@3.14.18
  - @thirdweb-dev/sdk@3.10.38
  - @thirdweb-dev/wallets@1.1.1

## 0.2.36

### Patch Changes

- [#1362](https://github.com/thirdweb-dev/js/pull/1362) [`44dbf283`](https://github.com/thirdweb-dev/js/commit/44dbf283c985f3e2ecbeb1cfdf09fe1d84e26298) Thanks [@iketw](https://github.com/iketw)! - Correctly pass clientId in storage

- [#1316](https://github.com/thirdweb-dev/js/pull/1316) [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b) Thanks [@iketw](https://github.com/iketw)! - Adds new `clientId` prop to access thirdweb's services.

  You can create a _free_ `clientId` [on the thirdweb Dashboard](https://thirdweb.com/dashboard)

  ```javascript
  <ThirdwebProvider clientId="your-client-id" />
  ```

- Updated dependencies [[`44dbf283`](https://github.com/thirdweb-dev/js/commit/44dbf283c985f3e2ecbeb1cfdf09fe1d84e26298), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b)]:
  - @thirdweb-dev/storage@1.2.0
  - @thirdweb-dev/sdk@3.10.37
  - @thirdweb-dev/react-core@3.14.17
  - @thirdweb-dev/chains@0.1.35
  - @thirdweb-dev/wallets@1.1.0

## 0.2.35

### Patch Changes

- Updated dependencies [[`7a6534d1`](https://github.com/thirdweb-dev/js/commit/7a6534d1a98cab1eb47cf88d13e2b7ec04037e42), [`dac8fa7d`](https://github.com/thirdweb-dev/js/commit/dac8fa7d98b6952acf8d13e173099889c1d47da8), [`c5761b99`](https://github.com/thirdweb-dev/js/commit/c5761b99e9797772481506e90cbfa5c35a05bd1d), [`b96a2282`](https://github.com/thirdweb-dev/js/commit/b96a2282730582b684cc96802649a96851af5220)]:
  - @thirdweb-dev/react-core@3.14.16
  - @thirdweb-dev/sdk@3.10.36
  - @thirdweb-dev/wallets@1.0.12

## 0.2.34

### Patch Changes

- Updated dependencies [[`8dd7540c`](https://github.com/thirdweb-dev/js/commit/8dd7540c455aa70534f6d29986537592fd12169b), [`8dd7540c`](https://github.com/thirdweb-dev/js/commit/8dd7540c455aa70534f6d29986537592fd12169b)]:
  - @thirdweb-dev/storage@1.1.9
  - @thirdweb-dev/chains@0.1.34
  - @thirdweb-dev/react-core@3.14.15
  - @thirdweb-dev/sdk@3.10.35
  - @thirdweb-dev/wallets@1.0.11

## 0.2.33

### Patch Changes

- Updated dependencies [[`0407b2c2`](https://github.com/thirdweb-dev/js/commit/0407b2c2f39b5f3fa06e613e671623b5644b3a28)]:
  - @thirdweb-dev/chains@0.1.33
  - @thirdweb-dev/react-core@3.14.14
  - @thirdweb-dev/sdk@3.10.34
  - @thirdweb-dev/wallets@1.0.10

## 0.2.32

### Patch Changes

- Updated dependencies [[`a9093bcf`](https://github.com/thirdweb-dev/js/commit/a9093bcf287c01e3335fd780e2ccbfdb3380bf95)]:
  - @thirdweb-dev/chains@0.1.32
  - @thirdweb-dev/react-core@3.14.13
  - @thirdweb-dev/sdk@3.10.33
  - @thirdweb-dev/wallets@1.0.9

## 0.2.31

### Patch Changes

- Updated dependencies [[`4393b228`](https://github.com/thirdweb-dev/js/commit/4393b2280505fd0b2284555d64eae6567e8401a5)]:
  - @thirdweb-dev/chains@0.1.31
  - @thirdweb-dev/react-core@3.14.12
  - @thirdweb-dev/sdk@3.10.32
  - @thirdweb-dev/wallets@1.0.8

## 0.2.30

### Patch Changes

- Updated dependencies [[`40682191`](https://github.com/thirdweb-dev/js/commit/40682191450de08ad40b9d2957afced248657af2)]:
  - @thirdweb-dev/chains@0.1.30
  - @thirdweb-dev/react-core@3.14.11
  - @thirdweb-dev/sdk@3.10.31
  - @thirdweb-dev/wallets@1.0.7

## 0.2.29

### Patch Changes

- Updated dependencies [[`db68bd04`](https://github.com/thirdweb-dev/js/commit/db68bd04cd8bb3ee6bff051d1d5b5a872353fde0), [`fd74d791`](https://github.com/thirdweb-dev/js/commit/fd74d7918072cda03b52f852ebb3f8dccb84074d), [`35f20ceb`](https://github.com/thirdweb-dev/js/commit/35f20ceb4f943e95d9566105096f06412978da7a)]:
  - @thirdweb-dev/storage@1.1.8
  - @thirdweb-dev/sdk@3.10.30
  - @thirdweb-dev/chains@0.1.29
  - @thirdweb-dev/react-core@3.14.10
  - @thirdweb-dev/wallets@1.0.6

## 0.2.28

### Patch Changes

- [#1283](https://github.com/thirdweb-dev/js/pull/1283) [`8672c853`](https://github.com/thirdweb-dev/js/commit/8672c8533c694cad46242672ec23b883049bd526) Thanks [@iketw](https://github.com/iketw)! - SDK improvements:

  1. You can now pass an `extraRows` prop to the ConnectWallet button. This will render the `extraRows` at the bottom of the connected wallet details modal.

  ```javascript
  import {
    BaseButton,
    Box,
    ConnectWallet,
    Text,
  } from "@thirdweb-dev/react-native";

  const extraRows = () => {
    return (
      <Box>
        <Text variant="bodySmallSecondary" textAlign="center" mt="sm">
          Extra option
        </Text>
      </Box>
    );
  };

  <ConnectWallet theme={"dark"} extraRows={extraRows} />;
  ```

  2. You can now import a local wallet by a mnemoic as well.

  When creating a Local/Guest Wallet the import wallet modal accepts both a privateKey or a mnemonic. This makes it easier for users to import their wallets into your app

- [#1309](https://github.com/thirdweb-dev/js/pull/1309) [`4961b597`](https://github.com/thirdweb-dev/js/commit/4961b597a098dae0a4eff01a9ef268a65fe1a352) Thanks [@jnsdls](https://github.com/jnsdls)! - unblock storage domains

- Updated dependencies [[`7e044c66`](https://github.com/thirdweb-dev/js/commit/7e044c664d8a034f5324b859ac3596860c86f9a5), [`72ada475`](https://github.com/thirdweb-dev/js/commit/72ada47596d5d5c08736c33215faeec636b7156a), [`2c0bb078`](https://github.com/thirdweb-dev/js/commit/2c0bb0789955f6cd397b6fdb8e990a505251c631), [`b5c6eedb`](https://github.com/thirdweb-dev/js/commit/b5c6eedb38aa3c52eb97f3d25ad83e38c55afe61), [`10b3a717`](https://github.com/thirdweb-dev/js/commit/10b3a717da606632a05769ac821bdd21d6b63a03), [`b4aee9b5`](https://github.com/thirdweb-dev/js/commit/b4aee9b59121bab5f9b3d9b7ecdc4bcb4cd66f58), [`4961b597`](https://github.com/thirdweb-dev/js/commit/4961b597a098dae0a4eff01a9ef268a65fe1a352)]:
  - @thirdweb-dev/chains@0.1.28
  - @thirdweb-dev/sdk@3.10.29
  - @thirdweb-dev/wallets@1.0.5
  - @thirdweb-dev/react-core@3.14.9
  - @thirdweb-dev/storage@1.1.7

## 0.2.27

### Patch Changes

- [#1278](https://github.com/thirdweb-dev/js/pull/1278) [`8a389f12`](https://github.com/thirdweb-dev/js/commit/8a389f1295d2bf726059997ea0ca10cf0424f2a2) Thanks [@jnsdls](https://github.com/jnsdls)! - updated various dependencies

- Updated dependencies [[`2d088d36`](https://github.com/thirdweb-dev/js/commit/2d088d367ca54233836dc69712fd411ab7924205), [`8a389f12`](https://github.com/thirdweb-dev/js/commit/8a389f1295d2bf726059997ea0ca10cf0424f2a2), [`9daf0449`](https://github.com/thirdweb-dev/js/commit/9daf044926bf995ac8998929dbeca548c5eb8561), [`546353a4`](https://github.com/thirdweb-dev/js/commit/546353a479c11533818ef917c0f6b4d6f8f69872), [`a3bb17cb`](https://github.com/thirdweb-dev/js/commit/a3bb17cb33f033846fb3b4c8a0a4809ba76cab96), [`0135a779`](https://github.com/thirdweb-dev/js/commit/0135a7790cf2acde6b701cb41ea10dd311da5ec3)]:
  - @thirdweb-dev/storage@1.1.6
  - @thirdweb-dev/react-core@3.14.8
  - @thirdweb-dev/wallets@1.0.4
  - @thirdweb-dev/chains@0.1.27
  - @thirdweb-dev/sdk@3.10.28

## 0.2.26

### Patch Changes

- [#1270](https://github.com/thirdweb-dev/js/pull/1270) [`0d5503aa`](https://github.com/thirdweb-dev/js/commit/0d5503aae90d9cd7a7adcabad19f7f45d9a37063) Thanks [@iketw](https://github.com/iketw)! - Only handle Coinbase callback URL if Coinbase is added as a supportedWallet

- [#1277](https://github.com/thirdweb-dev/js/pull/1277) [`2b113539`](https://github.com/thirdweb-dev/js/commit/2b113539098384f910b3c4d54e1fde9d35a6f053) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - remove ethers/lib/utils dependency

- Updated dependencies [[`2b113539`](https://github.com/thirdweb-dev/js/commit/2b113539098384f910b3c4d54e1fde9d35a6f053), [`c9535715`](https://github.com/thirdweb-dev/js/commit/c95357158819abd42d4b0900ecc2fa40fcb957f8), [`be606dd3`](https://github.com/thirdweb-dev/js/commit/be606dd3c93c1514834c1d970e864d7f949a07ab), [`edcd22d6`](https://github.com/thirdweb-dev/js/commit/edcd22d61236edb2832f9b2f9796e891d58cb145), [`5882091e`](https://github.com/thirdweb-dev/js/commit/5882091eab65978009a5a5305701f121851b10ad), [`998e5217`](https://github.com/thirdweb-dev/js/commit/998e521733efd6a67e42f9bf0beab5fbdccf08ae)]:
  - @thirdweb-dev/wallets@1.0.3
  - @thirdweb-dev/sdk@3.10.27
  - @thirdweb-dev/react-core@3.14.7
  - @thirdweb-dev/chains@0.1.26

## 0.2.25

### Patch Changes

- Updated dependencies [[`ed711c8c`](https://github.com/thirdweb-dev/js/commit/ed711c8cb2ed6a0deb1b2a5eeec06df1d4edc5e8), [`05a7495a`](https://github.com/thirdweb-dev/js/commit/05a7495a132aabab5f48abbdb80a468ff6f65df8), [`e78da6b3`](https://github.com/thirdweb-dev/js/commit/e78da6b36cfa6d954234820563201bf760186ed1)]:
  - @thirdweb-dev/wallets@1.0.2
  - @thirdweb-dev/react-core@3.14.6

## 0.2.24

### Patch Changes

- Updated dependencies [[`efb3546e`](https://github.com/thirdweb-dev/js/commit/efb3546ec8268156be00301af28b9d83ecd5ab08)]:
  - @thirdweb-dev/wallets@1.0.1
  - @thirdweb-dev/react-core@3.14.5

## 0.2.23

### Patch Changes

- [#1215](https://github.com/thirdweb-dev/js/pull/1215) [`3c5dc480`](https://github.com/thirdweb-dev/js/commit/3c5dc4804abc56b933ec45e9e1da11eb182296cc) Thanks [@iketw](https://github.com/iketw)! - Migrate wallets to WCV2 and remove WCV1 support.

  Please, check our changelogs for more info: https://blog.thirdweb.com/changelog/

- Updated dependencies [[`ef4cb092`](https://github.com/thirdweb-dev/js/commit/ef4cb092192c58c9b292b29590b888f45f9fd23d), [`06ca1c40`](https://github.com/thirdweb-dev/js/commit/06ca1c407dfee9d3d1fdaed1b6223ad0f9b8857b), [`620e89dc`](https://github.com/thirdweb-dev/js/commit/620e89dc25c91557e2164a602c7aedd733525087), [`ac3e019c`](https://github.com/thirdweb-dev/js/commit/ac3e019cd1776dbdb0d06b213420ad17586f678e), [`30ac3aef`](https://github.com/thirdweb-dev/js/commit/30ac3aef840bde51a61acf786c709cffd3c47354), [`3c5dc480`](https://github.com/thirdweb-dev/js/commit/3c5dc4804abc56b933ec45e9e1da11eb182296cc), [`ad7dae3b`](https://github.com/thirdweb-dev/js/commit/ad7dae3b163e61c7a6eb57f654885a7fdaa4cbb6), [`620e89dc`](https://github.com/thirdweb-dev/js/commit/620e89dc25c91557e2164a602c7aedd733525087), [`0fd8aa04`](https://github.com/thirdweb-dev/js/commit/0fd8aa04a9424497758d13a51a72363edcc30e19)]:
  - @thirdweb-dev/sdk@3.10.26
  - @thirdweb-dev/react-core@3.14.4
  - @thirdweb-dev/wallets@1.0.0
  - @thirdweb-dev/chains@0.1.25

## 0.2.22

### Patch Changes

- [#1245](https://github.com/thirdweb-dev/js/pull/1245) [`d9fb134a`](https://github.com/thirdweb-dev/js/commit/d9fb134ad40ae067416625eb43cf3708f87db7b5) Thanks [@iketw](https://github.com/iketw)! - [RN]

  - Added the option to import a new wallet in guest mode

  - Added a "Request Testnet Funds" option when on testnets

- [#1245](https://github.com/thirdweb-dev/js/pull/1245) [`d9fb134a`](https://github.com/thirdweb-dev/js/commit/d9fb134ad40ae067416625eb43cf3708f87db7b5) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Export more components for easy development

  - IconTextButton
    Component that renders an icon and a text inside a button with border:

  ```javascript
  <IconTextButton
    mt="xs"
    text="Switch Accounts"
    icon={<SwitchIcon height={10} width={10} />}
    onPress={() => {}}
  />
  ```

  - NetworkButton: Used to render a Network

  ```javascript
  <NetworkButton
    chainIconUrl={chain?.icon?.url || ""}
    chainName={chain?.name || "Unknown Network"}
    onPress={onChangeNetworkPress}
  />
  ```

  - Exported all icons from the assets folder for external use

- Updated dependencies [[`536b0f12`](https://github.com/thirdweb-dev/js/commit/536b0f1240ab446aac22cf547a4e09e73ee6bf7b), [`1d76334d`](https://github.com/thirdweb-dev/js/commit/1d76334dd3884703629835422f241d2825128f6f), [`b626782b`](https://github.com/thirdweb-dev/js/commit/b626782b0e8c6b76673472d3aee1c802dfb11b5f), [`d498c79a`](https://github.com/thirdweb-dev/js/commit/d498c79a911d478077dfb8a2490eb1bf91523186), [`0c5b03b8`](https://github.com/thirdweb-dev/js/commit/0c5b03b8d6cc6a4e69bb2a4647d3626e69f1283c), [`9af346ee`](https://github.com/thirdweb-dev/js/commit/9af346eeada1037be27c8d3c9e1777f7be11a8ea)]:
  - @thirdweb-dev/wallets@0.3.3
  - @thirdweb-dev/react-core@3.14.3
  - @thirdweb-dev/sdk@3.10.25
  - @thirdweb-dev/storage@1.1.5
  - @thirdweb-dev/chains@0.1.24

## 0.2.21

### Patch Changes

- [#1220](https://github.com/thirdweb-dev/js/pull/1220) [`3cb298ac`](https://github.com/thirdweb-dev/js/commit/3cb298ac4b04d295899b5ac77c7fc5869ec2f5f2) Thanks [@iketw](https://github.com/iketw)! - [RN/Wallets] Fix Coinbase wallet connection rejection error

  Unhandled Rejections: We were rethrowing an error in an async function (connect) without any catch block to handle it. We were getting an Unhandled Promise Rejection, which lead to a crash in React Native when rejecting a connection from the Coinbase Wallet.

- Updated dependencies [[`6816219a`](https://github.com/thirdweb-dev/js/commit/6816219ac13ae571a0c90db6ab389c319bc1f052), [`48065bcd`](https://github.com/thirdweb-dev/js/commit/48065bcd91c13e1f44d54343b5c6c2646b9e86e4), [`3cb298ac`](https://github.com/thirdweb-dev/js/commit/3cb298ac4b04d295899b5ac77c7fc5869ec2f5f2), [`b5e1d3bb`](https://github.com/thirdweb-dev/js/commit/b5e1d3bb2b82785d6d3e5c899d27691bdb638625), [`6aa6f7e0`](https://github.com/thirdweb-dev/js/commit/6aa6f7e0bd2313e2e1ad96dd41aad91e6694d380), [`f7f4f207`](https://github.com/thirdweb-dev/js/commit/f7f4f20737ac5d78424ca9c91220f00b85adde6b), [`3ce5f9a0`](https://github.com/thirdweb-dev/js/commit/3ce5f9a0c3fc7e99b5abf691a87048ab8475f6b1), [`d4d95507`](https://github.com/thirdweb-dev/js/commit/d4d95507130b2b5408bfaa73ef3b708ca00c773e), [`a388d07a`](https://github.com/thirdweb-dev/js/commit/a388d07a3d449e56dc53fed9600931022f4a15e1), [`1ce8558d`](https://github.com/thirdweb-dev/js/commit/1ce8558df47186bcba5ee8564fdb04583bf115dd), [`483e2b91`](https://github.com/thirdweb-dev/js/commit/483e2b910934d75276a68bae64d04c47cd7d57e3), [`c08e6ba9`](https://github.com/thirdweb-dev/js/commit/c08e6ba988ad97aa27d5868cec8abe3498d07a0a), [`60fb1889`](https://github.com/thirdweb-dev/js/commit/60fb18894372f14d9cd815fa9a239926d31bb273), [`3d615a62`](https://github.com/thirdweb-dev/js/commit/3d615a62d0a6801f6fb0e63f9b95c2f98446add1)]:
  - @thirdweb-dev/chains@0.1.23
  - @thirdweb-dev/sdk@3.10.24
  - @thirdweb-dev/wallets@0.3.2
  - @thirdweb-dev/react-core@3.14.2

## 0.2.20

### Patch Changes

- [#1202](https://github.com/thirdweb-dev/js/pull/1202) [`04416e7c`](https://github.com/thirdweb-dev/js/commit/04416e7c93d3b090fe0145ada6de5dbec211e29d) Thanks [@iketw](https://github.com/iketw)! - [RN] Return connection Promise in wallets hooks for better error handling

- [#1205](https://github.com/thirdweb-dev/js/pull/1205) [`3ab7d1e9`](https://github.com/thirdweb-dev/js/commit/3ab7d1e97541ad5ff4f58ec2885fda9f9ab1a7c6) Thanks [@iketw](https://github.com/iketw)! - [RN] Added the option to import a new wallet in guest mode

- [#1205](https://github.com/thirdweb-dev/js/pull/1205) [`3ab7d1e9`](https://github.com/thirdweb-dev/js/commit/3ab7d1e97541ad5ff4f58ec2885fda9f9ab1a7c6) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Export more components for easy development

  - IconTextButton
    Component that renders an icon and a text inside a button with border:

  ```javascript
  <IconTextButton
    mt="xs"
    text="Switch Accounts"
    icon={<SwitchIcon height={10} width={10} />}
    onPress={() => {}}
  />
  ```

  - NetworkButton: Used to render a Network

  ```javascript
  <NetworkButton
    chainIconUrl={chain?.icon?.url || ""}
    chainName={chain?.name || "Unknown Network"}
    onPress={onChangeNetworkPress}
  />
  ```

  - Exported all icons from the assets folder for external use

- Updated dependencies [[`d9b7360d`](https://github.com/thirdweb-dev/js/commit/d9b7360d1d78abcdaca89aa35e66388cbc5eb26c), [`8a2d9204`](https://github.com/thirdweb-dev/js/commit/8a2d92046a416c99c6bfecf63a6fdb6cc02ea175), [`990c665d`](https://github.com/thirdweb-dev/js/commit/990c665de9e5c1070dc80fe0f1b434e251f70a94), [`3d62278a`](https://github.com/thirdweb-dev/js/commit/3d62278aba79101ae1158fb726d6ddfed505c939), [`c6f44722`](https://github.com/thirdweb-dev/js/commit/c6f44722f9d123db4e7c4c799fe8e0374a02107c), [`45ae105e`](https://github.com/thirdweb-dev/js/commit/45ae105ed3e48bfbf6be84aa12ecb0fb55a917b7), [`f41f1a29`](https://github.com/thirdweb-dev/js/commit/f41f1a2958a2cedcf0496c9a3ca284d0b98f1b89), [`bb7ca20e`](https://github.com/thirdweb-dev/js/commit/bb7ca20e49c5c374b12a4ed746a2ac3db488abd9), [`23d61cfe`](https://github.com/thirdweb-dev/js/commit/23d61cfeff2e5a885c511416d7491e7933ed404a), [`8941b226`](https://github.com/thirdweb-dev/js/commit/8941b22682d1b15a6e0d311b1e8548b95d6cfadf), [`e0ce4a37`](https://github.com/thirdweb-dev/js/commit/e0ce4a37596a91a072f8551e323fce6723113dcb)]:
  - @thirdweb-dev/sdk@3.10.23
  - @thirdweb-dev/react-core@3.14.1
  - @thirdweb-dev/wallets@0.3.1
  - @thirdweb-dev/chains@0.1.22

## 0.2.19

### Patch Changes

- [#1182](https://github.com/thirdweb-dev/js/pull/1182) [`a0eee749`](https://github.com/thirdweb-dev/js/commit/a0eee749a27a8b288b20533d8bd60423f81da463) Thanks [@iketw](https://github.com/iketw)! - [RN] Added the option to import a new wallet in guest mode

- Updated dependencies [[`cc20f93e`](https://github.com/thirdweb-dev/js/commit/cc20f93e178d86ee2b3f39102bbb0811de211f05), [`08403dd9`](https://github.com/thirdweb-dev/js/commit/08403dd9da7284054173aaba6ef06ac39f560c08), [`654b8ab3`](https://github.com/thirdweb-dev/js/commit/654b8ab35184e02127a5a47f05d78606dd5b29ca), [`a430160e`](https://github.com/thirdweb-dev/js/commit/a430160e6b4771c03d97f6ede91f1aeaa043e50e), [`12b07aad`](https://github.com/thirdweb-dev/js/commit/12b07aad9ae3176daf9d05864247d4806a16c9d2), [`d60e544a`](https://github.com/thirdweb-dev/js/commit/d60e544a240b93312743e62096ee2dc77d0c1bd1), [`7d2a446e`](https://github.com/thirdweb-dev/js/commit/7d2a446ecef9c6c14959d31e9a66537783b9adac), [`088f2567`](https://github.com/thirdweb-dev/js/commit/088f2567f615360edd44776b20ae0bedff250f43), [`8e28b0f5`](https://github.com/thirdweb-dev/js/commit/8e28b0f5e75596d29273ed80269bcee6d209adb4), [`01293857`](https://github.com/thirdweb-dev/js/commit/01293857fac8531bd94764203cd24b3daa4db51f), [`329bccec`](https://github.com/thirdweb-dev/js/commit/329bccec4b88b02db5bac6c1415158928843376a), [`20bbad1a`](https://github.com/thirdweb-dev/js/commit/20bbad1abcb1ec573318d326b09278492a488abd), [`36f3191f`](https://github.com/thirdweb-dev/js/commit/36f3191f3e8819c878685de8caa393b71be8e65c)]:
  - @thirdweb-dev/chains@0.1.21
  - @thirdweb-dev/react-core@3.14.0
  - @thirdweb-dev/wallets@0.3.0
  - @thirdweb-dev/sdk@3.10.22

## 0.2.18

### Patch Changes

- [#1137](https://github.com/thirdweb-dev/js/pull/1137) [`dec4c4a8`](https://github.com/thirdweb-dev/js/commit/dec4c4a8cfd3f3b257e537fa84ed038e781e6311) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Export WCV1 and WCV2 abstract classes to facilitate creation of wallet connect based wallets

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

- [#1151](https://github.com/thirdweb-dev/js/pull/1151) [`2a0294d8`](https://github.com/thirdweb-dev/js/commit/2a0294d8e67bbc08dcf59c79174a7626deb0e90a) Thanks [@MananTank](https://github.com/MananTank)! - Fix wrong balance in ConnectWallet

- [#1135](https://github.com/thirdweb-dev/js/pull/1135) [`15ef4779`](https://github.com/thirdweb-dev/js/commit/15ef4779e0a95cbae3053bdecfd4d54e4c30b07b) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Exports base UI components (react-native/components/base). They can now be used in your application.

- [#1144](https://github.com/thirdweb-dev/js/pull/1144) [`9ce3eb6a`](https://github.com/thirdweb-dev/js/commit/9ce3eb6aad957aff38fb4a25383ed17ff58e988f) Thanks [@MananTank](https://github.com/MananTank)! - Remove WalletConfig.config object from wallets

- Updated dependencies [[`2a443365`](https://github.com/thirdweb-dev/js/commit/2a443365bdc3d47d0f41fc895f70256dcde423f5), [`3bf7f375`](https://github.com/thirdweb-dev/js/commit/3bf7f375933cbd7dd8c682a66e8c67bbcb268bf7), [`6a194262`](https://github.com/thirdweb-dev/js/commit/6a19426200297b8da158c7d860d31efcc8c15822), [`16232de9`](https://github.com/thirdweb-dev/js/commit/16232de9eab9966e24e335929b2a3919346af265), [`54cfd6d8`](https://github.com/thirdweb-dev/js/commit/54cfd6d8916c42d87b6aa438e607ce525766b686), [`8687d6ac`](https://github.com/thirdweb-dev/js/commit/8687d6ac3a363eae63eeb1959a953cbcd282d353), [`645b0303`](https://github.com/thirdweb-dev/js/commit/645b0303cc1a9cbb0a0e9cbd67d11c3b865e4584), [`522453fd`](https://github.com/thirdweb-dev/js/commit/522453fd568b8c350141a96f9f1c6d5a3ef74493), [`9a015a23`](https://github.com/thirdweb-dev/js/commit/9a015a23cde09c8ba6c36593a84303ffe409a79a), [`6803c3e9`](https://github.com/thirdweb-dev/js/commit/6803c3e97ca74eed19cd90095afde25b02150d51), [`0cba69ca`](https://github.com/thirdweb-dev/js/commit/0cba69ca40a8cf6f106344247d0082212cd169da), [`56f85e57`](https://github.com/thirdweb-dev/js/commit/56f85e57df84bfa93e3230639c95d12466f8aec7), [`197a6838`](https://github.com/thirdweb-dev/js/commit/197a6838f69ae8b9ad46524e7c469fc757d0a2cb), [`6a91b6a0`](https://github.com/thirdweb-dev/js/commit/6a91b6a0253bab5914d4ebdad951dd1c5d141fbc), [`e32faeb5`](https://github.com/thirdweb-dev/js/commit/e32faeb57a5c2193c40cb6129fab92b84069b12d), [`a5f16b6d`](https://github.com/thirdweb-dev/js/commit/a5f16b6dc50b37920a6e5210b60aa6a1682ceb63), [`b6728603`](https://github.com/thirdweb-dev/js/commit/b6728603972ccd6c95108b25e8562807f0f95e19), [`ed47fd53`](https://github.com/thirdweb-dev/js/commit/ed47fd5310d11323080d984bca18a96fdef3a977), [`9ce3eb6a`](https://github.com/thirdweb-dev/js/commit/9ce3eb6aad957aff38fb4a25383ed17ff58e988f)]:
  - @thirdweb-dev/wallets@0.2.26
  - @thirdweb-dev/sdk@3.10.21
  - @thirdweb-dev/react-core@3.13.1
  - @thirdweb-dev/chains@0.1.20

## 0.2.17

### Patch Changes

- Updated dependencies [[`ce36322b`](https://github.com/thirdweb-dev/js/commit/ce36322b383af73905894b73f9409a146359ffb0), [`c60658ed`](https://github.com/thirdweb-dev/js/commit/c60658ed8c94867cca831b0d5535006da5b40aa6), [`aa9e952c`](https://github.com/thirdweb-dev/js/commit/aa9e952cb519a47ed112d2905b1f3787863035b6), [`564eaccf`](https://github.com/thirdweb-dev/js/commit/564eaccf480a81f36db43c782392595a5021e5ac), [`6aee0413`](https://github.com/thirdweb-dev/js/commit/6aee0413439b9ca408879bbb3c38c538c89d01af), [`21627c03`](https://github.com/thirdweb-dev/js/commit/21627c03d1bb1658fee19b12d580faa6c7f048d9), [`2283e71a`](https://github.com/thirdweb-dev/js/commit/2283e71acaaf3d15eb2d6121682f1d2a81eec4f3), [`e93aa70e`](https://github.com/thirdweb-dev/js/commit/e93aa70ef0093a2526404e11b7ddae8fb98c213b), [`51bbd3d1`](https://github.com/thirdweb-dev/js/commit/51bbd3d1bccbb92a1405ea50f6c178c091a90f20), [`9b20fc9a`](https://github.com/thirdweb-dev/js/commit/9b20fc9ad2d303edc31f44fbd2ea3b4dcf35d11e)]:
  - @thirdweb-dev/sdk@3.10.20
  - @thirdweb-dev/react-core@3.13.0
  - @thirdweb-dev/wallets@0.2.25

## 0.2.16

### Patch Changes

- [#1103](https://github.com/thirdweb-dev/js/pull/1103) [`89102b0c`](https://github.com/thirdweb-dev/js/commit/89102b0c895011bb6528d2b9bc4289173b351c8d) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Fix bug where the wc uri is not being copied in the textinput after scanning it

- Updated dependencies [[`23d90b3e`](https://github.com/thirdweb-dev/js/commit/23d90b3e779a5bfdb7058b8c51349d9c278fcbce), [`cc56037e`](https://github.com/thirdweb-dev/js/commit/cc56037e64560b9e0fc16eb0ac7cc2e47e2c9fdf), [`67450789`](https://github.com/thirdweb-dev/js/commit/67450789473b6008b86453ee4f4c7b99461223a6)]:
  - @thirdweb-dev/sdk@3.10.19
  - @thirdweb-dev/storage@1.1.4
  - @thirdweb-dev/react-core@3.12.4
  - @thirdweb-dev/wallets@0.2.24

## 0.2.15

### Patch Changes

- [#1059](https://github.com/thirdweb-dev/js/pull/1059) [`56ad0867`](https://github.com/thirdweb-dev/js/commit/56ad0867bd28da2c8ddaaca5ed5a26599c4e0ed6) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Use walletConfig's selectUI to render the wallet item in the Choose your Wallet dialog

- [#1010](https://github.com/thirdweb-dev/js/pull/1010) [`bba9767a`](https://github.com/thirdweb-dev/js/commit/bba9767adfe20e41055450b86e4448fcb2119855) Thanks [@iketw](https://github.com/iketw)! - [ReactNative-Wallets] Enables SmartWallet to connect to an app, with implementation in React Native

  - Wallets package

  1. Smart Wallet now supports connecting an external app to it. It acts as an actual wallet implementing the WC protocol
  2. There are two WalletConnect handlers to manage V1 and V2 WC connections
  3. Creates a synchronous storage interface used in WCV1
  4. To have your connector support WC, you need to implement the interface: IWalletConnectReceiver.
  5. You can now pass the flag enableConnectApp to the smart wallet config to enable a new field in our modal to connect an app to your smart wallet

  ```
  smartWallet({
      factoryAddress: "..."
      thirdwebApiKey: "apiKey"
      gasless: true,
      personalWallets: [localWallet()],
      enableConnectApp: true,
  }),
  ```

  - React Native

  1. Creates new modals for WC SessionRequests and SessionApprovals
  2. Implements SyncStorage using MMKV

- [#1068](https://github.com/thirdweb-dev/js/pull/1068) [`fd7111d5`](https://github.com/thirdweb-dev/js/commit/fd7111d5449b8315d326c308a021eed335446e19) Thanks [@MananTank](https://github.com/MananTank)! - add `theme` in `WalletConfig.selectUI` to allow creating selection UI that follows the theme of the wallet Modal

- [#1065](https://github.com/thirdweb-dev/js/pull/1065) [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Add support for signing in with email/phone using magic sdk

  Devs can now add a new supportedWallet:

  ```javascript
  import { Goerli } from '@thirdweb-dev/chains';
  import { ThirdwebProvider, magicWallet } from '@thirdweb-dev/react-native';

  <ThirdwebProvider
      activeChain={Goerli}
      supportedWallets={[
      magicWallet({
          apiKey: 'magic_api_key',
      }),
  ]}>
  ```

- [#1088](https://github.com/thirdweb-dev/js/pull/1088) [`4f99ccb4`](https://github.com/thirdweb-dev/js/commit/4f99ccb49c584946de709fbc01017611d2828b76) Thanks [@iketw](https://github.com/iketw)! - [RN/Wallets] Adds send_transaction support for wcv1 Connect to App feature

- [#1052](https://github.com/thirdweb-dev/js/pull/1052) [`77123a9a`](https://github.com/thirdweb-dev/js/commit/77123a9a5a29d8a1d7c6bf4be40f463e721a0412) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adds support for WC QRCode scanning

  Breaking change:

  - Users will need to add the dependency `react-native-camera` to be able to use this version of the SDK.

- Updated dependencies [[`2f1df0b5`](https://github.com/thirdweb-dev/js/commit/2f1df0b5354a8ee55089b2c1e61c058788d890f1), [`189daf02`](https://github.com/thirdweb-dev/js/commit/189daf0280a90ed730200088948526a594da3408), [`afae0873`](https://github.com/thirdweb-dev/js/commit/afae0873b0e3f9741f5a9c44c5d255f38c6a9111), [`bba9767a`](https://github.com/thirdweb-dev/js/commit/bba9767adfe20e41055450b86e4448fcb2119855), [`c6e74ef0`](https://github.com/thirdweb-dev/js/commit/c6e74ef0b00210f52e6778c548061376d3ba7001), [`fd7111d5`](https://github.com/thirdweb-dev/js/commit/fd7111d5449b8315d326c308a021eed335446e19), [`ee4c7de2`](https://github.com/thirdweb-dev/js/commit/ee4c7de25cb63f99f33b90da8e26293bbfbe6f3e), [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a), [`68fa1896`](https://github.com/thirdweb-dev/js/commit/68fa1896f75d3514e00cc380924fd8bc623064f0), [`e21bdd03`](https://github.com/thirdweb-dev/js/commit/e21bdd0328d9c52d58295aa4012fc11cde83b60a), [`f7b352a5`](https://github.com/thirdweb-dev/js/commit/f7b352a585a23726eaa3be116f65db56b005f4d8), [`4a1d7581`](https://github.com/thirdweb-dev/js/commit/4a1d75811058d6974616bdc12a6040cea5444e40), [`bdabbef7`](https://github.com/thirdweb-dev/js/commit/bdabbef71a2421a2dceb384f93bb6a59a3ddf007), [`59206233`](https://github.com/thirdweb-dev/js/commit/59206233e15ccfe3dc32047060055219d35938f2), [`292a321a`](https://github.com/thirdweb-dev/js/commit/292a321a95ed2d847097eed205353dd69eeb8d54), [`98efd090`](https://github.com/thirdweb-dev/js/commit/98efd090f63cfd9dfed7b89b20b6e43db88cf75c), [`8eecf4c2`](https://github.com/thirdweb-dev/js/commit/8eecf4c2d5b0d6447ad5b9cdbf0269818bbb3498), [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a), [`f3b2ae3f`](https://github.com/thirdweb-dev/js/commit/f3b2ae3f6d9c66356c521d3b9c2a6c096dbb4b57), [`d5651006`](https://github.com/thirdweb-dev/js/commit/d565100614d7d4e256554f998b8ce978a566051c), [`4f99ccb4`](https://github.com/thirdweb-dev/js/commit/4f99ccb49c584946de709fbc01017611d2828b76), [`da576108`](https://github.com/thirdweb-dev/js/commit/da5761080288c3b325f54fb56c80f96405a1cb5d), [`c85810ee`](https://github.com/thirdweb-dev/js/commit/c85810eee318b10eee4ada61828adaa51f94ea6c), [`6fd10f94`](https://github.com/thirdweb-dev/js/commit/6fd10f94b469dc5659e2ff4ce92a5aff86f3c89d), [`5f1e6abb`](https://github.com/thirdweb-dev/js/commit/5f1e6abb391f5c58dbdb207f569b3dd0b5d4729c), [`a034b032`](https://github.com/thirdweb-dev/js/commit/a034b0321fd0113ed51d95d538b5c3020615c227), [`35984362`](https://github.com/thirdweb-dev/js/commit/35984362b0a60e5b9c3d3c9731450a8f47deb1c4)]:
  - @thirdweb-dev/sdk@3.10.18
  - @thirdweb-dev/wallets@0.2.23
  - @thirdweb-dev/react-core@3.12.3
  - @thirdweb-dev/chains@0.1.19

## 0.2.14

### Patch Changes

- Updated dependencies [[`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c), [`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c)]:
  - @thirdweb-dev/wallets@0.2.22
  - @thirdweb-dev/chains@0.1.18
  - @thirdweb-dev/react-core@3.12.2
  - @thirdweb-dev/sdk@3.10.17

## 0.2.13

### Patch Changes

- [#1025](https://github.com/thirdweb-dev/js/pull/1025) [`99ffa8ce`](https://github.com/thirdweb-dev/js/commit/99ffa8ce3b47948f0b6aa3809e734d449a8377bb) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Single global modal. No API changes

  Added the capability of using our theme outside the SDK.
  ThirdwebProvider's children component are now wrapped in a ThemeProvider.

- Updated dependencies [[`b6f48e10`](https://github.com/thirdweb-dev/js/commit/b6f48e1088b5d36a51103de4afda53179029faaf), [`d5123044`](https://github.com/thirdweb-dev/js/commit/d51230441a097734be092c42b45dea07629e65fa), [`3c8c5d56`](https://github.com/thirdweb-dev/js/commit/3c8c5d56f2a21c0918fede71061c6745f2956f83), [`907d97be`](https://github.com/thirdweb-dev/js/commit/907d97bedef7331148bdfe8b9bf1e19459282e4c)]:
  - @thirdweb-dev/wallets@0.2.21
  - @thirdweb-dev/react-core@3.12.1
  - @thirdweb-dev/storage@1.1.3
  - @thirdweb-dev/chains@0.1.17
  - @thirdweb-dev/sdk@3.10.16

## 0.2.12

### Patch Changes

- [#995](https://github.com/thirdweb-dev/js/pull/995) [`482f6d1b`](https://github.com/thirdweb-dev/js/commit/482f6d1b58ac99b331fc750d3eeb6082556fd526) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] update export local wallet modal UI

- [#996](https://github.com/thirdweb-dev/js/pull/996) [`c3645c45`](https://github.com/thirdweb-dev/js/commit/c3645c451b5e9a0fcf651fa07eb0e31ebf1882ca) Thanks [@MananTank](https://github.com/MananTank)! - - add `theme` in `ConfiguredWallet.connectUI`'s props - to use theme aware UI for wallets

  - add `useWalletConfig` hook to get the `ConfiguredWallet` object for active wallet
  - add hooks `useSetConnectedWallet`, `useSetConnectionStatus`
  - rename `useActiveChain` to `useChain` - keep the `useActiveChain` also with deprecated tag
  - make `useSafe` hook await-able by returning the promise of connect() call
  - add hook `useSmartWallet`
  - allow rendering custom wallet details button via `<ConnectWallet detailsButton={} />` prop
  - Rename "Export" to "Backup" in local wallet UI

- [#1011](https://github.com/thirdweb-dev/js/pull/1011) [`470e0a14`](https://github.com/thirdweb-dev/js/commit/470e0a144db6aa03e7789e231bbdfae43144f0e0) Thanks [@MananTank](https://github.com/MananTank)! - rename ConfiguredWallet to WalletConfig

  ```diff
  - import { ConfiguredWallet } from '@thirdweb-dev/react';
  + import { WalletConfig } from '@thirdweb-dev/react';
  ```

- [#1019](https://github.com/thirdweb-dev/js/pull/1019) [`8a0dd070`](https://github.com/thirdweb-dev/js/commit/8a0dd070d4f4cb4d30b313e72827abf6f91f3f17) Thanks [@iketw](https://github.com/iketw)! - ## [ReactNative] Adds modalTitle, buttonTitle and detailsButton props to the ConnectWallet component

  You can now customize the following props:

  1. `buttonTitle`

  The title of the ConnectWallet button which defaults to: "Connect Wallet":

  ```javascript
  <ConnectWallet buttonTitle="Connect to claim" />
  ```

  2. `modalTitle`

  The title of the ConnectWallet modal which defaults to: "Choose your wallet":

  ```javascript
  <ConnectWallet modalTitle="Select a wallet" />
  ```

  3. `detailsButton`

  The button that shows the details of the connected wallet. By default it shows
  the chain icon, wallet balance, account address and wallet icon:

  ```javascript
  const customDetailsButton = (
    <View>
      <Text>Connected button details</Text>
      <Text>{shortenWalletAddress(address)}</Text>
    </View>
  );

  <ConnectWallet detailsButton={customDetailsButton} />;
  ```

  ### Web3Button

  The `buttonTitle` and `modalTitle` props are also available in the `Web3Button` config since we show a `ConnectWallet` button
  if you don't have a connected wallet:

  ```javascript
  <Web3Button
    connectWalletProps={{
      buttonTitle: "Connect to claim",
      modalTitle: "Pick a wallet",
    }}
    contractAddress="contract-address"
    action={(contract) => contract?.erc1155.claim(0, 1)}
  >
    Claim Factory
  </Web3Button>
  ```

- [#989](https://github.com/thirdweb-dev/js/pull/989) [`8db78299`](https://github.com/thirdweb-dev/js/commit/8db78299ea6cfb51d93b91bb1a351644a83c73d2) Thanks [@iketw](https://github.com/iketw)! - [React/ReactNative] Updated useThirdwebWallet to useWalletContext

- Updated dependencies [[`e9b69300`](https://github.com/thirdweb-dev/js/commit/e9b69300d15b233609f1ed897256ec9a1eef3e28), [`39bd9630`](https://github.com/thirdweb-dev/js/commit/39bd963015ac00a1e4da2d0b4c9d85b334c7ad46), [`49ec2d17`](https://github.com/thirdweb-dev/js/commit/49ec2d171ecb1c9240398b7b486a452eb9429979), [`799d98e8`](https://github.com/thirdweb-dev/js/commit/799d98e86258677ab72931fa8397aee653fe8b34), [`c3645c45`](https://github.com/thirdweb-dev/js/commit/c3645c451b5e9a0fcf651fa07eb0e31ebf1882ca), [`470e0a14`](https://github.com/thirdweb-dev/js/commit/470e0a144db6aa03e7789e231bbdfae43144f0e0), [`b1ede491`](https://github.com/thirdweb-dev/js/commit/b1ede491fbfbeca0ff3d6f5a6162546671bf8b99), [`738c0ec6`](https://github.com/thirdweb-dev/js/commit/738c0ec6c4190aa2252233c1382aed5d982cc7b8), [`d495a4b8`](https://github.com/thirdweb-dev/js/commit/d495a4b8a6e0599e5b4611620f3fded80a411173), [`482f6d1b`](https://github.com/thirdweb-dev/js/commit/482f6d1b58ac99b331fc750d3eeb6082556fd526), [`e4356e76`](https://github.com/thirdweb-dev/js/commit/e4356e76d1506624afe2eb6feeaf57dc376f372f), [`9886c858`](https://github.com/thirdweb-dev/js/commit/9886c858d9c8d0f677aba6572dbf5cc6c876edf2), [`8db78299`](https://github.com/thirdweb-dev/js/commit/8db78299ea6cfb51d93b91bb1a351644a83c73d2), [`4f843833`](https://github.com/thirdweb-dev/js/commit/4f8438335e3e3731b67ae271cb34c383832242a0)]:
  - @thirdweb-dev/sdk@3.10.15
  - @thirdweb-dev/react-core@3.12.0
  - @thirdweb-dev/chains@0.1.16
  - @thirdweb-dev/wallets@0.2.20

## 0.2.11

### Patch Changes

- Updated dependencies [[`32908b76`](https://github.com/thirdweb-dev/js/commit/32908b76832c60e91a0a6e40dbdb1c8f56e9e5be), [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff), [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff)]:
  - @thirdweb-dev/sdk@3.10.14
  - @thirdweb-dev/wallets@0.2.19
  - @thirdweb-dev/chains@0.1.15
  - @thirdweb-dev/react-core@3.11.11

## 0.2.10

### Patch Changes

- [#981](https://github.com/thirdweb-dev/js/pull/981) [`ea0f9479`](https://github.com/thirdweb-dev/js/commit/ea0f9479a38d442201e367fce1234c130228fde6) Thanks [@iketw](https://github.com/iketw)! - ## [ReactNative] Allow custom wallets be added to the ConnectWallet button modal

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

- [#969](https://github.com/thirdweb-dev/js/pull/969) [`12ad7fea`](https://github.com/thirdweb-dev/js/commit/12ad7fead2059005684c0762cbe951d23b509151) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Remove gap prop for backward compat

- [#966](https://github.com/thirdweb-dev/js/pull/966) [`87021cee`](https://github.com/thirdweb-dev/js/commit/87021cee45e81a6504e4e2279e6d2abb10cab8ec) Thanks [@MananTank](https://github.com/MananTank)! - Connect Wallet UI improvements

  - Allow from EOA => smart wallet / safe
  - Add warning to backup wallet for guest wallet
  - Show "Guest" instead of address for guest wallet

- [#977](https://github.com/thirdweb-dev/js/pull/977) [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf) Thanks [@MananTank](https://github.com/MananTank)! - Fix Connect Wallet Open/Close issues

- [#968](https://github.com/thirdweb-dev/js/pull/968) [`9640e073`](https://github.com/thirdweb-dev/js/commit/9640e0731f812ab9beaaa0cc67b1c5b61725c460) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Add guest mode warnings

- Updated dependencies [[`93bdec06`](https://github.com/thirdweb-dev/js/commit/93bdec061dc05ab133e79f5f739dcae9b5393f53), [`ea0f9479`](https://github.com/thirdweb-dev/js/commit/ea0f9479a38d442201e367fce1234c130228fde6), [`05ebbc15`](https://github.com/thirdweb-dev/js/commit/05ebbc15a012855735fba2aa93887b88e14295d1), [`5305b42d`](https://github.com/thirdweb-dev/js/commit/5305b42db554b69f903b3d95f3ba0eeddabd6114), [`4ca557ae`](https://github.com/thirdweb-dev/js/commit/4ca557ae4ab225e39decc3b7a01a04c0d8e464c7), [`7d7685e3`](https://github.com/thirdweb-dev/js/commit/7d7685e3fab5780b3c1d26b8ef431b96f8486972), [`87021cee`](https://github.com/thirdweb-dev/js/commit/87021cee45e81a6504e4e2279e6d2abb10cab8ec), [`eb521d24`](https://github.com/thirdweb-dev/js/commit/eb521d240ae7102d44fe2c5223b0a18d867e09ad), [`af4b5356`](https://github.com/thirdweb-dev/js/commit/af4b5356372ffa084c8d0e747d8def46c2ff892c), [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf), [`a2df187b`](https://github.com/thirdweb-dev/js/commit/a2df187bc1867beb2e90853da70dac271f604f12), [`aa9b6acc`](https://github.com/thirdweb-dev/js/commit/aa9b6acc3f5a118c2b5fe9e46732e72c0fc69376)]:
  - @thirdweb-dev/wallets@0.2.18
  - @thirdweb-dev/react-core@3.11.10
  - @thirdweb-dev/chains@0.1.14
  - @thirdweb-dev/sdk@3.10.13

## 0.2.9

### Patch Changes

- [#935](https://github.com/thirdweb-dev/js/pull/935) [`45d2ffcf`](https://github.com/thirdweb-dev/js/commit/45d2ffcf8917ac42b9913844ad111b6a7cacff23) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Allow guest mode to be directly connected when no supported wallets are passed in

  When passing an empty `supportedWallets` array and setting `guestMode` to true:

  ```
  <ThirdwebProvider
        activeChain={activeChain}
        supportedChains={[activeChain]}
        guestMode={true}
        supportedWallets={[]}
  ```

  Pressing on the ConnectWallet button will automatically create a `LocalWallet` for you and connect the user without any further prompts

- [#937](https://github.com/thirdweb-dev/js/pull/937) [`7012513b`](https://github.com/thirdweb-dev/js/commit/7012513bc20f283b2cde46c0b938af33fe3a1a20) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adding Smart Wallet to React Native as an option in the ConnectWallet button

- [#787](https://github.com/thirdweb-dev/js/pull/787) [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adds Device Wallet

- [#955](https://github.com/thirdweb-dev/js/pull/955) [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392) Thanks [@MananTank](https://github.com/MananTank)! - Local wallet UI refactor and other fixes

- [#956](https://github.com/thirdweb-dev/js/pull/956) [`4a69f8c8`](https://github.com/thirdweb-dev/js/commit/4a69f8c85dec420615e9eda8d1ad5b5ef0b87713) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Allow switching between personal wallet and smart wallet

  - Updates SmartWallet and LocalWallet icons
  - Adds "Learn More" links to both new wallets

- [#936](https://github.com/thirdweb-dev/js/pull/936) [`4828c876`](https://github.com/thirdweb-dev/js/commit/4828c8769180f821b482d38a63870e7c8ae454e0) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Enable copying the address by pressing on it

- [#943](https://github.com/thirdweb-dev/js/pull/943) [`465d8e2c`](https://github.com/thirdweb-dev/js/commit/465d8e2c3d77984af9031d707bfafc3121d7bd15) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Enforce web3button action to return a promise to make sure onSuccess and onError are triggered correctly

- [#927](https://github.com/thirdweb-dev/js/pull/927) [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa) Thanks [@MananTank](https://github.com/MananTank)! - safe, deviceWallet and smartWallet autoconnect

- [#925](https://github.com/thirdweb-dev/js/pull/925) [`07194b06`](https://github.com/thirdweb-dev/js/commit/07194b06e542826334f404df3891c071966a4dfb) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Directly call connect when there's only one supported wallet defined in the provider

- Updated dependencies [[`7012513b`](https://github.com/thirdweb-dev/js/commit/7012513bc20f283b2cde46c0b938af33fe3a1a20), [`5d67b280`](https://github.com/thirdweb-dev/js/commit/5d67b2807f2504add4c202d2eb18897415662fb6), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`5a67d5d8`](https://github.com/thirdweb-dev/js/commit/5a67d5d89474eac9a638ffaddba139b62965deff), [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f), [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`bf6df267`](https://github.com/thirdweb-dev/js/commit/bf6df2671131d7ed38650e2bed806081b32dc244), [`e22e4a47`](https://github.com/thirdweb-dev/js/commit/e22e4a47d73e1bbc6e3f0ae7ed56717b44e5ffcd), [`1e4ac672`](https://github.com/thirdweb-dev/js/commit/1e4ac672720c2fb01046bec195877a074ffbda06), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a), [`4a69f8c8`](https://github.com/thirdweb-dev/js/commit/4a69f8c85dec420615e9eda8d1ad5b5ef0b87713), [`26cd91ff`](https://github.com/thirdweb-dev/js/commit/26cd91ffe18dad37133a18988f21185c13d64cfb), [`8f962bc1`](https://github.com/thirdweb-dev/js/commit/8f962bc15c35da52ed5bc4025bb4cd18b69079e3), [`28b5d1eb`](https://github.com/thirdweb-dev/js/commit/28b5d1eb6d0142d3ebefb8bd078c30949f77fe61), [`0186721b`](https://github.com/thirdweb-dev/js/commit/0186721bc455aa1f8454839a1a25fa4062b45102), [`0bf29745`](https://github.com/thirdweb-dev/js/commit/0bf29745b0e842763c271ad8773312f0836ea00f), [`f0279c22`](https://github.com/thirdweb-dev/js/commit/f0279c228829b86ff1f828219bcef4fe16901f67), [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa), [`7af99d9a`](https://github.com/thirdweb-dev/js/commit/7af99d9a6d54492a29a90288a25b30773a8a10a7), [`00d0d01e`](https://github.com/thirdweb-dev/js/commit/00d0d01e619ff5c60b9f31386f51a55b5e466efa), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a), [`8cfb4f38`](https://github.com/thirdweb-dev/js/commit/8cfb4f38ed89c26ad04f19d27c65c24cefa976b6)]:
  - @thirdweb-dev/react-core@3.11.9
  - @thirdweb-dev/wallets@0.2.17
  - @thirdweb-dev/chains@0.1.13
  - @thirdweb-dev/sdk@3.10.12
  - @thirdweb-dev/storage@1.1.2

## 0.2.8

### Patch Changes

- [#874](https://github.com/thirdweb-dev/js/pull/874) [`49922de9`](https://github.com/thirdweb-dev/js/commit/49922de9d9c1258e58a3a05e656b229db469b1dd) Thanks [@iketw](https://github.com/iketw)! - [RN] Adds Auth to React Native

  - Adds an optional `secureStorage` to authConfig
  - Adds `expo-secure-store` to store the JWT token securely in React Native, passing a default value
  - Stores the token in secure storage to be accessed by subsequent calls
  - Returns the token in `useLogin` to be used by the user

  How I tested:

  - Tested in Android/iOS/Web

  Usage:

  ```
  <ThirdwebProvider
        activeChain="ethereum"
        supportedWallets={[metamaskWallet(), rainbowWallet()]}
        authConfig={{
          domain: https://your-domain.com,
          authUrl: '/api/auth',
        }}>
        <AppInner />
      </ThirdwebProvider>
  ```

  ```
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  ...

  const token = await login();
  ```

- [#886](https://github.com/thirdweb-dev/js/pull/886) [`51e6b414`](https://github.com/thirdweb-dev/js/commit/51e6b4146e1ff1a902f7b940dddf6c72e39fc49c) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Fixes Coinbase wallet on iOS

  - Adds connect wallet hooks for the supported wallets:

  1. useMetaMaskWallet
  2. useCoinbaseWallet
  3. useRainbowWallet
  4. useTrustWallet

  Usage:

  ```
  const connect = useMetaMaskWallet();
  connect();
  ```

- [#916](https://github.com/thirdweb-dev/js/pull/916) [`0b1f5229`](https://github.com/thirdweb-dev/js/commit/0b1f52290619dca76bbec32c92403598d351c3a5) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Improve customization of buttons background and text colors

  You can now pass custom background and text colors without having to create the full theme object. Alternatively, you can complete customize the theme:

  ```ConnectWallet button
  import { ConnectWallet, darkTheme } from '@thirdweb-dev/react-native';

  <ConnectWallet theme={darkTheme({
     buttonBackgroundColor: '#new-color',
     buttonTextColor: '#another-color'
  })}
  />
  ```

  ```Web3Button
  import { Web3Button, lightTheme } from '@thirdweb-dev/react-native';

  <Web3Button theme={lightTheme({
     buttonBackgroundColor: '#new-color',
     buttonTextColor: '#another-color'
  })}
  />
  ```

  Customizing theme beyond the button:

  ```ConnectWallet button
  import { ConnectWallet, darkTheme } from '@thirdweb-dev/react-native';

  const darkThemeCustom = darkTheme();

  <ConnectWallet
      theme={{
      ...darkThemeCustom,
      colors: {
          ...darkThemeCustom.colors,
          backgroundHighlight: 'blue',
      },
      }}
  />
  ```

- Updated dependencies [[`abe88599`](https://github.com/thirdweb-dev/js/commit/abe88599b634699aa3b876fe344bfddc6c1a92d4), [`49922de9`](https://github.com/thirdweb-dev/js/commit/49922de9d9c1258e58a3a05e656b229db469b1dd), [`4acb2b55`](https://github.com/thirdweb-dev/js/commit/4acb2b5561118dde5c7372400d4d754b879aef2e), [`82bea3fa`](https://github.com/thirdweb-dev/js/commit/82bea3fa10294eb3c5c7327fb047e3d1b2c62ff9), [`ea04edf4`](https://github.com/thirdweb-dev/js/commit/ea04edf47867617ff74f0aca1471a40b8d9c9f7c), [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633), [`c9ee9b32`](https://github.com/thirdweb-dev/js/commit/c9ee9b32f0a275f7c03d50243f23a7332f148ae5), [`00f4355f`](https://github.com/thirdweb-dev/js/commit/00f4355f1aa8843bb534b173e4d8e0a19dd18b47), [`a6610f12`](https://github.com/thirdweb-dev/js/commit/a6610f1211e9359885b948bf69a66d834707ec07), [`06cc1df3`](https://github.com/thirdweb-dev/js/commit/06cc1df3b7906584c9e2e69fddc4a2d831c237f9), [`29146e00`](https://github.com/thirdweb-dev/js/commit/29146e009db655304f5753904ae7f8569c12f4ca), [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633), [`430a5f79`](https://github.com/thirdweb-dev/js/commit/430a5f793419173775a434e0b2a21f70223e3813), [`664d1cd0`](https://github.com/thirdweb-dev/js/commit/664d1cd0dd03f32337c2cf532f0ad860e5aa5ea8), [`bfdd8493`](https://github.com/thirdweb-dev/js/commit/bfdd84939d7cf9c6635b83c971bcc8967b52538c), [`c2fec930`](https://github.com/thirdweb-dev/js/commit/c2fec930520e2df89532ec0027ead4563c7708cf), [`477324ec`](https://github.com/thirdweb-dev/js/commit/477324ec85b800dcbc54b709430c77fb63b16537)]:
  - @thirdweb-dev/sdk@3.10.11
  - @thirdweb-dev/react-core@3.11.8
  - @thirdweb-dev/wallets@0.2.16
  - @thirdweb-dev/chains@0.1.12

## 0.2.7

### Patch Changes

- Updated dependencies [[`ac8fa0b3`](https://github.com/thirdweb-dev/js/commit/ac8fa0b34545a2bc0b489a0551d476a9f560e851), [`b616dca7`](https://github.com/thirdweb-dev/js/commit/b616dca7eb861cd1d2adba3f3d1fe9c3b50f259e), [`2545a440`](https://github.com/thirdweb-dev/js/commit/2545a440dc272690cacbc23023f7b0a68f390c6e), [`b75bcef5`](https://github.com/thirdweb-dev/js/commit/b75bcef55bfdedc260b5b62bb4aff10a7d5c47b6), [`229a4741`](https://github.com/thirdweb-dev/js/commit/229a47413e422952ad946b8c09af32cc1fcdc7f0), [`c9027fce`](https://github.com/thirdweb-dev/js/commit/c9027fced0fffbf757bf0080bc4a49f5464df647), [`0db0cc75`](https://github.com/thirdweb-dev/js/commit/0db0cc756436dba8f9df0cf8678b87c009acc283)]:
  - @thirdweb-dev/sdk@3.10.10
  - @thirdweb-dev/wallets@0.2.15
  - @thirdweb-dev/react-core@3.11.7

## 0.2.6

### Patch Changes

- Updated dependencies [[`b3d57949`](https://github.com/thirdweb-dev/js/commit/b3d57949bd047831fda7e600b4872200340903b5), [`602d8cbc`](https://github.com/thirdweb-dev/js/commit/602d8cbcfaa7c1e117c01f842f89508f7333fcfe)]:
  - @thirdweb-dev/sdk@3.10.9
  - @thirdweb-dev/react-core@3.11.6

## 0.2.5

### Patch Changes

- Updated dependencies [[`1547d76c`](https://github.com/thirdweb-dev/js/commit/1547d76cce52265076c347599014f578c1de6152), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d), [`b5648aee`](https://github.com/thirdweb-dev/js/commit/b5648aee83b299d07a8eed7773bd32bcceef9657), [`1b8f812f`](https://github.com/thirdweb-dev/js/commit/1b8f812fb8c910d91fb7535d6446a0b6fc6b2310), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d)]:
  - @thirdweb-dev/sdk@3.10.8
  - @thirdweb-dev/react-core@3.11.5
  - @thirdweb-dev/wallets@0.2.14
  - @thirdweb-dev/chains@0.1.11

## 0.2.4

### Patch Changes

- Updated dependencies [[`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc), [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48)]:
  - @thirdweb-dev/react-core@3.11.4
  - @thirdweb-dev/wallets@0.2.13
  - @thirdweb-dev/sdk@3.10.7

## 0.2.3

### Patch Changes

- Updated dependencies [[`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00), [`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00)]:
  - @thirdweb-dev/chains@0.1.10
  - @thirdweb-dev/react-core@3.11.3
  - @thirdweb-dev/sdk@3.10.7
  - @thirdweb-dev/wallets@0.2.12

## 0.2.2

### Patch Changes

- Updated dependencies [[`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910), [`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910), [`1f2df55b`](https://github.com/thirdweb-dev/js/commit/1f2df55b673fefb0106778dca7a13406cfbcfc90), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d)]:
  - @thirdweb-dev/react-core@3.11.2
  - @thirdweb-dev/sdk@3.10.6
  - @thirdweb-dev/chains@0.1.9
  - @thirdweb-dev/storage@1.1.2
  - @thirdweb-dev/wallets@0.2.11

## 0.2.1

### Patch Changes

- Updated dependencies [[`e2581f21`](https://github.com/thirdweb-dev/js/commit/e2581f211e4419105d6169d84a60a4d69759eda9), [`9b303829`](https://github.com/thirdweb-dev/js/commit/9b3038291d1c9f4eb243718a6070e3dac829a354)]:
  - @thirdweb-dev/react-core@3.11.1
  - @thirdweb-dev/chains@0.1.8
  - @thirdweb-dev/sdk@3.10.5
  - @thirdweb-dev/wallets@0.2.10

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

- [#584](https://github.com/thirdweb-dev/js/pull/584) [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db) Thanks [@MananTank](https://github.com/MananTank)! - [Wallets] New and updated wallets. [RN] UI Components and Wallets support.

### Patch Changes

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

- [#757](https://github.com/thirdweb-dev/js/pull/757) [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d) Thanks [@iketw](https://github.com/iketw)! - switch to `thirdwebcdn.com` for default IPFS gateway

- [#813](https://github.com/thirdweb-dev/js/pull/813) [`b97cf2e5`](https://github.com/thirdweb-dev/js/commit/b97cf2e588abe22cfe09125af6f946c9644be217) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Fix react-native-modal ios flicker

- [#825](https://github.com/thirdweb-dev/js/pull/825) [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb) Thanks [@iketw](https://github.com/iketw)! - [Core,React,RN,Wallets] Allow for wallets to be created without props where possible

  You can now create wallets without having to worry about it's params. We provide sensible defaults.

  ```
  const w = new WalletConnectV1();
    w.connect();

  const w1 = new WalletConnect();
  w1.connect();

  const cb = new CoinbaseWallet()
  w1.connect();

  const safe = new SafeWallet();

  const device = new DeviceBrowserWallet();
  ```

- [#771](https://github.com/thirdweb-dev/js/pull/771) [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36) Thanks [@iketw](https://github.com/iketw)! - [ReactNativeSDK] Use wallet metadata from the wallet class

- [#800](https://github.com/thirdweb-dev/js/pull/800) [`d6ae520a`](https://github.com/thirdweb-dev/js/commit/d6ae520aaf272bdd9d235858701ea67c2c1fd796) Thanks [@iketw](https://github.com/iketw)! - [ReactCore/RN] Fix useActiveChain hook

- [#735](https://github.com/thirdweb-dev/js/pull/735) [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3) Thanks [@jnsdls](https://github.com/jnsdls)! - <br />

  ### New Hooks

  <details>
  <summary>
  <code>useWatchTransactions()</code> - watch for transactions on the blockchain (real-time)
  </summary>
  <br />

  **Example:** Listen to all transactions on USD Coin (USDC) contract address.

  ```jsx
  import { useWatchTransactions } from "@thirdweb-dev/react";

  const MyComponent = () => {
    const transactions = useWatchTransactions({
      network: "ethereum",
      contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    });

    if (!transactions.length) {
      return <div>No transactions, yet.</div>;
    }

    return (
      <div>
        {transactions.map((transaction) => (
          <div key={transaction.hash}>
            <div>Hash: {transaction.hash}</div>
            <div>From: {transaction.from}</div>
            <div>To: {transaction.to}</div>
            <div>Value: {transaction.value}</div>
          </div>
        ))}
      </div>
    );
  };
  ```

  > **Note**
  >
  > This hook is available in `@thirdweb-dev/react`, `@thirdweb-dev/react-native` and `@thirdweb-dev/react-core` packages, the usage is the same. (The only difference is the import path.)

  </details>

- [#807](https://github.com/thirdweb-dev/js/pull/807) [`79768d4c`](https://github.com/thirdweb-dev/js/commit/79768d4cfa7b5dfd0f91e29f324d4eb5ef6ee725) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Updated code comments for supportedWallets

- Updated dependencies [[`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`6e9b9dba`](https://github.com/thirdweb-dev/js/commit/6e9b9dba1dfb9e828e6927f441e7223baa5bcc76), [`93eca1de`](https://github.com/thirdweb-dev/js/commit/93eca1de7d23d66a129418aee72a41e394cbec16), [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406), [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d), [`3ff8eecf`](https://github.com/thirdweb-dev/js/commit/3ff8eecf18b9606f6b4f2164745448b7f2031fb3), [`2ec28021`](https://github.com/thirdweb-dev/js/commit/2ec2802119a3c375a1adaed1263ae1eae1384865), [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb), [`805896c7`](https://github.com/thirdweb-dev/js/commit/805896c78d5ecbbe1866408fbb73d060f7404146), [`b56511e2`](https://github.com/thirdweb-dev/js/commit/b56511e22d5eb2adf306d5675f1e52ff97a64f3a), [`8ef5a6f2`](https://github.com/thirdweb-dev/js/commit/8ef5a6f21735e6ac235937f6c34495a74c9da364), [`4cbbad98`](https://github.com/thirdweb-dev/js/commit/4cbbad98b303d872c09efedbece179445c7adc9c), [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36), [`d6ae520a`](https://github.com/thirdweb-dev/js/commit/d6ae520aaf272bdd9d235858701ea67c2c1fd796), [`5f0493d0`](https://github.com/thirdweb-dev/js/commit/5f0493d0fb291b4072cc433412883d352588c397), [`71532e5a`](https://github.com/thirdweb-dev/js/commit/71532e5a9fb5b116ba342465ef82e795ca8cc011), [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682), [`de7b6196`](https://github.com/thirdweb-dev/js/commit/de7b6196766d709deeac148a24dd8dd38b3e924a), [`6b145d4b`](https://github.com/thirdweb-dev/js/commit/6b145d4b36d2706f8a2dcad4b8f680c41606a556), [`83e99dbf`](https://github.com/thirdweb-dev/js/commit/83e99dbf289c7b8b8991c58383f8bc2a63f5a702), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`52d37f01`](https://github.com/thirdweb-dev/js/commit/52d37f01873c649b36c7d77df6c525a666245132), [`485abd06`](https://github.com/thirdweb-dev/js/commit/485abd06aa972a4f43f71b98f9666f113b932fb3), [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a), [`682f1c67`](https://github.com/thirdweb-dev/js/commit/682f1c673f4b02acab3986031942dbd3d67a87fa), [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`d8c1c943`](https://github.com/thirdweb-dev/js/commit/d8c1c9433e8dc48a70a1c93a0c1467c12ad79701), [`08507611`](https://github.com/thirdweb-dev/js/commit/085076117b18a615aa2b1b8f086d434cab3a4e4e), [`e2ec70c4`](https://github.com/thirdweb-dev/js/commit/e2ec70c49264737fbd2afb1cacabded82262bc6c), [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3), [`6b31a9bc`](https://github.com/thirdweb-dev/js/commit/6b31a9bcd3898cf56ee3b774a44b7481738c8e60), [`04775954`](https://github.com/thirdweb-dev/js/commit/04775954a0af787313ed667cc5ef5d2212e1df36), [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a), [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`8463a176`](https://github.com/thirdweb-dev/js/commit/8463a1761ff4741b55a72e6994a29f7dd50b54e1), [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`6c0c6538`](https://github.com/thirdweb-dev/js/commit/6c0c65389fb5b990a6e780e7d3f7dbd403fe950d), [`208d97e6`](https://github.com/thirdweb-dev/js/commit/208d97e6a892942171c056768876b3e33399d275), [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8), [`49eceaa0`](https://github.com/thirdweb-dev/js/commit/49eceaa08e642a72bb6e21d7b68a1177ae37aec5), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3), [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922), [`9fa628f8`](https://github.com/thirdweb-dev/js/commit/9fa628f89492633e4f7ea2b7c542e1587ea17a86), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`abf609a4`](https://github.com/thirdweb-dev/js/commit/abf609a40114a509fe07a04bfb0793dc44c9e39d), [`9a4a542c`](https://github.com/thirdweb-dev/js/commit/9a4a542ce9650605d48745a40126ca6b52a16722), [`b2d0ffb0`](https://github.com/thirdweb-dev/js/commit/b2d0ffb049208de9f9212eae7059212aed74fec4), [`bd40bc2e`](https://github.com/thirdweb-dev/js/commit/bd40bc2ef1e90490400a5f03fdfd178578844244)]:
  - @thirdweb-dev/react-core@3.11.0
  - @thirdweb-dev/wallets@0.2.9
  - @thirdweb-dev/chains@0.1.7
  - @thirdweb-dev/sdk@3.10.4
  - @thirdweb-dev/storage@1.1.1

## 0.1.9

### Patch Changes

- Updated dependencies [[`713d3187`](https://github.com/thirdweb-dev/js/commit/713d3187be14643e891d6c04400308802e9e5d04)]:
  - @thirdweb-dev/sdk@3.10.3
  - @thirdweb-dev/react-core@3.10.3

## 0.1.8

### Patch Changes

- Updated dependencies [[`2682f582`](https://github.com/thirdweb-dev/js/commit/2682f5823e5c71947f5c6a71918a0285f253fd18), [`d5f18b40`](https://github.com/thirdweb-dev/js/commit/d5f18b403a6f3ced0e1929b5c032f63325708304), [`2efe5be3`](https://github.com/thirdweb-dev/js/commit/2efe5be3ad2df4e80c0048c8fd35018ecf2d8dd9), [`baeb7427`](https://github.com/thirdweb-dev/js/commit/baeb74274e878cfbc237ef2aa676faa257606300)]:
  - @thirdweb-dev/sdk@3.10.2
  - @thirdweb-dev/react-core@3.10.2

## 0.1.7

### Patch Changes

- Updated dependencies [[`68d52f99`](https://github.com/thirdweb-dev/js/commit/68d52f99b36c6744e45872d0bdebafbbf7d09b59), [`9efeba38`](https://github.com/thirdweb-dev/js/commit/9efeba38f06783b78e2c947ad878350173f4e07a)]:
  - @thirdweb-dev/sdk@3.10.1
  - @thirdweb-dev/react-core@3.10.1

## 0.1.6

### Patch Changes

- [#665](https://github.com/thirdweb-dev/js/pull/665) [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75) Thanks [@shift4id](https://github.com/shift4id)! - Fix spelling throughout all packages

- Updated dependencies [[`a7e908b5`](https://github.com/thirdweb-dev/js/commit/a7e908b5fe60803e64b418cf42e081ca75123a45), [`61ef6964`](https://github.com/thirdweb-dev/js/commit/61ef69649fb605f6079dd9bbef12b739b02dda30), [`2f4cd928`](https://github.com/thirdweb-dev/js/commit/2f4cd92848a6c8cec4e86654f376a6d15bdd2b52), [`6ae39277`](https://github.com/thirdweb-dev/js/commit/6ae39277a1d2ea507cedcde7ae62439758e4d6e0), [`8a8a37f6`](https://github.com/thirdweb-dev/js/commit/8a8a37f6d3468b2a9c9736834bc39a3eee4754f4), [`8f46a2ee`](https://github.com/thirdweb-dev/js/commit/8f46a2eef59d2b21b68e38338ed2b3a820421501), [`8d5b418e`](https://github.com/thirdweb-dev/js/commit/8d5b418e78fcf692f72aed5fe49358e40720d80c), [`63f552d7`](https://github.com/thirdweb-dev/js/commit/63f552d736a549532eb4d6a05cfe66a771b190b9), [`fb346ffd`](https://github.com/thirdweb-dev/js/commit/fb346ffd45edf9f50cc8c68a0c318eee39a6d9c6), [`e081075b`](https://github.com/thirdweb-dev/js/commit/e081075b2cebc7edad855481366bd9864ddba102), [`7832041c`](https://github.com/thirdweb-dev/js/commit/7832041c0fb25852489c73453c2b26e844d94582), [`d8dec9fc`](https://github.com/thirdweb-dev/js/commit/d8dec9fc19079c79729857c36e45102c90fb7e0a), [`478780f6`](https://github.com/thirdweb-dev/js/commit/478780f6349595c17a7b3cd7de7668973c201d65), [`b83ea525`](https://github.com/thirdweb-dev/js/commit/b83ea5251bcd07feaab02a7ad1be202ccc6147fd), [`541dfeea`](https://github.com/thirdweb-dev/js/commit/541dfeeabaa744880cf78b310a9d61db4dfb32b3), [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75), [`0c883044`](https://github.com/thirdweb-dev/js/commit/0c88304464ef4461a660a374198e893c578c8de0), [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6), [`2676fc01`](https://github.com/thirdweb-dev/js/commit/2676fc01f4d8eabc90e71fad1f14b4b29806d2bd), [`0666f37c`](https://github.com/thirdweb-dev/js/commit/0666f37c13ed4b824e238325f9d13b9af785e0b0), [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6), [`e33bd2a8`](https://github.com/thirdweb-dev/js/commit/e33bd2a856bbc2e2f6b0c90b46be5166281875ae), [`b80024c6`](https://github.com/thirdweb-dev/js/commit/b80024c6cca17541c9b5ebb51c1476e9f210d3ab), [`8845bf96`](https://github.com/thirdweb-dev/js/commit/8845bf960e18c89d0e1f2fe1c370f4e2f4e855d0), [`2335f000`](https://github.com/thirdweb-dev/js/commit/2335f000c9023dd47b1a341a4dd40ed674e9bcdb), [`696c384a`](https://github.com/thirdweb-dev/js/commit/696c384a348890202e37cbd8488b1b1eceb4e8c2), [`4355518a`](https://github.com/thirdweb-dev/js/commit/4355518afea68cd8026d3ab8a0144c15d66b9e24), [`3740a0bf`](https://github.com/thirdweb-dev/js/commit/3740a0bf5db1301dbd93a97ab4c9343429a4e12d), [`cc7ce8b1`](https://github.com/thirdweb-dev/js/commit/cc7ce8b1e8f73288b5c00a29e0000bea9867e8c1), [`91f5a2fd`](https://github.com/thirdweb-dev/js/commit/91f5a2fd5cb2f5aed6498defdb1feeabb283db6c), [`23cd88ec`](https://github.com/thirdweb-dev/js/commit/23cd88ec3a2af86eafeac258fdc8c5b4ce3196f2), [`87a101ad`](https://github.com/thirdweb-dev/js/commit/87a101ad56430e793c9f22b583fea204dfed0554), [`537785fe`](https://github.com/thirdweb-dev/js/commit/537785fed0021345b0d1cec37658e43c65931f9f), [`29c1cf7e`](https://github.com/thirdweb-dev/js/commit/29c1cf7eff60221d05e87060f3c96a83343218e6), [`b6b0855b`](https://github.com/thirdweb-dev/js/commit/b6b0855b81854ec3d5dd3c763a1ad2a235837cc9), [`2a8cc289`](https://github.com/thirdweb-dev/js/commit/2a8cc289ac42273800554a247cb9259a8f0329d7), [`1e1a3912`](https://github.com/thirdweb-dev/js/commit/1e1a39123bad2b96c332ebb58b25369b31dd9de7), [`dc08aa73`](https://github.com/thirdweb-dev/js/commit/dc08aa731f92ce3c2dd232378637a3075137367d), [`bd6be0ba`](https://github.com/thirdweb-dev/js/commit/bd6be0bae78511878c2344949bb212dab30ec30c)]:
  - @thirdweb-dev/sdk@3.10.0
  - @thirdweb-dev/react-core@3.10.0
  - @thirdweb-dev/storage@1.1.0
  - @thirdweb-dev/chains@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [[`d7deaa4`](https://github.com/thirdweb-dev/js/commit/d7deaa48f2f943deb8f2ad7459d17de930c00517), [`b7a5b45`](https://github.com/thirdweb-dev/js/commit/b7a5b454415596316f58a75f14472631242cc115)]:
  - @thirdweb-dev/chains@0.1.5
  - @thirdweb-dev/react-core@3.9.5
  - @thirdweb-dev/sdk@3.9.5

## 0.1.4

### Patch Changes

- Updated dependencies [[`a3472a1`](https://github.com/thirdweb-dev/js/commit/a3472a133175826d052ee986907de014e3cf3ad9), [`5712650`](https://github.com/thirdweb-dev/js/commit/5712650074e2415bbea4173a0bb68d727ff2db90), [`5712650`](https://github.com/thirdweb-dev/js/commit/5712650074e2415bbea4173a0bb68d727ff2db90)]:
  - @thirdweb-dev/chains@0.1.4
  - @thirdweb-dev/sdk@3.9.4
  - @thirdweb-dev/react-core@3.9.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`3d644fb`](https://github.com/thirdweb-dev/js/commit/3d644fb8cbae8bc3ee624505831b9f5c6996898a)]:
  - @thirdweb-dev/chains@0.1.3
  - @thirdweb-dev/react-core@3.9.3
  - @thirdweb-dev/sdk@3.9.3

## 0.1.2

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

- Updated dependencies [[`f3408d0`](https://github.com/thirdweb-dev/js/commit/f3408d05d84ff8418a3f76961367e47565ed32b4), [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19)]:
  - @thirdweb-dev/sdk@3.9.2
  - @thirdweb-dev/react-core@3.9.2
  - @thirdweb-dev/storage@1.0.10
  - @thirdweb-dev/chains@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e), [`300fe4a`](https://github.com/thirdweb-dev/js/commit/300fe4a933f83ac59f89ff019f173cdfc6a2cdff), [`f580b8a`](https://github.com/thirdweb-dev/js/commit/f580b8ac06534df24b0194cbc632b4a8fd447611)]:
  - @thirdweb-dev/react-core@3.9.1
  - @thirdweb-dev/storage@1.0.9
  - @thirdweb-dev/chains@0.1.1
  - @thirdweb-dev/sdk@3.9.1

## 0.1.0

### Minor Changes

- [#522](https://github.com/thirdweb-dev/js/pull/522) [`18ba6b3`](https://github.com/thirdweb-dev/js/commit/18ba6b381ee5c72e0fe599ab9b32f2ef66443d5f) Thanks [@iketw](https://github.com/iketw)! - [React Native SDK] init package
