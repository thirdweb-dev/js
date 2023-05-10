# @thirdweb-dev/chains

## 0.1.15

### Patch Changes

- [#990](https://github.com/thirdweb-dev/js/pull/990) [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - updated chains

## 0.1.14

### Patch Changes

- [#954](https://github.com/thirdweb-dev/js/pull/954) [`5305b42d`](https://github.com/thirdweb-dev/js/commit/5305b42db554b69f903b3d95f3ba0eeddabd6114) Thanks [@jarrodwatts](https://github.com/jarrodwatts)! - useContract now types correctly for thirdweb generate

## 0.1.13

### Patch Changes

- [#787](https://github.com/thirdweb-dev/js/pull/787) [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f) Thanks [@iketw](https://github.com/iketw)! - [ReactNative] Adds Device Wallet

- [#931](https://github.com/thirdweb-dev/js/pull/931) [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updated chains

## 0.1.12

### Patch Changes

- [#896](https://github.com/thirdweb-dev/js/pull/896) [`a6610f12`](https://github.com/thirdweb-dev/js/commit/a6610f1211e9359885b948bf69a66d834707ec07) Thanks [@atharvadeosthale](https://github.com/atharvadeosthale)! - Added links to portal

- [#903](https://github.com/thirdweb-dev/js/pull/903) [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - new chains

## 0.1.11

### Patch Changes

- [#870](https://github.com/thirdweb-dev/js/pull/870) [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains

## 0.1.10

### Patch Changes

- [#848](https://github.com/thirdweb-dev/js/pull/848) [`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00) Thanks [@jnsdls](https://github.com/jnsdls)! - more complete types for chains and better generation

## 0.1.9

### Patch Changes

- [#843](https://github.com/thirdweb-dev/js/pull/843) [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains

## 0.1.8

### Patch Changes

- [#839](https://github.com/thirdweb-dev/js/pull/839) [`9b303829`](https://github.com/thirdweb-dev/js/commit/9b3038291d1c9f4eb243718a6070e3dac829a354) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains (add telos icon & avalanche fuji faucet)

## 0.1.7

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

- [#771](https://github.com/thirdweb-dev/js/pull/771) [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36) Thanks [@iketw](https://github.com/iketw)! - [ReactNativeSDK] Use wallet metadata from the wallet class

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

- [#801](https://github.com/thirdweb-dev/js/pull/801) [`6b145d4b`](https://github.com/thirdweb-dev/js/commit/6b145d4b36d2706f8a2dcad4b8f680c41606a556) Thanks [@jnsdls](https://github.com/jnsdls)! - updated chains

- [#822](https://github.com/thirdweb-dev/js/pull/822) [`e2ec70c4`](https://github.com/thirdweb-dev/js/commit/e2ec70c49264737fbd2afb1cacabded82262bc6c) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains again

- [#721](https://github.com/thirdweb-dev/js/pull/721) [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f) Thanks [@adam-maj](https://github.com/adam-maj)! - Update chains

- [#748](https://github.com/thirdweb-dev/js/pull/748) [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922) Thanks [@MananTank](https://github.com/MananTank)! - [ReactCore] Inject api key to chains

- [#770](https://github.com/thirdweb-dev/js/pull/770) [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - update chains

- [#809](https://github.com/thirdweb-dev/js/pull/809) [`9a4a542c`](https://github.com/thirdweb-dev/js/commit/9a4a542ce9650605d48745a40126ca6b52a16722) Thanks [@jnsdls](https://github.com/jnsdls)! - add new chains

- [#719](https://github.com/thirdweb-dev/js/pull/719) [`b2d0ffb0`](https://github.com/thirdweb-dev/js/commit/b2d0ffb049208de9f9212eae7059212aed74fec4) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Replace Goerli default faucet

## 0.1.6

### Patch Changes

- [#635](https://github.com/thirdweb-dev/js/pull/635) [`7832041c`](https://github.com/thirdweb-dev/js/commit/7832041c0fb25852489c73453c2b26e844d94582) Thanks [@jnsdls](https://github.com/jnsdls)! - Add additional chains

- [#643](https://github.com/thirdweb-dev/js/pull/643) [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6) Thanks [@jnsdls](https://github.com/jnsdls)! - expose `getChainBySlug` and `ChainSlug` and `ChainId` type

- [#638](https://github.com/thirdweb-dev/js/pull/638) [`e33bd2a8`](https://github.com/thirdweb-dev/js/commit/e33bd2a856bbc2e2f6b0c90b46be5166281875ae) Thanks [@jnsdls](https://github.com/jnsdls)! - Add `getChainByChainId()` to retrieve chain by chainId

- [#685](https://github.com/thirdweb-dev/js/pull/685) [`4355518a`](https://github.com/thirdweb-dev/js/commit/4355518afea68cd8026d3ab8a0144c15d66b9e24) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains

## 0.1.5

### Patch Changes

- [#617](https://github.com/thirdweb-dev/js/pull/617) [`d7deaa4`](https://github.com/thirdweb-dev/js/commit/d7deaa48f2f943deb8f2ad7459d17de930c00517) Thanks [@jnsdls](https://github.com/jnsdls)! - Add Base Goerli

- [#619](https://github.com/thirdweb-dev/js/pull/619) [`b7a5b45`](https://github.com/thirdweb-dev/js/commit/b7a5b454415596316f58a75f14472631242cc115) Thanks [@jnsdls](https://github.com/jnsdls)! - fix the slug for base-goerli

## 0.1.4

### Patch Changes

- [#613](https://github.com/thirdweb-dev/js/pull/613) [`a3472a1`](https://github.com/thirdweb-dev/js/commit/a3472a133175826d052ee986907de014e3cf3ad9) Thanks [@jnsdls](https://github.com/jnsdls)! - Update Chains

- [#616](https://github.com/thirdweb-dev/js/pull/616) [`5712650`](https://github.com/thirdweb-dev/js/commit/5712650074e2415bbea4173a0bb68d727ff2db90) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - new chains

## 0.1.3

### Patch Changes

- [#608](https://github.com/thirdweb-dev/js/pull/608) [`3d644fb`](https://github.com/thirdweb-dev/js/commit/3d644fb8cbae8bc3ee624505831b9f5c6996898a) Thanks [@jnsdls](https://github.com/jnsdls)! - update chains

## 0.1.2

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

## 0.1.1

### Patch Changes

- [#599](https://github.com/thirdweb-dev/js/pull/599) [`f580b8a`](https://github.com/thirdweb-dev/js/commit/f580b8ac06534df24b0194cbc632b4a8fd447611) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New chains added

## 0.1.0

### Minor Changes

- [`af8cf40`](https://github.com/thirdweb-dev/js/commit/af8cf40e4e1dab6afcc7622f7f9bbcfc6e8534d8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Initial release for `@thirdweb-dev/chains`.

  Use this package to easily configure chains with `@thirdweb-dev/sdk` and `@thirdweb-dev/react`.

### Patch Changes

- [`6a50719`](https://github.com/thirdweb-dev/js/commit/6a507194861b0712fd753c49ac63a8af68eb21d5) Thanks [@jnsdls](https://github.com/jnsdls)! - add `getChainRPCs` export to get a list of RPCs instead of a single RPC via `getChainRPC`

- [`5d25ee1`](https://github.com/thirdweb-dev/js/commit/5d25ee1ab7abb4bfbded283a18f2d7740bb6995d) Thanks [@jnsdls](https://github.com/jnsdls)! - fix `getChainRPC()` utility function logic

- [`d0bcd2c`](https://github.com/thirdweb-dev/js/commit/d0bcd2c5871ca9480efc8d97e27e337eb9bbf830) Thanks [@jnsdls](https://github.com/jnsdls)! - add new chains + localhost special case

- [#589](https://github.com/thirdweb-dev/js/pull/589) [`017b0d5`](https://github.com/thirdweb-dev/js/commit/017b0d56b64651b290440b60789e058afba9f9a5) Thanks [@jnsdls](https://github.com/jnsdls)! - add `minimizeChain` and `configureChain` util functions

- [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389) Thanks [@jnsdls](https://github.com/jnsdls)! - add thirdweb rpc to all available chains
