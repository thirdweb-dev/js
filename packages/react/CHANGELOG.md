# @thirdweb-dev/react

## 3.2.1

### Patch Changes

- [#264](https://github.com/thirdweb-dev/js/pull/264) [`f669d3e`](https://github.com/thirdweb-dev/js/commit/f669d3ef4a84368c23f0359aec304f66a4063042) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Standarize data between evm/solana for useLazyMint hook

## 3.2.0

### Patch Changes

- [#261](https://github.com/thirdweb-dev/js/pull/261) [`c8261b7`](https://github.com/thirdweb-dev/js/commit/c8261b74b5828ac66ea3a6d7636aa57e40ea1a14) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - align behavior of `useContract()` and `getContract()` across react & sdk to both allow passing optional second params of contract types or ABIs

- [#236](https://github.com/thirdweb-dev/js/pull/236) [`cac373b`](https://github.com/thirdweb-dev/js/commit/cac373b010ce3be3615a36671b66815a27785061) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - do not require a connection, instead handle a network directly

- [#251](https://github.com/thirdweb-dev/js/pull/251) [`ea41231`](https://github.com/thirdweb-dev/js/commit/ea41231b3ec4a2aef6a203db195d0e450c45ef56) Thanks [@jnsdls](https://github.com/jnsdls)! - fix missing Buffer implementation for WalletConnect and CoinbaseWallet connectors

- [#253](https://github.com/thirdweb-dev/js/pull/253) [`b6fc298`](https://github.com/thirdweb-dev/js/commit/b6fc298d0cf63bc7129104f7779cc9d84e405093) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - allow passing contractType as second param to `useContract()`

- [#243](https://github.com/thirdweb-dev/js/pull/243) [`1136d95`](https://github.com/thirdweb-dev/js/commit/1136d959baf936c166e5f7c051d5173d68d9eb9b) Thanks [@jnsdls](https://github.com/jnsdls)! - fix persister logic

- [#258](https://github.com/thirdweb-dev/js/pull/258) [`ac232b5`](https://github.com/thirdweb-dev/js/commit/ac232b5affe31780ef1c10ec76edb21596850e7e) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Accept SmartContract instead of erc20 instance

- [#245](https://github.com/thirdweb-dev/js/pull/245) [`1972f3e`](https://github.com/thirdweb-dev/js/commit/1972f3ec0d511fbc17642b2a30852a177092a09e) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - expose `useBurnNFT` hook

- [#255](https://github.com/thirdweb-dev/js/pull/255) [`9b92697`](https://github.com/thirdweb-dev/js/commit/9b92697fb77d3072e3e53b451f9b348595ae410e) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - `useContract()` and `<Web3Button />` can now accept an optional ABI directly and will return a `SmartContract` based on it

## 3.1.2

### Patch Changes

- [#229](https://github.com/thirdweb-dev/js/pull/229) [`9c8a3fb`](https://github.com/thirdweb-dev/js/commit/9c8a3fb6d4520dd6cdf2d1c17f33b764e871599e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Expose useClaimNFT hook

## 3.1.1

### Patch Changes

- [#221](https://github.com/thirdweb-dev/js/pull/221) [`c295a47`](https://github.com/thirdweb-dev/js/commit/c295a47144cd722c6f8861c1ec567b53a05ea0bf) Thanks [@jnsdls](https://github.com/jnsdls)! - fix esm exports

## 3.1.0

### Minor Changes

- [#213](https://github.com/thirdweb-dev/js/pull/213) [`e187d21`](https://github.com/thirdweb-dev/js/commit/e187d21e123a506fac0459da18f2d4fc94abae29) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New @thirdweb-dev/react/solana entrypoint

### Patch Changes

- [#208](https://github.com/thirdweb-dev/js/pull/208) [`7c86bab`](https://github.com/thirdweb-dev/js/commit/7c86babb86e02f08a630ed7578036202eb3dbe66) Thanks [@jnsdls](https://github.com/jnsdls)! - add a bunch of initial solana hooks

- [#218](https://github.com/thirdweb-dev/js/pull/218) [`1eaedc2`](https://github.com/thirdweb-dev/js/commit/1eaedc262f0665de2a6a0446402b570371136e05) Thanks [@jnsdls](https://github.com/jnsdls)! - allow both `null` and `undefined` to be passed as a `RequiredParam`

- [#220](https://github.com/thirdweb-dev/js/pull/220) [`37a707f`](https://github.com/thirdweb-dev/js/commit/37a707f98c00140ddedb1d876a4b2f99fe25556a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix chakra zag-menu breaking update

## 3.0.8

### Patch Changes

- [#209](https://github.com/thirdweb-dev/js/pull/209) [`1bda83b`](https://github.com/thirdweb-dev/js/commit/1bda83b1142406892acfb64576fce25d2647afa7) Thanks [@jnsdls](https://github.com/jnsdls)! - fix useLayoutEffect during SSR warning

- Updated dependencies [[`ce05bfd`](https://github.com/thirdweb-dev/js/commit/ce05bfd8615a9c79664856bce53de8b43bed5c87)]:
  - @thirdweb-dev/sdk@3.0.8

## 3.0.7

### Patch Changes

- [#197](https://github.com/thirdweb-dev/js/pull/197) [`f4f05bd`](https://github.com/thirdweb-dev/js/commit/f4f05bd9a4ec98e9abc6716006353f330b7be055) Thanks [@jnsdls](https://github.com/jnsdls)! - make it obvious when the <Web3Button /> will trigger a network switch

- Updated dependencies [[`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c), [`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c)]:
  - @thirdweb-dev/sdk@3.0.7
  - @thirdweb-dev/solana@0.2.15

## 3.0.6

### Patch Changes

- [#179](https://github.com/thirdweb-dev/js/pull/179) [`63258bc`](https://github.com/thirdweb-dev/js/commit/63258bc9c3443db7d12fc1dc6fbd483926c92d3e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose simple provider and useSDK hooks for Solana

- Updated dependencies [[`a80fc97`](https://github.com/thirdweb-dev/js/commit/a80fc97b6a1e72ed46a400b4b602e180947fb870)]:
  - @thirdweb-dev/sdk@3.0.6
  - @thirdweb-dev/solana@0.2.14

## 3.0.5

### Patch Changes

- [#167](https://github.com/thirdweb-dev/js/pull/167) [`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Syntax changes for react native support

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - use internals wherever possible to allow wider usecases with `<ThirdwebSDKProvider>` & add invariants to catch improper use of functionality that requires the full `<ThirdwebProvider` earlier

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - fix case where `<ConnectWallet />` button would get stuck when user cancels connection

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - allow passing `className` to `<ConnectWallet />` and `<Web3Button />` for possible style overrides

- Updated dependencies [[`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191), [`3b877ba`](https://github.com/thirdweb-dev/js/commit/3b877ba221acfd85f80b99e1bc382055217f0a39), [`b54f95d`](https://github.com/thirdweb-dev/js/commit/b54f95dc906928ff2f9251748f254a16fe1f2cee), [`f8ab477`](https://github.com/thirdweb-dev/js/commit/f8ab4779bb2d6d66200e1e8fd558e0ac069a2f54), [`772f843`](https://github.com/thirdweb-dev/js/commit/772f8431e3a62d0ded62dae90a43e9a7edd5b1a2), [`a9ec190`](https://github.com/thirdweb-dev/js/commit/a9ec190ff99d2714cef2500d20ea0f3f73f07be3), [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9), [`5345479`](https://github.com/thirdweb-dev/js/commit/534547992243bdd3a77e34ec2b2487b5adab366a)]:
  - @thirdweb-dev/sdk@3.0.5

## 3.0.4

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/sdk@3.0.4

## 3.0.3

### Patch Changes

- [#143](https://github.com/thirdweb-dev/js/pull/143) [`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix using external signers with ThirdwebSDKProvider

- Updated dependencies [[`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564), [`9d74a43`](https://github.com/thirdweb-dev/js/commit/9d74a43aac21448beba63ba4e2637945965a3634), [`b234c58`](https://github.com/thirdweb-dev/js/commit/b234c58d44d8322e44b2d2ba87ad4ec7d699e961)]:
  - @thirdweb-dev/sdk@3.0.3

## 3.0.2

### Patch Changes

- Updated dependencies [[`42c79e9`](https://github.com/thirdweb-dev/js/commit/42c79e93dc958ca46a55d705aeea44ffdbbcc5f6), [`fe8751e`](https://github.com/thirdweb-dev/js/commit/fe8751eeae7ad013b890a8092ddbd091ecbd6708)]:
  - @thirdweb-dev/sdk@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [[`98dd64a`](https://github.com/thirdweb-dev/js/commit/98dd64a375c302a879aab3c628ecfb84b4dd19da)]:
  - @thirdweb-dev/sdk@3.0.1

## 3.0.0

### Major Changes

- [#19](https://github.com/thirdweb-dev/js/pull/19) [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - 3.0.0 update

  ## _MAJOR VERSION CHANGE_

  - 85% reduction in package size!
  - Custom contracts are now first class citizens

  [Full changelog](https://blog.thirdweb.com/sdk-major-update/)

  #### Breaking changes:

  1. Hooks now accept custom contracts direclty and handle the logic internally

  before

  ```javascript
  const { contract } = useContract(...)
  const { data: nfts } = useNFTs(contract?.nft)
  const { mutation: claim } = useClaimNFT(contract?.nft)
  ```

  after

  ```javascript
  const { contract } = useContract(...)
  // works with any ERC721/ERC1155 contract
  const { data: nfts} = useNFTs(contract)
  const { mutation: claim } = useClaimNFT(contract)
  ```

  2. Custom contract hooks for reading and writing have been renamed:

  before

  ```javascript
  const { contract } = useContract(...)
  const { data } = useContractData(contract, "myReadFunction", ...args);
  const { mutate: myFunction } = useContractCall(contract, "myWriteFunction");
  ```

  after

  ```javascript
  const { contract } = useContract(...)
  const { data } = useContractRead(contract, "myReadFunction", ...args);
  const { mutate: myFunction } = useContractWrite(contract, "myWriteFunction");
  ```

  3. Web3Button benefits from the new Extension detection API:

  before

  ```jsx
  <Web3Button
    contractAddress={...}
    action={(contract) => contract.nft?.drop?.claim?.to(...)}
    >
    Claim
    </Web3Button>
  ```

  after

  ```jsx
  <Web3Button
    contractAddress={...}
    action={(contract) => contract.erc721.claim(...) }
    >
    Claim
    </Web3Button>
  ```

### Minor Changes

- [#106](https://github.com/thirdweb-dev/js/pull/106) [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe) Thanks [@jnsdls](https://github.com/jnsdls)! - switch all contracts to a new, universal `useContract()` hook

### Patch Changes

- [#109](https://github.com/thirdweb-dev/js/pull/109) [`f7ccc30`](https://github.com/thirdweb-dev/js/commit/f7ccc30f9da9bda8759c66e53bf2efdb4f975bf9) Thanks [@adam-maj](https://github.com/adam-maj)! - Add enabled check to useUser

- [#114](https://github.com/thirdweb-dev/js/pull/114) [`1df2dea`](https://github.com/thirdweb-dev/js/commit/1df2dea18f85f6760040c9000f2eb8aee8a6011b) Thanks [@jnsdls](https://github.com/jnsdls)! - only show deprecation method once & add optimism kovan and arbitrum rinkeby to deprecated networks

- [#91](https://github.com/thirdweb-dev/js/pull/91) [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Add arbitrum and optimism goerli; rename testnets

- Updated dependencies [[`a70b590`](https://github.com/thirdweb-dev/js/commit/a70b590be1efa7c0ad93a724afb24870439558ed), [`a37bc00`](https://github.com/thirdweb-dev/js/commit/a37bc00991bf1a359f5f8aa8e24e2c388dcd99d8), [`b442c97`](https://github.com/thirdweb-dev/js/commit/b442c970808f6cb7457d29542bd826dba711579c), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397), [`5a5bc36`](https://github.com/thirdweb-dev/js/commit/5a5bc361507bd8707dc12e9000bb9a218221cf61), [`820a519`](https://github.com/thirdweb-dev/js/commit/820a5191b5e7af5aba5e4d1cc90cd895c0dade11), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b)]:
  - @thirdweb-dev/sdk@3.0.0

## 2.9.7

### Patch Changes

- Updated dependencies [[`baa87a1`](https://github.com/thirdweb-dev/js/commit/baa87a1fbd7eee24ce9a95e16028de8435f85e69), [`f2bdf47`](https://github.com/thirdweb-dev/js/commit/f2bdf47b4fd06433be367c9aac6d11a8dbbf1a1a), [`4079326`](https://github.com/thirdweb-dev/js/commit/407932680fb024f17f12f578aa22c7f8c0c13339), [`05353fd`](https://github.com/thirdweb-dev/js/commit/05353fd8da82f77fb642bb38a533fb99801aed30)]:
  - @thirdweb-dev/sdk@2.4.9
  - @thirdweb-dev/storage@0.2.8

## 2.9.6

### Patch Changes

- [#61](https://github.com/thirdweb-dev/js/pull/61) [`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6) Thanks [@jnsdls](https://github.com/jnsdls)! - fix versions in dependencies before releasing stable

- Updated dependencies [[`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6)]:
  - @thirdweb-dev/sdk@2.4.8
  - @thirdweb-dev/storage@0.2.7

## 2.9.5

### Patch Changes

- Updated dependencies [[`6ba9cad`](https://github.com/thirdweb-dev/js/commit/6ba9cad8d8b933256599dc3b147601cd4828c89b)]:
  - @thirdweb-dev/sdk@2.4.7

## 2.9.4

### Patch Changes

- [`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117) Thanks [@jnsdls](https://github.com/jnsdls)! - bump versions again

- Updated dependencies [[`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117)]:
  - @thirdweb-dev/sdk@2.4.6
  - @thirdweb-dev/storage@0.2.6

## 2.9.3

### Patch Changes

- [`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c) Thanks [@jnsdls](https://github.com/jnsdls)! - release-all-packages

- Updated dependencies [[`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c)]:
  - @thirdweb-dev/sdk@2.4.5
  - @thirdweb-dev/storage@0.2.5

## 2.9.2

### Patch Changes

- Updated dependencies [[`924247a`](https://github.com/thirdweb-dev/js/commit/924247a8ed5ef1867dccfad9479b00f71795ebf6)]:
  - @thirdweb-dev/storage@0.2.4
  - @thirdweb-dev/sdk@2.4.4

## 2.9.1

### Patch Changes

- [#50](https://github.com/thirdweb-dev/js/pull/50) [`c903ca8`](https://github.com/thirdweb-dev/js/commit/c903ca8af97a57a5f549d858ad7192388615730c) Thanks [@jnsdls](https://github.com/jnsdls)! - apply (sane) sandboxing to `<MediaRenderer />`

- Updated dependencies [[`e59735b`](https://github.com/thirdweb-dev/js/commit/e59735b6a2cdcfb660d7bdb16a038f64bd28ca74), [`2eb7e94`](https://github.com/thirdweb-dev/js/commit/2eb7e945b14fd47fc46408d90499888c1f87ca94)]:
  - @thirdweb-dev/sdk@2.4.3

## 2.9.0

### Minor Changes

- [#42](https://github.com/thirdweb-dev/js/pull/42) [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851) Thanks [@jnsdls](https://github.com/jnsdls)! - remove `functionName` + `params` option from `<Web3Button>` - use `action={...}` instead

### Patch Changes

- [#45](https://github.com/thirdweb-dev/js/pull/45) [`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19) Thanks [@jnsdls](https://github.com/jnsdls)! - switch back to preconstruct for building

- [#46](https://github.com/thirdweb-dev/js/pull/46) [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83) Thanks [@jnsdls](https://github.com/jnsdls)! - imrprove babel & tsconfig settings

- [#42](https://github.com/thirdweb-dev/js/pull/42) [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851) Thanks [@jnsdls](https://github.com/jnsdls)! - switch build to tsup

- [#34](https://github.com/thirdweb-dev/js/pull/34) [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95) Thanks [@jnsdls](https://github.com/jnsdls)! - add e2e tests

- Updated dependencies [[`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19), [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83), [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95)]:
  - @thirdweb-dev/sdk@2.4.2
  - @thirdweb-dev/storage@0.2.3

## 2.8.1

### Patch Changes

- 02c2b52: force version
- Updated dependencies [02c2b52]
  - @thirdweb-dev/sdk@2.4.1
  - @thirdweb-dev/storage@0.2.2

## 2.8.0

### Minor Changes

- 3abe26c: initialze monorepo packages

### Patch Changes

- Updated dependencies [3abe26c]
  - @thirdweb-dev/sdk@2.4.0
  - @thirdweb-dev/storage@0.2.0

## 2.7.5

### Patch Changes

- d0a7368: mark old contract hooks as deprecated (use `useContract()` instead)
- d4abb09: Add support for Binance chains (BSC)
- 86e3b58: use storage helpers from @thirdweb-dev/storage
- cb439a9: useTotalCount always returns unclaimed and claimed tokens
- 7fa920e: `<Web3Button />` now accepts `action` instead of `callable`
- Updated dependencies [d4abb09]
- Updated dependencies [274afb5]
- Updated dependencies [86e3b58]
- Updated dependencies [86e3b58]
- Updated dependencies [0c78b16]
  - @thirdweb-dev/sdk@2.3.43
  - @thirdweb-dev/storage@0.1.1
