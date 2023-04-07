# @thirdweb-dev/wallets

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
