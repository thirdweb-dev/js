# @thirdweb-dev/wallets

## 0.2.23

### Patch Changes

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

- [#1070](https://github.com/thirdweb-dev/js/pull/1070) [`68fa1896`](https://github.com/thirdweb-dev/js/commit/68fa1896f75d3514e00cc380924fd8bc623064f0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose smartWallet.deploy() and smartWallet.isDeployed()

- [#1085](https://github.com/thirdweb-dev/js/pull/1085) [`292a321a`](https://github.com/thirdweb-dev/js/commit/292a321a95ed2d847097eed205353dd69eeb8d54) Thanks [@MananTank](https://github.com/MananTank)! - Fix Metamask disconnection on switch chain

- [#1073](https://github.com/thirdweb-dev/js/pull/1073) [`f3b2ae3f`](https://github.com/thirdweb-dev/js/commit/f3b2ae3f6d9c66356c521d3b9c2a6c096dbb4b57) Thanks [@ciaranightingale](https://github.com/ciaranightingale)! - Update Smart Wallet "getAddress" with "data" arg

- [#1088](https://github.com/thirdweb-dev/js/pull/1088) [`4f99ccb4`](https://github.com/thirdweb-dev/js/commit/4f99ccb49c584946de709fbc01017611d2828b76) Thanks [@iketw](https://github.com/iketw)! - [RN/Wallets] Adds send_transaction support for wcv1 Connect to App feature

- [#1064](https://github.com/thirdweb-dev/js/pull/1064) [`c85810ee`](https://github.com/thirdweb-dev/js/commit/c85810eee318b10eee4ada61828adaa51f94ea6c) Thanks [@MananTank](https://github.com/MananTank)! - Do not cache signer in wallets

- [#1087](https://github.com/thirdweb-dev/js/pull/1087) [`35984362`](https://github.com/thirdweb-dev/js/commit/35984362b0a60e5b9c3d3c9731450a8f47deb1c4) Thanks [@adam-maj](https://github.com/adam-maj)! - Add proper on-chain signing for Safe

- Updated dependencies [[`2f1df0b5`](https://github.com/thirdweb-dev/js/commit/2f1df0b5354a8ee55089b2c1e61c058788d890f1), [`189daf02`](https://github.com/thirdweb-dev/js/commit/189daf0280a90ed730200088948526a594da3408), [`afae0873`](https://github.com/thirdweb-dev/js/commit/afae0873b0e3f9741f5a9c44c5d255f38c6a9111), [`c6e74ef0`](https://github.com/thirdweb-dev/js/commit/c6e74ef0b00210f52e6778c548061376d3ba7001), [`ee4c7de2`](https://github.com/thirdweb-dev/js/commit/ee4c7de25cb63f99f33b90da8e26293bbfbe6f3e), [`f7b352a5`](https://github.com/thirdweb-dev/js/commit/f7b352a585a23726eaa3be116f65db56b005f4d8), [`4a1d7581`](https://github.com/thirdweb-dev/js/commit/4a1d75811058d6974616bdc12a6040cea5444e40), [`bdabbef7`](https://github.com/thirdweb-dev/js/commit/bdabbef71a2421a2dceb384f93bb6a59a3ddf007), [`59206233`](https://github.com/thirdweb-dev/js/commit/59206233e15ccfe3dc32047060055219d35938f2), [`98efd090`](https://github.com/thirdweb-dev/js/commit/98efd090f63cfd9dfed7b89b20b6e43db88cf75c), [`8eecf4c2`](https://github.com/thirdweb-dev/js/commit/8eecf4c2d5b0d6447ad5b9cdbf0269818bbb3498), [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a), [`d5651006`](https://github.com/thirdweb-dev/js/commit/d565100614d7d4e256554f998b8ce978a566051c), [`da576108`](https://github.com/thirdweb-dev/js/commit/da5761080288c3b325f54fb56c80f96405a1cb5d), [`c85810ee`](https://github.com/thirdweb-dev/js/commit/c85810eee318b10eee4ada61828adaa51f94ea6c), [`6fd10f94`](https://github.com/thirdweb-dev/js/commit/6fd10f94b469dc5659e2ff4ce92a5aff86f3c89d), [`5f1e6abb`](https://github.com/thirdweb-dev/js/commit/5f1e6abb391f5c58dbdb207f569b3dd0b5d4729c), [`a034b032`](https://github.com/thirdweb-dev/js/commit/a034b0321fd0113ed51d95d538b5c3020615c227)]:
  - @thirdweb-dev/sdk@3.10.18
  - @thirdweb-dev/chains@0.1.19

## 0.2.22

### Patch Changes

- [#1040](https://github.com/thirdweb-dev/js/pull/1040) [`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Deploy SmartWallet before signing messages

- Updated dependencies [[`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c)]:
  - @thirdweb-dev/chains@0.1.18
  - @thirdweb-dev/sdk@3.10.17

## 0.2.21

### Patch Changes

- [#1034](https://github.com/thirdweb-dev/js/pull/1034) [`b6f48e10`](https://github.com/thirdweb-dev/js/commit/b6f48e1088b5d36a51103de4afda53179029faaf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose overrideable paymasterAPI in SmartWalletConfig

- Updated dependencies [[`3c8c5d56`](https://github.com/thirdweb-dev/js/commit/3c8c5d56f2a21c0918fede71061c6745f2956f83), [`907d97be`](https://github.com/thirdweb-dev/js/commit/907d97bedef7331148bdfe8b9bf1e19459282e4c)]:
  - @thirdweb-dev/chains@0.1.17
  - @thirdweb-dev/sdk@3.10.16

## 0.2.20

### Patch Changes

- [#1022](https://github.com/thirdweb-dev/js/pull/1022) [`738c0ec6`](https://github.com/thirdweb-dev/js/commit/738c0ec6c4190aa2252233c1382aed5d982cc7b8) Thanks [@mmeigooni](https://github.com/mmeigooni)! - Update Paper SDK version

- [#1002](https://github.com/thirdweb-dev/js/pull/1002) [`d495a4b8`](https://github.com/thirdweb-dev/js/commit/d495a4b8a6e0599e5b4611620f3fded80a411173) Thanks [@MananTank](https://github.com/MananTank)! - Expose Web3Modal QRModalOptions in WalletConnect V2

- [#998](https://github.com/thirdweb-dev/js/pull/998) [`4f843833`](https://github.com/thirdweb-dev/js/commit/4f8438335e3e3731b67ae271cb34c383832242a0) Thanks [@MananTank](https://github.com/MananTank)! - - skip wallet-selector screen if there's a single wallet
  - Fix "Can't close Safe screen" issue
  - Fix magicSdkConfiguration type
- Updated dependencies [[`e9b69300`](https://github.com/thirdweb-dev/js/commit/e9b69300d15b233609f1ed897256ec9a1eef3e28), [`49ec2d17`](https://github.com/thirdweb-dev/js/commit/49ec2d171ecb1c9240398b7b486a452eb9429979), [`799d98e8`](https://github.com/thirdweb-dev/js/commit/799d98e86258677ab72931fa8397aee653fe8b34), [`c3645c45`](https://github.com/thirdweb-dev/js/commit/c3645c451b5e9a0fcf651fa07eb0e31ebf1882ca), [`470e0a14`](https://github.com/thirdweb-dev/js/commit/470e0a144db6aa03e7789e231bbdfae43144f0e0), [`482f6d1b`](https://github.com/thirdweb-dev/js/commit/482f6d1b58ac99b331fc750d3eeb6082556fd526), [`e4356e76`](https://github.com/thirdweb-dev/js/commit/e4356e76d1506624afe2eb6feeaf57dc376f372f), [`9886c858`](https://github.com/thirdweb-dev/js/commit/9886c858d9c8d0f677aba6572dbf5cc6c876edf2), [`8db78299`](https://github.com/thirdweb-dev/js/commit/8db78299ea6cfb51d93b91bb1a351644a83c73d2)]:
  - @thirdweb-dev/sdk@3.10.15
  - @thirdweb-dev/chains@0.1.16

## 0.2.19

### Patch Changes

- [#990](https://github.com/thirdweb-dev/js/pull/990) [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix loadOrCreate for LocalWalletNode

- Updated dependencies [[`32908b76`](https://github.com/thirdweb-dev/js/commit/32908b76832c60e91a0a6e40dbdb1c8f56e9e5be), [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff)]:
  - @thirdweb-dev/sdk@3.10.14
  - @thirdweb-dev/chains@0.1.15

## 0.2.18

### Patch Changes

- [#973](https://github.com/thirdweb-dev/js/pull/973) [`93bdec06`](https://github.com/thirdweb-dev/js/commit/93bdec061dc05ab133e79f5f739dcae9b5393f53) Thanks [@MananTank](https://github.com/MananTank)! - - Fix PaperWallet.connect() error

  - Fix return type of Wallet.autoConnect()

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

- [#978](https://github.com/thirdweb-dev/js/pull/978) [`05ebbc15`](https://github.com/thirdweb-dev/js/commit/05ebbc15a012855735fba2aa93887b88e14295d1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Export ethers and private key wallets top level

- [#974](https://github.com/thirdweb-dev/js/pull/974) [`4ca557ae`](https://github.com/thirdweb-dev/js/commit/4ca557ae4ab225e39decc3b7a01a04c0d8e464c7) Thanks [@iketw](https://github.com/iketw)! - [Wallet] Rename Connector to WagmiConnector and TWConnector to Connector

- [#967](https://github.com/thirdweb-dev/js/pull/967) [`7d7685e3`](https://github.com/thirdweb-dev/js/commit/7d7685e3fab5780b3c1d26b8ef431b96f8486972) Thanks [@MananTank](https://github.com/MananTank)! - - Fix type of connect() for magic wallet

  - enforce smsLogin, emailLogin restriction for magic wallet
  - update the icon for local wallet

- [#977](https://github.com/thirdweb-dev/js/pull/977) [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf) Thanks [@MananTank](https://github.com/MananTank)! - Fix Connect Wallet Open/Close issues

- Updated dependencies [[`5305b42d`](https://github.com/thirdweb-dev/js/commit/5305b42db554b69f903b3d95f3ba0eeddabd6114), [`eb521d24`](https://github.com/thirdweb-dev/js/commit/eb521d240ae7102d44fe2c5223b0a18d867e09ad), [`af4b5356`](https://github.com/thirdweb-dev/js/commit/af4b5356372ffa084c8d0e747d8def46c2ff892c), [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf), [`a2df187b`](https://github.com/thirdweb-dev/js/commit/a2df187bc1867beb2e90853da70dac271f604f12), [`aa9b6acc`](https://github.com/thirdweb-dev/js/commit/aa9b6acc3f5a118c2b5fe9e46732e72c0fc69376)]:
  - @thirdweb-dev/chains@0.1.14
  - @thirdweb-dev/sdk@3.10.13

## 0.2.17

### Patch Changes

- [#937](https://github.com/thirdweb-dev/js/pull/937) [`7012513b`](https://github.com/thirdweb-dev/js/commit/7012513bc20f283b2cde46c0b938af33fe3a1a20) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adding Smart Wallet to React Native as an option in the ConnectWallet button

- [#941](https://github.com/thirdweb-dev/js/pull/941) [`5d67b280`](https://github.com/thirdweb-dev/js/commit/5d67b2807f2504add4c202d2eb18897415662fb6) Thanks [@MananTank](https://github.com/MananTank)! - Add Magic Link

- [#931](https://github.com/thirdweb-dev/js/pull/931) [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Default RPC for Local Wallet

- [#948](https://github.com/thirdweb-dev/js/pull/948) [`5a67d5d8`](https://github.com/thirdweb-dev/js/commit/5a67d5d89474eac9a638ffaddba139b62965deff) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Batch transactions for Smart Wallets

- [#787](https://github.com/thirdweb-dev/js/pull/787) [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adds Device Wallet

- [#955](https://github.com/thirdweb-dev/js/pull/955) [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392) Thanks [@MananTank](https://github.com/MananTank)! - Local wallet UI refactor and other fixes

- [#930](https://github.com/thirdweb-dev/js/pull/930) [`e22e4a47`](https://github.com/thirdweb-dev/js/commit/e22e4a47d73e1bbc6e3f0ae7ed56717b44e5ffcd) Thanks [@MananTank](https://github.com/MananTank)! - suggest first supportedWallet for getting started in ConnectWallet

- [#942](https://github.com/thirdweb-dev/js/pull/942) [`1e4ac672`](https://github.com/thirdweb-dev/js/commit/1e4ac672720c2fb01046bec195877a074ffbda06) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Simplify and generalize SmartWallet API

- [#947](https://github.com/thirdweb-dev/js/pull/947) [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose execute functions directly from SmartWallet

- [#956](https://github.com/thirdweb-dev/js/pull/956) [`4a69f8c8`](https://github.com/thirdweb-dev/js/commit/4a69f8c85dec420615e9eda8d1ad5b5ef0b87713) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Allow switching between personal wallet and smart wallet

  - Updates SmartWallet and LocalWallet icons
  - Adds "Learn More" links to both new wallets

- [#953](https://github.com/thirdweb-dev/js/pull/953) [`26cd91ff`](https://github.com/thirdweb-dev/js/commit/26cd91ffe18dad37133a18988f21185c13d64cfb) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Latest default factory for SmartWallet

- [#945](https://github.com/thirdweb-dev/js/pull/945) [`0186721b`](https://github.com/thirdweb-dev/js/commit/0186721bc455aa1f8454839a1a25fa4062b45102) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New utility functions for SmartWallet

- [#927](https://github.com/thirdweb-dev/js/pull/927) [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa) Thanks [@MananTank](https://github.com/MananTank)! - safe, deviceWallet and smartWallet autoconnect

- [#929](https://github.com/thirdweb-dev/js/pull/929) [`7af99d9a`](https://github.com/thirdweb-dev/js/commit/7af99d9a6d54492a29a90288a25b30773a8a10a7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Use entrypoint v0.6 for smart accounts

- [#904](https://github.com/thirdweb-dev/js/pull/904) [`8cfb4f38`](https://github.com/thirdweb-dev/js/commit/8cfb4f38ed89c26ad04f19d27c65c24cefa976b6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Introducing SmartWallet to easily connect to ERC4337 compatible account contracts

- Updated dependencies [[`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`bf6df267`](https://github.com/thirdweb-dev/js/commit/bf6df2671131d7ed38650e2bed806081b32dc244), [`8f962bc1`](https://github.com/thirdweb-dev/js/commit/8f962bc15c35da52ed5bc4025bb4cd18b69079e3), [`28b5d1eb`](https://github.com/thirdweb-dev/js/commit/28b5d1eb6d0142d3ebefb8bd078c30949f77fe61), [`0bf29745`](https://github.com/thirdweb-dev/js/commit/0bf29745b0e842763c271ad8773312f0836ea00f), [`f0279c22`](https://github.com/thirdweb-dev/js/commit/f0279c228829b86ff1f828219bcef4fe16901f67), [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa), [`00d0d01e`](https://github.com/thirdweb-dev/js/commit/00d0d01e619ff5c60b9f31386f51a55b5e466efa), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a)]:
  - @thirdweb-dev/chains@0.1.13
  - @thirdweb-dev/sdk@3.10.12

## 0.2.16

### Patch Changes

- [#892](https://github.com/thirdweb-dev/js/pull/892) [`4acb2b55`](https://github.com/thirdweb-dev/js/commit/4acb2b5561118dde5c7372400d4d754b879aef2e) Thanks [@MananTank](https://github.com/MananTank)! - Add Switch Account button for MetaMask

- [#901](https://github.com/thirdweb-dev/js/pull/901) [`82bea3fa`](https://github.com/thirdweb-dev/js/commit/82bea3fa10294eb3c5c7327fb047e3d1b2c62ff9) Thanks [@MananTank](https://github.com/MananTank)! - Device Wallet revamp

- [#908](https://github.com/thirdweb-dev/js/pull/908) [`664d1cd0`](https://github.com/thirdweb-dev/js/commit/664d1cd0dd03f32337c2cf532f0ad860e5aa5ea8) Thanks [@MananTank](https://github.com/MananTank)! - Fix dynamic import error of crypto-js in device wallet

- [#910](https://github.com/thirdweb-dev/js/pull/910) [`c2fec930`](https://github.com/thirdweb-dev/js/commit/c2fec930520e2df89532ec0027ead4563c7708cf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow passing any EVMWallet to SafeWallet as personal signer

- Updated dependencies [[`a6610f12`](https://github.com/thirdweb-dev/js/commit/a6610f1211e9359885b948bf69a66d834707ec07), [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633)]:
  - @thirdweb-dev/chains@0.1.12

## 0.2.15

### Patch Changes

- [#868](https://github.com/thirdweb-dev/js/pull/868) [`b616dca7`](https://github.com/thirdweb-dev/js/commit/b616dca7eb861cd1d2adba3f3d1fe9c3b50f259e) Thanks [@iketw](https://github.com/iketw)! - - Updates base wallet classes names

  - Makes InjectedWallet params optional
  - Removes connector storage constructor param from Injected and MetaMask wallets

- [#872](https://github.com/thirdweb-dev/js/pull/872) [`2545a440`](https://github.com/thirdweb-dev/js/commit/2545a440dc272690cacbc23023f7b0a68f390c6e) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Rename Wallet Connect to WalletConnect

- [#859](https://github.com/thirdweb-dev/js/pull/859) [`229a4741`](https://github.com/thirdweb-dev/js/commit/229a47413e422952ad946b8c09af32cc1fcdc7f0) Thanks [@MananTank](https://github.com/MananTank)! - Fix Error when connecting to Safe in Vite

## 0.2.14

### Patch Changes

- [#870](https://github.com/thirdweb-dev/js/pull/870) [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d) Thanks [@jnsdls](https://github.com/jnsdls)! - fix crash during SSR when "window" is undefined

- Updated dependencies [[`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d)]:
  - @thirdweb-dev/chains@0.1.11

## 0.2.13

### Patch Changes

- [#851](https://github.com/thirdweb-dev/js/pull/851) [`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc) Thanks [@MananTank](https://github.com/MananTank)! - Fix wallet autoconnect issues

  ### Fixes

  - infinite loading spinner on connect wallet button when wallet is locked or connection to app is closed
  - network switch popup on page load when wallet is connected to different network than it was previously connected
  - removed autoconnect timeout - don't need it anymore

- [#855](https://github.com/thirdweb-dev/js/pull/855) [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48) Thanks [@MananTank](https://github.com/MananTank)! - Add auth in Connect Wallet button

## 0.2.12

### Patch Changes

- Updated dependencies [[`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00)]:
  - @thirdweb-dev/chains@0.1.10

## 0.2.11

### Patch Changes

- Updated dependencies [[`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d)]:
  - @thirdweb-dev/chains@0.1.9

## 0.2.10

### Patch Changes

- Updated dependencies [[`9b303829`](https://github.com/thirdweb-dev/js/commit/9b3038291d1c9f4eb243718a6070e3dac829a354)]:
  - @thirdweb-dev/chains@0.1.8

## 0.2.9

### Patch Changes

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

- [#760](https://github.com/thirdweb-dev/js/pull/760) [`93eca1de`](https://github.com/thirdweb-dev/js/commit/93eca1de7d23d66a129418aee72a41e394cbec16) Thanks [@jnsdls](https://github.com/jnsdls)! - keep `@coinbase/wallet-sdk` as a full dependency instead of peer dependency

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

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

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

- [#833](https://github.com/thirdweb-dev/js/pull/833) [`83e99dbf`](https://github.com/thirdweb-dev/js/commit/83e99dbf289c7b8b8991c58383f8bc2a63f5a702) Thanks [@MananTank](https://github.com/MananTank)! - Fix paper wallet autoconnect issue

- [#824](https://github.com/thirdweb-dev/js/pull/824) [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a) Thanks [@iketw](https://github.com/iketw)! - [Wallets] Add autoconnect capabilities

  - You can now call `.autoConnect` on your wallets and it will check if the wallet is connected. If it's not, it will not trigger the connect flow

- [#802](https://github.com/thirdweb-dev/js/pull/802) [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac) Thanks [@iketw](https://github.com/iketw)! - [ReactCore/Wallets] ReactCore manages all coordination for wallet reconnection

- [#739](https://github.com/thirdweb-dev/js/pull/739) [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c) Thanks [@jnsdls](https://github.com/jnsdls)! - Add `Safe` connector and wallet

- [#835](https://github.com/thirdweb-dev/js/pull/835) [`6b31a9bc`](https://github.com/thirdweb-dev/js/commit/6b31a9bcd3898cf56ee3b774a44b7481738c8e60) Thanks [@iketw](https://github.com/iketw)! - [Wallets] set qrcode prop correctly

- [#764](https://github.com/thirdweb-dev/js/pull/764) [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a) Thanks [@MananTank](https://github.com/MananTank)! - paper wallet, do not save device wallet password

- [#584](https://github.com/thirdweb-dev/js/pull/584) [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db) Thanks [@MananTank](https://github.com/MananTank)! - [Wallets] New and updated wallets. [RN] UI Components and Wallets support.

- [#832](https://github.com/thirdweb-dev/js/pull/832) [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94) Thanks [@MananTank](https://github.com/MananTank)! - - Fix `wallet.addListener` "connect", "disconnect" event emit issue

  - update the paper sdk

- [#778](https://github.com/thirdweb-dev/js/pull/778) [`6c0c6538`](https://github.com/thirdweb-dev/js/commit/6c0c65389fb5b990a6e780e7d3f7dbd403fe950d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Device wallet input cleanup

- [#786](https://github.com/thirdweb-dev/js/pull/786) [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8) Thanks [@MananTank](https://github.com/MananTank)! - Gnosis Safe

- [#748](https://github.com/thirdweb-dev/js/pull/748) [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922) Thanks [@MananTank](https://github.com/MananTank)! - [ReactCore] Inject api key to chains

- Updated dependencies [[`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36), [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682), [`6b145d4b`](https://github.com/thirdweb-dev/js/commit/6b145d4b36d2706f8a2dcad4b8f680c41606a556), [`e2ec70c4`](https://github.com/thirdweb-dev/js/commit/e2ec70c49264737fbd2afb1cacabded82262bc6c), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`9a4a542c`](https://github.com/thirdweb-dev/js/commit/9a4a542ce9650605d48745a40126ca6b52a16722), [`b2d0ffb0`](https://github.com/thirdweb-dev/js/commit/b2d0ffb049208de9f9212eae7059212aed74fec4)]:
  - @thirdweb-dev/chains@0.1.7

## 0.2.8

### Patch Changes

- [#696](https://github.com/thirdweb-dev/js/pull/696) [`d30e3f4d`](https://github.com/thirdweb-dev/js/commit/d30e3f4db3d74589429e17da1a56e89e9e1082ab) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Upgrade Paper SDK

- [#692](https://github.com/thirdweb-dev/js/pull/692) [`31a252a0`](https://github.com/thirdweb-dev/js/commit/31a252a0ecafe338d1fbb3000b5dec55274a2d84) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Cleanup PaperWallet integration

## 0.2.7

### Patch Changes

- [#665](https://github.com/thirdweb-dev/js/pull/665) [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75) Thanks [@shift4id](https://github.com/shift4id)! - Fix spelling throughout all packages

- [#612](https://github.com/thirdweb-dev/js/pull/612) [`e50911bc`](https://github.com/thirdweb-dev/js/commit/e50911bc065dda99945d906d8b166f49d7a89677) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Email wallet RPC support

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

## 0.2.2

## 0.2.1

### Patch Changes

- [#548](https://github.com/thirdweb-dev/js/pull/548) [`94b120f`](https://github.com/thirdweb-dev/js/commit/94b120ffd1ae04e6f363c0444480920319491cb8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New DeviceWallet feature

- [`bddabe0`](https://github.com/thirdweb-dev/js/commit/bddabe0b42e1f61f49aea555e32ba2747fb94351) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Introducing email wallet capability

## 0.2.0

### Minor Changes

- [#460](https://github.com/thirdweb-dev/js/pull/460) [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab) Thanks [@adam-maj](https://github.com/adam-maj)! - Wallets abstraction along with major Auth upgrade. Wallets split into EVM and Solana entrypoints along with `GenericAuthWallet` implementation.

  Additionally, `AWSKmsWallet` and `AWSSecretsManager` wallets have been moved into the `@thirdweb-dev/wallets/evm` entrypoint from the SDK.

## 0.1.1

### Patch Changes

- [#457](https://github.com/thirdweb-dev/js/pull/457) [`ccb4ce8`](https://github.com/thirdweb-dev/js/commit/ccb4ce8d00f50ff34426a0a5e58c7243e409f706) Thanks [@jnsdls](https://github.com/jnsdls)! - Support for new magic link connector

- [#454](https://github.com/thirdweb-dev/js/pull/454) [`c673e39`](https://github.com/thirdweb-dev/js/commit/c673e39f23ef082097d73d62910580e8fad400a0) Thanks [@jnsdls](https://github.com/jnsdls)! - upgraded dependencies

- [#458](https://github.com/thirdweb-dev/js/pull/458) [`4cdd0bd`](https://github.com/thirdweb-dev/js/commit/4cdd0bd6348494a256d7c6a2bdf8f7b5c20f6877) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fixes for latest wallet package integration

## 0.1.0

### Minor Changes

- [#420](https://github.com/thirdweb-dev/js/pull/420) [`639e535`](https://github.com/thirdweb-dev/js/commit/639e535ed55280ad9d081001aab3f5af72bb3e45) Thanks [@jnsdls](https://github.com/jnsdls)! - Init wallet package
