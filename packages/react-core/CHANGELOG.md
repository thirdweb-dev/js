# @thirdweb-dev/react-core

## 3.11.5

### Patch Changes

- [#870](https://github.com/thirdweb-dev/js/pull/870) [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d) Thanks [@jnsdls](https://github.com/jnsdls)! - fix crash during SSR when "window" is undefined

- [#862](https://github.com/thirdweb-dev/js/pull/862) [`b5648aee`](https://github.com/thirdweb-dev/js/commit/b5648aee83b299d07a8eed7773bd32bcceef9657) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Make tokenId optional one useNFTBalance

- Updated dependencies [[`1547d76c`](https://github.com/thirdweb-dev/js/commit/1547d76cce52265076c347599014f578c1de6152), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d), [`1b8f812f`](https://github.com/thirdweb-dev/js/commit/1b8f812fb8c910d91fb7535d6446a0b6fc6b2310), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d)]:
  - @thirdweb-dev/sdk@3.10.8
  - @thirdweb-dev/wallets@0.2.14
  - @thirdweb-dev/chains@0.1.11

## 3.11.4

### Patch Changes

- [#851](https://github.com/thirdweb-dev/js/pull/851) [`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc) Thanks [@MananTank](https://github.com/MananTank)! - Fix wallet autoconnect issues

  ### Fixes

  - infinite loading spinner on connect wallet button when wallet is locked or connection to app is closed
  - network switch popup on page load when wallet is connected to different network than it was previously connected
  - removed autoconnect timeout - don't need it anymore

- [#855](https://github.com/thirdweb-dev/js/pull/855) [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48) Thanks [@MananTank](https://github.com/MananTank)! - Add auth in Connect Wallet button

- Updated dependencies [[`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc), [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48)]:
  - @thirdweb-dev/wallets@0.2.13
  - @thirdweb-dev/sdk@3.10.7

## 3.11.3

### Patch Changes

- [#848](https://github.com/thirdweb-dev/js/pull/848) [`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00) Thanks [@jnsdls](https://github.com/jnsdls)! - bugfix: `useContractWrite` now accepts overrides again.

- Updated dependencies [[`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00)]:
  - @thirdweb-dev/chains@0.1.10
  - @thirdweb-dev/sdk@3.10.7
  - @thirdweb-dev/wallets@0.2.12

## 3.11.2

### Patch Changes

- [#834](https://github.com/thirdweb-dev/js/pull/834) [`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910) Thanks [@adam-maj](https://github.com/adam-maj)! - Usage of the `useContractRead` and `useContractWrite` hooks has changed:

  ```js
  const owner = "0x...";
  const operator = "0x...";
  const overrides = { gasLimit: "10000", gasPrice: "10000" };

  // Old usage
  const { data } = useContractRead(
    contract,
    "approve",
    owner,
    operator,
    overrides,
  );

  const { mutateAsync } = useContractWrite(contract, "approve");
  mutateAsync(owner, operator, overrides);

  // New usage
  const { data } = useContractRead(
    contract,
    "approve",
    [owner, operator],
    overrides,
  );

  const { mutateAsync } = useContractWrite(contract, "approve");
  mutateAsync([owner, operator], overrides);
  ```

- [#841](https://github.com/thirdweb-dev/js/pull/841) [`1f2df55b`](https://github.com/thirdweb-dev/js/commit/1f2df55b673fefb0106778dca7a13406cfbcfc90) Thanks [@MananTank](https://github.com/MananTank)! - add useNetwork() hook back

- [#843](https://github.com/thirdweb-dev/js/pull/843) [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d) Thanks [@jnsdls](https://github.com/jnsdls)! - fix solana program query key resolution

- Updated dependencies [[`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d)]:
  - @thirdweb-dev/sdk@3.10.6
  - @thirdweb-dev/chains@0.1.9
  - @thirdweb-dev/storage@1.1.2
  - @thirdweb-dev/wallets@0.2.11

## 3.11.1

### Patch Changes

- [#837](https://github.com/thirdweb-dev/js/pull/837) [`e2581f21`](https://github.com/thirdweb-dev/js/commit/e2581f211e4419105d6169d84a60a4d69759eda9) Thanks [@lucoadam](https://github.com/lucoadam)! - Fixes auth logout by invalidating cookie by storing updated cookie credential

- Updated dependencies [[`9b303829`](https://github.com/thirdweb-dev/js/commit/9b3038291d1c9f4eb243718a6070e3dac829a354)]:
  - @thirdweb-dev/chains@0.1.8
  - @thirdweb-dev/sdk@3.10.5
  - @thirdweb-dev/wallets@0.2.10

## 3.11.0

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

- [#739](https://github.com/thirdweb-dev/js/pull/739) [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c) Thanks [@jnsdls](https://github.com/jnsdls)! - remove `Gnosis Safe` and `Magic Link` connectors -> they can now be found in `@thirdweb-dev/wallets` instead.

### Patch Changes

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

- [#757](https://github.com/thirdweb-dev/js/pull/757) [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d) Thanks [@iketw](https://github.com/iketw)! - switch to `thirdwebcdn.com` for default IPFS gateway

- [#829](https://github.com/thirdweb-dev/js/pull/829) [`3ff8eecf`](https://github.com/thirdweb-dev/js/commit/3ff8eecf18b9606f6b4f2164745448b7f2031fb3) Thanks [@MananTank](https://github.com/MananTank)! - use `authConfig` provided in `useLogin()` hook

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

- [#800](https://github.com/thirdweb-dev/js/pull/800) [`d6ae520a`](https://github.com/thirdweb-dev/js/commit/d6ae520aaf272bdd9d235858701ea67c2c1fd796) Thanks [@iketw](https://github.com/iketw)! - [ReactCore/RN] Fix useActiveChain hook

- [#681](https://github.com/thirdweb-dev/js/pull/681) [`5f0493d0`](https://github.com/thirdweb-dev/js/commit/5f0493d0fb291b4072cc433412883d352588c397) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for ENS

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

- [#824](https://github.com/thirdweb-dev/js/pull/824) [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a) Thanks [@iketw](https://github.com/iketw)! - [Wallets] Add autoconnect capabilities

  - You can now call `.autoConnect` on your wallets and it will check if the wallet is connected. If it's not, it will not trigger the connect flow

- [#819](https://github.com/thirdweb-dev/js/pull/819) [`682f1c67`](https://github.com/thirdweb-dev/js/commit/682f1c673f4b02acab3986031942dbd3d67a87fa) Thanks [@adam-maj](https://github.com/adam-maj)! - Update contract.call to have function types

- [#802](https://github.com/thirdweb-dev/js/pull/802) [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac) Thanks [@iketw](https://github.com/iketw)! - [ReactCore/Wallets] ReactCore manages all coordination for wallet reconnection

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

- [#717](https://github.com/thirdweb-dev/js/pull/717) [`04775954`](https://github.com/thirdweb-dev/js/commit/04775954a0af787313ed667cc5ef5d2212e1df36) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Make tokenId optional on useTotalCirculatingSupply

- [#764](https://github.com/thirdweb-dev/js/pull/764) [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a) Thanks [@MananTank](https://github.com/MananTank)! - paper wallet, do not save device wallet password

- [#832](https://github.com/thirdweb-dev/js/pull/832) [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94) Thanks [@MananTank](https://github.com/MananTank)! - - Fix `wallet.addListener` "connect", "disconnect" event emit issue

  - update the paper sdk

- [#786](https://github.com/thirdweb-dev/js/pull/786) [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8) Thanks [@MananTank](https://github.com/MananTank)! - Gnosis Safe

- [#799](https://github.com/thirdweb-dev/js/pull/799) [`49eceaa0`](https://github.com/thirdweb-dev/js/commit/49eceaa08e642a72bb6e21d7b68a1177ae37aec5) Thanks [@iketw](https://github.com/iketw)! - [ReactCore] Stop typescript from warning about chains not in our defaults

- [#748](https://github.com/thirdweb-dev/js/pull/748) [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922) Thanks [@MananTank](https://github.com/MananTank)! - [ReactCore] Inject api key to chains

- [#767](https://github.com/thirdweb-dev/js/pull/767) [`9fa628f8`](https://github.com/thirdweb-dev/js/commit/9fa628f89492633e4f7ea2b7c542e1587ea17a86) Thanks [@adam-maj](https://github.com/adam-maj)! - Make generate work with useContract

- [#712](https://github.com/thirdweb-dev/js/pull/712) [`bd40bc2e`](https://github.com/thirdweb-dev/js/commit/bd40bc2ef1e90490400a5f03fdfd178578844244) Thanks [@atharvadeosthale](https://github.com/atharvadeosthale)! - Updated params for claiming hooks to reflect the correct type of contract that can be used

- Updated dependencies [[`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`6e9b9dba`](https://github.com/thirdweb-dev/js/commit/6e9b9dba1dfb9e828e6927f441e7223baa5bcc76), [`93eca1de`](https://github.com/thirdweb-dev/js/commit/93eca1de7d23d66a129418aee72a41e394cbec16), [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406), [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d), [`2ec28021`](https://github.com/thirdweb-dev/js/commit/2ec2802119a3c375a1adaed1263ae1eae1384865), [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb), [`805896c7`](https://github.com/thirdweb-dev/js/commit/805896c78d5ecbbe1866408fbb73d060f7404146), [`b56511e2`](https://github.com/thirdweb-dev/js/commit/b56511e22d5eb2adf306d5675f1e52ff97a64f3a), [`8ef5a6f2`](https://github.com/thirdweb-dev/js/commit/8ef5a6f21735e6ac235937f6c34495a74c9da364), [`4cbbad98`](https://github.com/thirdweb-dev/js/commit/4cbbad98b303d872c09efedbece179445c7adc9c), [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36), [`5f0493d0`](https://github.com/thirdweb-dev/js/commit/5f0493d0fb291b4072cc433412883d352588c397), [`71532e5a`](https://github.com/thirdweb-dev/js/commit/71532e5a9fb5b116ba342465ef82e795ca8cc011), [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682), [`de7b6196`](https://github.com/thirdweb-dev/js/commit/de7b6196766d709deeac148a24dd8dd38b3e924a), [`6b145d4b`](https://github.com/thirdweb-dev/js/commit/6b145d4b36d2706f8a2dcad4b8f680c41606a556), [`83e99dbf`](https://github.com/thirdweb-dev/js/commit/83e99dbf289c7b8b8991c58383f8bc2a63f5a702), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`52d37f01`](https://github.com/thirdweb-dev/js/commit/52d37f01873c649b36c7d77df6c525a666245132), [`485abd06`](https://github.com/thirdweb-dev/js/commit/485abd06aa972a4f43f71b98f9666f113b932fb3), [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a), [`682f1c67`](https://github.com/thirdweb-dev/js/commit/682f1c673f4b02acab3986031942dbd3d67a87fa), [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`d8c1c943`](https://github.com/thirdweb-dev/js/commit/d8c1c9433e8dc48a70a1c93a0c1467c12ad79701), [`08507611`](https://github.com/thirdweb-dev/js/commit/085076117b18a615aa2b1b8f086d434cab3a4e4e), [`e2ec70c4`](https://github.com/thirdweb-dev/js/commit/e2ec70c49264737fbd2afb1cacabded82262bc6c), [`6b31a9bc`](https://github.com/thirdweb-dev/js/commit/6b31a9bcd3898cf56ee3b774a44b7481738c8e60), [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a), [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`8463a176`](https://github.com/thirdweb-dev/js/commit/8463a1761ff4741b55a72e6994a29f7dd50b54e1), [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94), [`6c0c6538`](https://github.com/thirdweb-dev/js/commit/6c0c65389fb5b990a6e780e7d3f7dbd403fe950d), [`208d97e6`](https://github.com/thirdweb-dev/js/commit/208d97e6a892942171c056768876b3e33399d275), [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3), [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922), [`9fa628f8`](https://github.com/thirdweb-dev/js/commit/9fa628f89492633e4f7ea2b7c542e1587ea17a86), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`abf609a4`](https://github.com/thirdweb-dev/js/commit/abf609a40114a509fe07a04bfb0793dc44c9e39d), [`9a4a542c`](https://github.com/thirdweb-dev/js/commit/9a4a542ce9650605d48745a40126ca6b52a16722), [`b2d0ffb0`](https://github.com/thirdweb-dev/js/commit/b2d0ffb049208de9f9212eae7059212aed74fec4)]:
  - @thirdweb-dev/wallets@0.2.9
  - @thirdweb-dev/chains@0.1.7
  - @thirdweb-dev/sdk@3.10.4
  - @thirdweb-dev/storage@1.1.1

## 3.10.3

## 3.10.2

## 3.10.1

### Patch Changes

- [#684](https://github.com/thirdweb-dev/js/pull/684) [`9efeba38`](https://github.com/thirdweb-dev/js/commit/9efeba38f06783b78e2c947ad878350173f4e07a) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth hooks to include credentials on login

## 3.10.0

### Patch Changes

- [#670](https://github.com/thirdweb-dev/js/pull/670) [`6ae39277`](https://github.com/thirdweb-dev/js/commit/6ae39277a1d2ea507cedcde7ae62439758e4d6e0) Thanks [@jnsdls](https://github.com/jnsdls)! - improve signer resilience

- [#668](https://github.com/thirdweb-dev/js/pull/668) [`8f46a2ee`](https://github.com/thirdweb-dev/js/commit/8f46a2eef59d2b21b68e38338ed2b3a820421501) Thanks [@jnsdls](https://github.com/jnsdls)! - FIX signer being updated

- [#650](https://github.com/thirdweb-dev/js/pull/650) [`8d5b418e`](https://github.com/thirdweb-dev/js/commit/8d5b418e78fcf692f72aed5fe49358e40720d80c) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Fix invariant for appURI hooks

- [#665](https://github.com/thirdweb-dev/js/pull/665) [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75) Thanks [@shift4id](https://github.com/shift4id)! - Fix spelling throughout all packages

- [#672](https://github.com/thirdweb-dev/js/pull/672) [`2676fc01`](https://github.com/thirdweb-dev/js/commit/2676fc01f4d8eabc90e71fad1f14b4b29806d2bd) Thanks [@jnsdls](https://github.com/jnsdls)! - back to use-memo

- [#662](https://github.com/thirdweb-dev/js/pull/662) [`3740a0bf`](https://github.com/thirdweb-dev/js/commit/3740a0bf5db1301dbd93a97ab4c9343429a4e12d) Thanks [@furqanrydhan](https://github.com/furqanrydhan)! - switch appuri -> app

- [#626](https://github.com/thirdweb-dev/js/pull/626) [`91f5a2fd`](https://github.com/thirdweb-dev/js/commit/91f5a2fd5cb2f5aed6498defdb1feeabb283db6c) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Improve comments and examples in the documentation

- [#625](https://github.com/thirdweb-dev/js/pull/625) [`23cd88ec`](https://github.com/thirdweb-dev/js/commit/23cd88ec3a2af86eafeac258fdc8c5b4ce3196f2) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add appURI get/set

- [#660](https://github.com/thirdweb-dev/js/pull/660) [`87a101ad`](https://github.com/thirdweb-dev/js/commit/87a101ad56430e793c9f22b583fea204dfed0554) Thanks [@MananTank](https://github.com/MananTank)! - Fix Wrong Currency symbol in non-default chains

- Updated dependencies [[`7832041c`](https://github.com/thirdweb-dev/js/commit/7832041c0fb25852489c73453c2b26e844d94582), [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75), [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6), [`e33bd2a8`](https://github.com/thirdweb-dev/js/commit/e33bd2a856bbc2e2f6b0c90b46be5166281875ae), [`4355518a`](https://github.com/thirdweb-dev/js/commit/4355518afea68cd8026d3ab8a0144c15d66b9e24)]:
  - @thirdweb-dev/chains@0.1.6
  - @thirdweb-dev/auth@3.0.7

## 3.9.5

### Patch Changes

- Updated dependencies [[`d7deaa4`](https://github.com/thirdweb-dev/js/commit/d7deaa48f2f943deb8f2ad7459d17de930c00517), [`b7a5b45`](https://github.com/thirdweb-dev/js/commit/b7a5b454415596316f58a75f14472631242cc115)]:
  - @thirdweb-dev/chains@0.1.5

## 3.9.4

### Patch Changes

- Updated dependencies [[`a3472a1`](https://github.com/thirdweb-dev/js/commit/a3472a133175826d052ee986907de014e3cf3ad9), [`5712650`](https://github.com/thirdweb-dev/js/commit/5712650074e2415bbea4173a0bb68d727ff2db90)]:
  - @thirdweb-dev/chains@0.1.4

## 3.9.3

### Patch Changes

- Updated dependencies [[`3d644fb`](https://github.com/thirdweb-dev/js/commit/3d644fb8cbae8bc3ee624505831b9f5c6996898a)]:
  - @thirdweb-dev/chains@0.1.3

## 3.9.2

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

- Updated dependencies [[`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19)]:
  - @thirdweb-dev/chains@0.1.2
  - @thirdweb-dev/auth@3.0.6

## 3.9.1

### Patch Changes

- [#588](https://github.com/thirdweb-dev/js/pull/588) [`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e) Thanks [@adam-maj](https://github.com/adam-maj)! - Update to use new Auth

- Updated dependencies [[`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e), [`f580b8a`](https://github.com/thirdweb-dev/js/commit/f580b8ac06534df24b0194cbc632b4a8fd447611)]:
  - @thirdweb-dev/auth@3.0.5
  - @thirdweb-dev/chains@0.1.1

## 3.9.0

### Patch Changes

- [#591](https://github.com/thirdweb-dev/js/pull/591) [`61d41db`](https://github.com/thirdweb-dev/js/commit/61d41db7699d999d4f71038b5376dd95e9c0d5a5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix passing activeChainId prop

- [`818048d`](https://github.com/thirdweb-dev/js/commit/818048d52fdef43536929f3b4df5b4c255b97389) Thanks [@jnsdls](https://github.com/jnsdls)! - enable passing of apiKeys to the provider

- [`2b3e94f`](https://github.com/thirdweb-dev/js/commit/2b3e94f90a49bcaccf63ac84fc9fc974506ca70d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix creating SDK with signer only

- [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389) Thanks [@jnsdls](https://github.com/jnsdls)! - fix deprecationWarning bug in react & react-core

- [#578](https://github.com/thirdweb-dev/js/pull/578) [`f3b96e7`](https://github.com/thirdweb-dev/js/commit/f3b96e7120ebb45f837803530962a21f87439661) Thanks [@jnsdls](https://github.com/jnsdls)! - allow `number` and `string` types for `activeChain` prop on `<ThirdwebSDKProvider />` and `<ThirdwebProvider />`

- [`5d25ee1`](https://github.com/thirdweb-dev/js/commit/5d25ee1ab7abb4bfbded283a18f2d7740bb6995d) Thanks [@jnsdls](https://github.com/jnsdls)! - fix initialization of the SDK when a `signer` is provided with a chain that is not passed in `supportedChains`

- [#576](https://github.com/thirdweb-dev/js/pull/576) [`f6ea971`](https://github.com/thirdweb-dev/js/commit/f6ea97185470f91fc73a117827df51cf8e1c99d1) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for next-auth to auth and react

- Updated dependencies [[`6a50719`](https://github.com/thirdweb-dev/js/commit/6a507194861b0712fd753c49ac63a8af68eb21d5), [`af8cf40`](https://github.com/thirdweb-dev/js/commit/af8cf40e4e1dab6afcc7622f7f9bbcfc6e8534d8), [`5d25ee1`](https://github.com/thirdweb-dev/js/commit/5d25ee1ab7abb4bfbded283a18f2d7740bb6995d), [`d0bcd2c`](https://github.com/thirdweb-dev/js/commit/d0bcd2c5871ca9480efc8d97e27e337eb9bbf830), [`4d9e5c6`](https://github.com/thirdweb-dev/js/commit/4d9e5c6193b839fc7f67e7e73e0589dc8c4db90d), [`017b0d5`](https://github.com/thirdweb-dev/js/commit/017b0d56b64651b290440b60789e058afba9f9a5), [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389), [`f6ea971`](https://github.com/thirdweb-dev/js/commit/f6ea97185470f91fc73a117827df51cf8e1c99d1)]:
  - @thirdweb-dev/chains@0.1.0
  - @thirdweb-dev/auth@3.0.4

## 3.8.2

## 3.8.1

## 3.8.0

### Patch Changes

- [#546](https://github.com/thirdweb-dev/js/pull/546) [`440a4ad`](https://github.com/thirdweb-dev/js/commit/440a4ade95874e696c589eaa7aae9f0fecc862be) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add missing marketplace v3 hooks

## 3.7.4

## 3.7.3

### Patch Changes

- Updated dependencies [[`dee4596`](https://github.com/thirdweb-dev/js/commit/dee45965496d5d0298944031dd13a4345f9e1683)]:
  - @thirdweb-dev/auth@3.0.3

## 3.7.2

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/auth@3.0.2

## 3.7.1

### Patch Changes

- [#520](https://github.com/thirdweb-dev/js/pull/520) [`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth and react-core dependencies

- Updated dependencies [[`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1)]:
  - @thirdweb-dev/auth@3.0.1

## 3.7.0

### Minor Changes

- [#460](https://github.com/thirdweb-dev/js/pull/460) [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab) Thanks [@adam-maj](https://github.com/adam-maj)! - All Auth hooks and configuration have been upgraded along with the major upgrade to Auth. This includes changes in necessary `authConfig` to the `ThirdwebProvider`, as well as usage of the `useLogin`, `useLogout`, and `useUser` hooks.

  ## How to Upgrade

  In order to upgrade your frontend setup to account for these changes, you'll need to make the following changes to your app:

  **1. Remove `loginRedirect` from `authConfig`**

  In your `ThirdwebProvider`, you can remove the `loginRedirect` option from the `authConfig` object, as the `login` endpoint no longer uses redirects.

  ```jsx
  export default function MyApp({ Component, pageProps }) {
    return (
      <ThirdwebProvider
        authConfig={{
          domain: "example.com",
          authUrl: "/api/auth",
          // No more loginRedirect
        }}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    );
  }
  ```

  **2. Update `useLogin` and `useLogout` to use object destructuring**

  The `useLogin` and `useLogout` hooks now return an object with a `login` and `logout` function (as well as `isLoading` states), respectively. You'll need to update your usage of these hooks to use object destructuring.

  ```jsx
  import { useLogin, useLogout } from "@thirdweb-dev/react-core";

  export default function Component() {
    const { login } = useLogin();
    const { logout } = useLogout();

    return (
      <div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  ```

- [#511](https://github.com/thirdweb-dev/js/pull/511) [`62b7388`](https://github.com/thirdweb-dev/js/commit/62b7388bb2f2564fff0c5e86f0a468db65992b4e) Thanks [@ikethirdweb](https://github.com/ikethirdweb)! - react-core init

  `react-core` package creation. The goal is to share as much code as possible between our react and future react-native packages.

### Patch Changes

- [#514](https://github.com/thirdweb-dev/js/pull/514) [`48893c7`](https://github.com/thirdweb-dev/js/commit/48893c730e565c962d117b1eca579e240dc6a5ec) Thanks [@jnsdls](https://github.com/jnsdls)! - switch to using the new `@thirdweb-dev/react-core` package to power `@thirdweb-dev/react`
