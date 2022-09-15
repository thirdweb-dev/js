# @thirdweb-dev/react

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
