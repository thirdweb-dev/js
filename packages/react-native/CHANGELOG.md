# @thirdweb-dev/react-native

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
