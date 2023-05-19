# @thirdweb-dev/react-native

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
