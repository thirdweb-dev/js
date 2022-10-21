# @thirdweb-dev/sdk

## 3.4.0

### Patch Changes

- [#337](https://github.com/thirdweb-dev/js/pull/337) [`340605b`](https://github.com/thirdweb-dev/js/commit/340605b507f384fbd2999b9c16542af3c53e84a9) Thanks [@adam-maj](https://github.com/adam-maj)! - Clean native token address in listing

- [#342](https://github.com/thirdweb-dev/js/pull/342) [`26116a6`](https://github.com/thirdweb-dev/js/commit/26116a6f637ee845f7bd17f20ffe17caf184658e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add new univeral RPC urls

- [#335](https://github.com/thirdweb-dev/js/pull/335) [`15f8006`](https://github.com/thirdweb-dev/js/commit/15f8006e1fb22333b7ee239b45e7b1b12d6dccc8) Thanks [@adam-maj](https://github.com/adam-maj)! - Export smart contract

- [#327](https://github.com/thirdweb-dev/js/pull/327) [`ef27aad`](https://github.com/thirdweb-dev/js/commit/ef27aad0aafc4577e85f44dc77dfbe880bd239b5) Thanks [@jnsdls](https://github.com/jnsdls)! - enable e2e testing

- Updated dependencies [[`ef27aad`](https://github.com/thirdweb-dev/js/commit/ef27aad0aafc4577e85f44dc77dfbe880bd239b5)]:
  - @thirdweb-dev/storage@1.0.6

## 3.3.1

### Patch Changes

- [#332](https://github.com/thirdweb-dev/js/pull/332) [`ad851f7`](https://github.com/thirdweb-dev/js/commit/ad851f7b4d6abb5ab9364ef3dec229f913e18ce5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix for finding addresses in legacy merkle tree format

- [#330](https://github.com/thirdweb-dev/js/pull/330) [`6218c88`](https://github.com/thirdweb-dev/js/commit/6218c885842e6b4e44ec38ec92a9211e56c49bf4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix deploying contracts with non-32 bytes parameters like bytes4

## 3.3.0

### Minor Changes

- [#315](https://github.com/thirdweb-dev/js/pull/315) [`89ff921`](https://github.com/thirdweb-dev/js/commit/89ff921a7d9f0e42b4e6707c8b56d0aab95c1aa0) Thanks [@furqanrydhan](https://github.com/furqanrydhan)! - fixing vite, multihash moved to non lazy load + cbor-x instead of cbor-web

- [#321](https://github.com/thirdweb-dev/js/pull/321) [`a57b4f0`](https://github.com/thirdweb-dev/js/commit/a57b4f01f3a49590b897101f2730582e4124a554) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SDK] Implement sharded merkle trees for lightweight allowlist checks

  **Behavior change**

  We've made allowlists much more performant using sharded merkle trees. This allows us to process large allowlists (1M+) efficiently.

  To support those large allowlists, fetching claim conditions does not fetch the allowlist data by default anymore. Instead, you can pass an options object to additionally fetch the allowlist data along with the rest of the claim conditions data.

  This affects `ClaimConditions.getActive()` and `ClaimConditions.getAll()`

  Examples:

  ```ts
  const activeClaimCondition =
    await contract.erc721.claimConditions.getActive();
  // `activeClaimCondition.snapshot` is undefined
  const activeclaimConditionWithtAllowList =
    await contract.erc721.claimConditions.getActive({
      withAllowList: true,
    });
  // `activeClaimCondition.snapshot` returns the allowlist data
  ```

### Patch Changes

- [#326](https://github.com/thirdweb-dev/js/pull/326) [`126752d`](https://github.com/thirdweb-dev/js/commit/126752d7d02c9a808a63fb9e67a9df6658b5682b) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - expose fn to get ipfs hash from bytecote publicly

- [#328](https://github.com/thirdweb-dev/js/pull/328) [`df74340`](https://github.com/thirdweb-dev/js/commit/df74340fa51323304c32419761d6f18628b060fa) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update cbor-x import to work with es2018 builds (embeds)

- Updated dependencies [[`87fd6ab`](https://github.com/thirdweb-dev/js/commit/87fd6ab14e1a67a1b12e72bd397fb21769537307)]:
  - @thirdweb-dev/storage@1.0.5

## 3.2.6

### Patch Changes

- [#317](https://github.com/thirdweb-dev/js/pull/317) [`4f867e1`](https://github.com/thirdweb-dev/js/commit/4f867e15edbe5757afbf54cab207458711a8986c) Thanks [@adam-maj](https://github.com/adam-maj)! - Add supply to nft.get

- [#312](https://github.com/thirdweb-dev/js/pull/312) [`b6eec61`](https://github.com/thirdweb-dev/js/commit/b6eec6146c23b66a3681bbb48b173b9019254214) Thanks [@adam-maj](https://github.com/adam-maj)! - Add quantity to mint additional supply

- [#310](https://github.com/thirdweb-dev/js/pull/310) [`9727502`](https://github.com/thirdweb-dev/js/commit/9727502eb30ac139382b7c7c8e8fc0967cbfbcf1) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - [SOL] - add useMintNFTSupply hook in react and accomodate inputs for it in SDK

- [#307](https://github.com/thirdweb-dev/js/pull/307) [`782b58d`](https://github.com/thirdweb-dev/js/commit/782b58d3f6a3b49ff9b3d837551db5161f96171a) Thanks [@kumaryash90](https://github.com/kumaryash90)! - fix multicall gasless

- [#320](https://github.com/thirdweb-dev/js/pull/320) [`f41a443`](https://github.com/thirdweb-dev/js/commit/f41a443c5785240197607b5bf93ff18a1c8e8307) Thanks [@adam-maj](https://github.com/adam-maj)! - Add update creators and update royalty

- [#313](https://github.com/thirdweb-dev/js/pull/313) [`f45ef62`](https://github.com/thirdweb-dev/js/commit/f45ef62128cfefe06275a38440c90d45e9f3cef7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Return default metadata when failing to fetch a given tokenId on NFT contracts

- [#319](https://github.com/thirdweb-dev/js/pull/319) [`2f8ec89`](https://github.com/thirdweb-dev/js/commit/2f8ec89c4c83ae577092c840c198e6fcfb114e69) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose total claimed and unclaimed supply for erc721 drop contracts

- [#322](https://github.com/thirdweb-dev/js/pull/322) [`b7cd744`](https://github.com/thirdweb-dev/js/commit/b7cd744cd0482a6c3fe5ae0c858f20cd380d4114) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Allow signing multiple claims at once

- [#306](https://github.com/thirdweb-dev/js/pull/306) [`53c6507`](https://github.com/thirdweb-dev/js/commit/53c65076696a43bd9a7e58a7493d4e65c172900f) Thanks [@adam-maj](https://github.com/adam-maj)! - Add contract deploy listener

## 3.2.5

### Patch Changes

- [#303](https://github.com/thirdweb-dev/js/pull/303) [`712b11a`](https://github.com/thirdweb-dev/js/commit/712b11a43e389ae10b7f09648779a69c05b2c913) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Fix getting real NFT owners

## 3.2.4

## 3.2.3

## 3.2.2

### Patch Changes

- [#289](https://github.com/thirdweb-dev/js/pull/289) [`521a49c`](https://github.com/thirdweb-dev/js/commit/521a49c6ec6a73068adcfbc1d94d2f3f17afae86) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Standarize useClaimNFT to evm

- [#293](https://github.com/thirdweb-dev/js/pull/293) [`8b3b97c`](https://github.com/thirdweb-dev/js/commit/8b3b97c8f7b3710ce62ed86cfeb4f6de3c23d559) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Fix getAllClaimed for NFT Drops

- [#286](https://github.com/thirdweb-dev/js/pull/286) [`25a4773`](https://github.com/thirdweb-dev/js/commit/25a4773bba406f4e270ac86e68c5266d24c08330) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Add pagination for nftCollection.getAll()

- [#269](https://github.com/thirdweb-dev/js/pull/269) [`b2cadf1`](https://github.com/thirdweb-dev/js/commit/b2cadf164cfe9fb27081df7530356baf70ec2b3a) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - remove deprecated chains from support

- [#263](https://github.com/thirdweb-dev/js/pull/263) [`d6bb61b`](https://github.com/thirdweb-dev/js/commit/d6bb61b7fac759fff7d6293edd46f693f5a7889c) Thanks [@jnsdls](https://github.com/jnsdls)! - [Solana] - align `getProgram` with `getContract` from EVM

- [#297](https://github.com/thirdweb-dev/js/pull/297) [`78d6d3c`](https://github.com/thirdweb-dev/js/commit/78d6d3c15968a449924b3f24354e151a90e4b20d) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - fix getAddress to return undefined if wallet is not connected

- [#294](https://github.com/thirdweb-dev/js/pull/294) [`89d87a5`](https://github.com/thirdweb-dev/js/commit/89d87a5eb31e78e68e097718e9ae6e4c4d101868) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - batch uploads for NFT drop to satisfy solana size limits

- [#270](https://github.com/thirdweb-dev/js/pull/270) [`41507d3`](https://github.com/thirdweb-dev/js/commit/41507d32a78c556f50c88de81c4d6109b1783c78) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Add to registry when deploying new programs

- [#290](https://github.com/thirdweb-dev/js/pull/290) [`8096c78`](https://github.com/thirdweb-dev/js/commit/8096c78b466a7f5f9c2aac6e2c56a06f9d3a25d6) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - make `claim()` take a typeof `Amount` instead of `number`

- [#273](https://github.com/thirdweb-dev/js/pull/273) [`b1fa171`](https://github.com/thirdweb-dev/js/commit/b1fa17158dcac00265bc8f4d64f1f9708482cdb5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [Solana] Expose maxClaimable for claim conditions and disallow claiming by default

- [#280](https://github.com/thirdweb-dev/js/pull/280) [`18381fa`](https://github.com/thirdweb-dev/js/commit/18381fac73741826934212ac6441842ed42a64a0) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Fix errorneous ERC20 Allowance check

- [#271](https://github.com/thirdweb-dev/js/pull/271) [`df048af`](https://github.com/thirdweb-dev/js/commit/df048af605f449279b01d7352b604e7856ac223c) Thanks [@adam-maj](https://github.com/adam-maj)! - Add auth support to Solana

- [#263](https://github.com/thirdweb-dev/js/pull/263) [`d6bb61b`](https://github.com/thirdweb-dev/js/commit/d6bb61b7fac759fff7d6293edd46f693f5a7889c) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - add chainId getter on contracts

- [#296](https://github.com/thirdweb-dev/js/pull/296) [`cf88795`](https://github.com/thirdweb-dev/js/commit/cf88795376d3110f9d3aa839928d22276904b15a) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - add network to userwallet

- [#285](https://github.com/thirdweb-dev/js/pull/285) [`89b5c6f`](https://github.com/thirdweb-dev/js/commit/89b5c6fe079e4df2cf12cb557aa9784f88c5d159) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Make creating NFTDrop transactions sequential

## 3.2.1

## 3.2.0

### Minor Changes

- [#247](https://github.com/thirdweb-dev/js/pull/247) [`caf9795`](https://github.com/thirdweb-dev/js/commit/caf979537b5acb1610f182c94afa5d95c208ec3f) Thanks [@furqanrydhan](https://github.com/furqanrydhan)! - AppURI detection now enabled

- [#238](https://github.com/thirdweb-dev/js/pull/238) [`6647f70`](https://github.com/thirdweb-dev/js/commit/6647f707bdd050725264a8a74220c11912f68e57) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Unify NFT return types for EVM and Solana

  #### NFT Types are now consistent accross EVM (both ERC721 and ERC1155) and Solana

  This is a transparent upgrade, except for one type change for ERC1155 NFTs

  - nft.id is now of type `string` instead of `BigNumber`
  - edition.supply is now of type `number` instead of `BigNumber`

  This should make it much easer to deal with in applications, instead of having to manipulate BigNumber objects.

  Most people convert BigNumber to strings, which is compatible with this upgrade.

### Patch Changes

- [#257](https://github.com/thirdweb-dev/js/pull/257) [`ba6f450`](https://github.com/thirdweb-dev/js/commit/ba6f45027a6ec11aebb4a1918ab2ba4f88894ede) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - fix permission enumerable export

- [#261](https://github.com/thirdweb-dev/js/pull/261) [`c8261b7`](https://github.com/thirdweb-dev/js/commit/c8261b74b5828ac66ea3a6d7636aa57e40ea1a14) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - align behavior of `useContract()` and `getContract()` across react & sdk to both allow passing optional second params of contract types or ABIs

- [#250](https://github.com/thirdweb-dev/js/pull/250) [`20745f8`](https://github.com/thirdweb-dev/js/commit/20745f8cd603235eb5039e61a39c0959c5860bca) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add check if abi exists on extractFunctionsFromAbi function

- [#252](https://github.com/thirdweb-dev/js/pull/252) [`2ea3f00`](https://github.com/thirdweb-dev/js/commit/2ea3f00c41b5e70d9bb634cd86790890520fc4d6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose a way to update collection settings, pass in upload options to lazyMint

- [#234](https://github.com/thirdweb-dev/js/pull/234) [`9412d41`](https://github.com/thirdweb-dev/js/commit/9412d416832c87ab2c858cb120c6c5de03459c50) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Add burn NFT functionality + misc API refinement

- [#256](https://github.com/thirdweb-dev/js/pull/256) [`d677e9d`](https://github.com/thirdweb-dev/js/commit/d677e9d6341252013762882d25408ea8f93791e5) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - make PermissiosEnumerable feature available

- [#240](https://github.com/thirdweb-dev/js/pull/240) [`e662408`](https://github.com/thirdweb-dev/js/commit/e662408e1936983485936609552f80a56cbed082) Thanks [@jnsdls](https://github.com/jnsdls)! - unify program metadata return type

- [#249](https://github.com/thirdweb-dev/js/pull/249) [`e4b10bc`](https://github.com/thirdweb-dev/js/commit/e4b10bc5bd12178cba8856b60255732123cb7ae5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Update NFT Drop API for claim conditions + multiple fixes

- [#262](https://github.com/thirdweb-dev/js/pull/262) [`028cb78`](https://github.com/thirdweb-dev/js/commit/028cb781252b0050943b14cfdf38132c18753a4b) Thanks [@jnsdls](https://github.com/jnsdls)! - [CORE] - fix HexColor schema

- [#245](https://github.com/thirdweb-dev/js/pull/245) [`1972f3e`](https://github.com/thirdweb-dev/js/commit/1972f3ec0d511fbc17642b2a30852a177092a09e) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - allow burning of drop'd NFTs

- [#236](https://github.com/thirdweb-dev/js/pull/236) [`cac373b`](https://github.com/thirdweb-dev/js/commit/cac373b010ce3be3615a36671b66815a27785061) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - attempt to resolve network more agressively

## 3.1.2

### Patch Changes

- [#191](https://github.com/thirdweb-dev/js/pull/191) [`8239763`](https://github.com/thirdweb-dev/js/commit/82397636f41faa2b44cfe70e75212f0f42291092) Thanks [@mykcryptodev](https://github.com/mykcryptodev)! - Get all offers for a listing

- [#194](https://github.com/thirdweb-dev/js/pull/194) [`27a30e3`](https://github.com/thirdweb-dev/js/commit/27a30e3ffb56dd7fa8412a066bc3ac0977aca8e2) Thanks [@aeither](https://github.com/aeither)! - Add ability to view and update owner of a contract

- [#226](https://github.com/thirdweb-dev/js/pull/226) [`f2a6211`](https://github.com/thirdweb-dev/js/commit/f2a62110c43e7b8f35c86a197730e732f8fcc786) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] shrink size by importing TWProxy\_\_factory individually

- [#232](https://github.com/thirdweb-dev/js/pull/232) [`d26b768`](https://github.com/thirdweb-dev/js/commit/d26b76872a6c85651ee06aa0732ee2967f70db27) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Dynamic imports for anchor programs

- [#182](https://github.com/thirdweb-dev/js/pull/182) [`ba7dcbb`](https://github.com/thirdweb-dev/js/commit/ba7dcbbad8db2b73baf1435f4175d19933cb7d4f) Thanks [@jnebab](https://github.com/jnebab)! - added getMinimumNextBid function in marketplace contract to get the minimum bid a user can place to outbid the previous highest bid

- [#229](https://github.com/thirdweb-dev/js/pull/229) [`9c8a3fb`](https://github.com/thirdweb-dev/js/commit/9c8a3fb6d4520dd6cdf2d1c17f33b764e871599e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Allow passing a quantity to claim, and new claimTo function

- Updated dependencies [[`f2a6211`](https://github.com/thirdweb-dev/js/commit/f2a62110c43e7b8f35c86a197730e732f8fcc786), [`f2a6211`](https://github.com/thirdweb-dev/js/commit/f2a62110c43e7b8f35c86a197730e732f8fcc786)]:
  - @thirdweb-dev/storage@1.0.4
  - @thirdweb-dev/contracts-js@1.1.9

## 3.1.1

### Patch Changes

- [#222](https://github.com/thirdweb-dev/js/pull/222) [`666ff5f`](https://github.com/thirdweb-dev/js/commit/666ff5f694f1e146150ddb9fa3233f00533b6d60) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] expose ThirdwebSDK.fromPrivateKey()

- [#224](https://github.com/thirdweb-dev/js/pull/224) [`0dade96`](https://github.com/thirdweb-dev/js/commit/0dade96d0d2553d25b386d822e534eb7ed0aefa9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [EVM] Ensure that factory/proxy flags are set before deploying via proxy

- [#221](https://github.com/thirdweb-dev/js/pull/221) [`c295a47`](https://github.com/thirdweb-dev/js/commit/c295a47144cd722c6f8861c1ec567b53a05ea0bf) Thanks [@jnsdls](https://github.com/jnsdls)! - fix esm exports

## 3.1.0

### Minor Changes

- [#213](https://github.com/thirdweb-dev/js/pull/213) [`e187d21`](https://github.com/thirdweb-dev/js/commit/e187d21e123a506fac0459da18f2d4fc94abae29) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - new @thirdweb-dev/sdk/solana entrypoint

### Patch Changes

- [#217](https://github.com/thirdweb-dev/js/pull/217) [`3c8f620`](https://github.com/thirdweb-dev/js/commit/3c8f6205e9b49ae9fea1f9629678210c6c9c36e6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Enable proxy deploys for released contracts

- [#206](https://github.com/thirdweb-dev/js/pull/206) [`acbabc8`](https://github.com/thirdweb-dev/js/commit/acbabc8999b2b7b6e0eb89cae97e2f1ef7143501) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Gas override for relayer txns

- [#216](https://github.com/thirdweb-dev/js/pull/216) [`b030a86`](https://github.com/thirdweb-dev/js/commit/b030a866080953bbf4e504ddc41d7050b250d2d7) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Update addresses

## 3.0.8

### Patch Changes

- [#205](https://github.com/thirdweb-dev/js/pull/205) [`ce05bfd`](https://github.com/thirdweb-dev/js/commit/ce05bfd8615a9c79664856bce53de8b43bed5c87) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix Buffer usage in SDK

## 3.0.7

### Patch Changes

- [#199](https://github.com/thirdweb-dev/js/pull/199) [`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix getOwned for signature drop

## 3.0.6

### Patch Changes

- [#195](https://github.com/thirdweb-dev/js/pull/195) [`a80fc97`](https://github.com/thirdweb-dev/js/commit/a80fc97b6a1e72ed46a400b4b602e180947fb870) Thanks [@jnsdls](https://github.com/jnsdls)! - add missing roles for pre-built contracts

- Updated dependencies [[`24f66e3`](https://github.com/thirdweb-dev/js/commit/24f66e38c256f7bd69341b92ba30bd35d14b1caa)]:
  - @thirdweb-dev/storage@1.0.3

## 3.0.5

### Patch Changes

- [#167](https://github.com/thirdweb-dev/js/pull/167) [`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Syntax changes for react native support

- [#174](https://github.com/thirdweb-dev/js/pull/174) [`3b877ba`](https://github.com/thirdweb-dev/js/commit/3b877ba221acfd85f80b99e1bc382055217f0a39) Thanks [@kumaryash90](https://github.com/kumaryash90)! - detect forwarder address for defender

- [#163](https://github.com/thirdweb-dev/js/pull/163) [`b54f95d`](https://github.com/thirdweb-dev/js/commit/b54f95dc906928ff2f9251748f254a16fe1f2cee) Thanks [@adam-maj](https://github.com/adam-maj)! - Use independent JSON types by package

- [#154](https://github.com/thirdweb-dev/js/pull/154) [`f8ab477`](https://github.com/thirdweb-dev/js/commit/f8ab4779bb2d6d66200e1e8fd558e0ac069a2f54) Thanks [@jnsdls](https://github.com/jnsdls)! - Add fiat checkout to nft-drop, edition-drop and signature-drop

- [#162](https://github.com/thirdweb-dev/js/pull/162) [`772f843`](https://github.com/thirdweb-dev/js/commit/772f8431e3a62d0ded62dae90a43e9a7edd5b1a2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Catch gas estimate errors in gasless tx

- [#188](https://github.com/thirdweb-dev/js/pull/188) [`a9ec190`](https://github.com/thirdweb-dev/js/commit/a9ec190ff99d2714cef2500d20ea0f3f73f07be3) Thanks [@adam-maj](https://github.com/adam-maj)! - Update JSON schema in SDKs

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - Switch naming of exported prebuilt contract types back from `<name>Impl` to `<name>` for easier use

- [#161](https://github.com/thirdweb-dev/js/pull/161) [`5345479`](https://github.com/thirdweb-dev/js/commit/534547992243bdd3a77e34ec2b2487b5adab366a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow forcing direct deploys to deploy implementations from release flow

- Updated dependencies [[`493ebf0`](https://github.com/thirdweb-dev/js/commit/493ebf032e82a66006b3d5b68f8eeff1973fc97a), [`b54f95d`](https://github.com/thirdweb-dev/js/commit/b54f95dc906928ff2f9251748f254a16fe1f2cee), [`cfe8bba`](https://github.com/thirdweb-dev/js/commit/cfe8bbafa464a9e768e6d31fbd9dd9760fdced16), [`f4074dd`](https://github.com/thirdweb-dev/js/commit/f4074ddadc9fb6e18dcc9251a936376c3f4a9144), [`d608cea`](https://github.com/thirdweb-dev/js/commit/d608cea1977dd418b6892c1c9368b06b17a9748b), [`3580182`](https://github.com/thirdweb-dev/js/commit/3580182fa903ed7a661444f0daa160c330e62ec5), [`0ccbca7`](https://github.com/thirdweb-dev/js/commit/0ccbca78dce38926ccfd5c902c06adff2f440f42), [`45a400f`](https://github.com/thirdweb-dev/js/commit/45a400fd9287582bfb5f21ab2cb2d7a4332434c5)]:
  - @thirdweb-dev/storage@1.0.2

## 3.0.4

### Patch Changes

- Updated dependencies [[`964add6`](https://github.com/thirdweb-dev/js/commit/964add6f205577298b8f4b9ce7298e5bf09e88e7)]:
  - @thirdweb-dev/storage@1.0.1

## 3.0.3

### Patch Changes

- [#143](https://github.com/thirdweb-dev/js/pull/143) [`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix using external signers with ThirdwebSDKProvider

- [#133](https://github.com/thirdweb-dev/js/pull/133) [`9d74a43`](https://github.com/thirdweb-dev/js/commit/9d74a43aac21448beba63ba4e2637945965a3634) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Make contract events data generic for better DX

- [#135](https://github.com/thirdweb-dev/js/pull/135) [`b234c58`](https://github.com/thirdweb-dev/js/commit/b234c58d44d8322e44b2d2ba87ad4ec7d699e961) Thanks [@jnsdls](https://github.com/jnsdls)! - add a new StaticJsonRpcBatchProvider to stop calling `eth_getChainId` when possible

- Updated dependencies [[`57432d2`](https://github.com/thirdweb-dev/js/commit/57432d21c4c9e880a36c61f4988c60af61ac9d44)]:
  - @thirdweb-dev/storage@1.0.0

## 3.0.2

### Patch Changes

- [#131](https://github.com/thirdweb-dev/js/pull/131) [`42c79e9`](https://github.com/thirdweb-dev/js/commit/42c79e93dc958ca46a55d705aeea44ffdbbcc5f6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix editing releases from the dashboard

- [#124](https://github.com/thirdweb-dev/js/pull/124) [`fe8751e`](https://github.com/thirdweb-dev/js/commit/fe8751eeae7ad013b890a8092ddbd091ecbd6708) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add feature detection for Ownable

## 3.0.1

### Patch Changes

- [#122](https://github.com/thirdweb-dev/js/pull/122) [`98dd64a`](https://github.com/thirdweb-dev/js/commit/98dd64a375c302a879aab3c628ecfb84b4dd19da) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - handle legacy claim method signature in extensions

## 3.0.0

### Major Changes

- [#19](https://github.com/thirdweb-dev/js/pull/19) [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - 3.0.0 update

  ## _MAJOR VERSION CHANGE_

  - 85% reduction in package size!
  - Custom contracts are now first class citizens

  [Full changelog](https://blog.thirdweb.com/sdk-major-update/)

  #### Breaking changes:

  1. Getting contracts is now async. This allows dynamically importing contracts and reduces the weight of the SDK significantly.

  before:

  ```javascript
  const token = sdk.getToken(...)
  const nftDrop = sdk.getNFTDrop(...)
  ```

  after:

  ```javascript
  const token = await sdk.getToken(...)
  const nftDrop = await sdk.getNFTDrop(...)
  ```

  2. New Extension API for custom contracts

  When working with custom contracts using `await sdk.getContract(...)`, we now expose all the convenient high level APIs for each ERC standard top level. Calling a function that is not supported in your contract will give you an error with instructions on how to unlock that functionality.

  before:

  ```javascript
  const contract = await sdk.getContract(...)
  // ERC721 contracts
  const contract.nft?.drop?.claim?.to(...)
  const contract.nft?.drop?.claim?.conditions.set(...)
  // ERC1155 contracts
  const contract.edition?.mint?.to(...)
  // ERC20 contracts
  const contract.token?.burn.tokens(...)
  ```

  after:

  ```javascript
  const contract = await sdk.getContract(...)
  // ERC721 contracts
  const contract.erc721.claimTo(...)
  const contract.erc721.claimConditions.set(...)
  // ERC1155 contracts
  const contract.erc1155.mintTo(...)
  // ERC20 contracts
  const contract.erc20.burn(...)
  ```

### Patch Changes

- [#99](https://github.com/thirdweb-dev/js/pull/99) [`a70b590`](https://github.com/thirdweb-dev/js/commit/a70b590be1efa7c0ad93a724afb24870439558ed) Thanks [@jnsdls](https://github.com/jnsdls)! - do not prompt to deploy again if user rejected the first call

- [#115](https://github.com/thirdweb-dev/js/pull/115) [`a37bc00`](https://github.com/thirdweb-dev/js/commit/a37bc00991bf1a359f5f8aa8e24e2c388dcd99d8) Thanks [@jnsdls](https://github.com/jnsdls)! - add `sales` module to token pre-built contract

- [#111](https://github.com/thirdweb-dev/js/pull/111) [`b442c97`](https://github.com/thirdweb-dev/js/commit/b442c970808f6cb7457d29542bd826dba711579c) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Use Enumerable to getOwned NFTs if no Supply extension found

- [#106](https://github.com/thirdweb-dev/js/pull/106) [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe) Thanks [@jnsdls](https://github.com/jnsdls)! - add "events" to token-drop, make "getBuiltInContract" async properly

- [#91](https://github.com/thirdweb-dev/js/pull/91) [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Add arbitrum and optimism goerli; rename testnets

- [#108](https://github.com/thirdweb-dev/js/pull/108) [`5a5bc36`](https://github.com/thirdweb-dev/js/commit/5a5bc361507bd8707dc12e9000bb9a218221cf61) Thanks [@kumaryash90](https://github.com/kumaryash90)! - function for adding contents to pack

- [#90](https://github.com/thirdweb-dev/js/pull/90) [`820a519`](https://github.com/thirdweb-dev/js/commit/820a5191b5e7af5aba5e4d1cc90cd895c0dade11) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose ERC721/1155Claimable detected extensions

- [#106](https://github.com/thirdweb-dev/js/pull/106) [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe) Thanks [@jnsdls](https://github.com/jnsdls)! - make prebuilt contracts entirely async

- Updated dependencies [[`820a519`](https://github.com/thirdweb-dev/js/commit/820a5191b5e7af5aba5e4d1cc90cd895c0dade11)]:
  - @thirdweb-dev/contracts-js@1.1.8

## 2.4.9

### Patch Changes

- [#74](https://github.com/thirdweb-dev/js/pull/74) [`baa87a1`](https://github.com/thirdweb-dev/js/commit/baa87a1fbd7eee24ce9a95e16028de8435f85e69) Thanks [@nkrishang](https://github.com/nkrishang)! - Updated forwarder address for Goerli

- [#75](https://github.com/thirdweb-dev/js/pull/75) [`4079326`](https://github.com/thirdweb-dev/js/commit/407932680fb024f17f12f578aa22c7f8c0c13339) Thanks [@jnsdls](https://github.com/jnsdls)! - add a default for factory deployments initializer function ("initialize")

- [#71](https://github.com/thirdweb-dev/js/pull/71) [`05353fd`](https://github.com/thirdweb-dev/js/commit/05353fd8da82f77fb642bb38a533fb99801aed30) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow for chain agnostic gasless tx

- Updated dependencies [[`f2bdf47`](https://github.com/thirdweb-dev/js/commit/f2bdf47b4fd06433be367c9aac6d11a8dbbf1a1a)]:
  - @thirdweb-dev/storage@0.2.8

## 2.4.8

### Patch Changes

- [#61](https://github.com/thirdweb-dev/js/pull/61) [`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6) Thanks [@jnsdls](https://github.com/jnsdls)! - fix versions in dependencies before releasing stable

- Updated dependencies [[`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6)]:
  - @thirdweb-dev/contracts-js@1.1.7
  - @thirdweb-dev/storage@0.2.7

## 2.4.7

### Patch Changes

- [#59](https://github.com/thirdweb-dev/js/pull/59) [`6ba9cad`](https://github.com/thirdweb-dev/js/commit/6ba9cad8d8b933256599dc3b147601cd4828c89b) Thanks [@jnsdls](https://github.com/jnsdls)! - move `abis` from top level into `dist` in contracts-js

- Updated dependencies [[`6ba9cad`](https://github.com/thirdweb-dev/js/commit/6ba9cad8d8b933256599dc3b147601cd4828c89b)]:
  - @thirdweb-dev/contracts-js@1.1.6

## 2.4.6

### Patch Changes

- [`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117) Thanks [@jnsdls](https://github.com/jnsdls)! - bump versions again

- Updated dependencies [[`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117)]:
  - @thirdweb-dev/contracts-js@1.1.5
  - @thirdweb-dev/storage@0.2.6

## 2.4.5

### Patch Changes

- [`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c) Thanks [@jnsdls](https://github.com/jnsdls)! - release-all-packages

- Updated dependencies [[`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c)]:
  - @thirdweb-dev/contracts-js@1.1.4
  - @thirdweb-dev/storage@0.2.5

## 2.4.4

### Patch Changes

- Updated dependencies [[`924247a`](https://github.com/thirdweb-dev/js/commit/924247a8ed5ef1867dccfad9479b00f71795ebf6), [`924247a`](https://github.com/thirdweb-dev/js/commit/924247a8ed5ef1867dccfad9479b00f71795ebf6)]:
  - @thirdweb-dev/storage@0.2.4
  - @thirdweb-dev/contracts-js@1.1.3

## 2.4.3

### Patch Changes

- [#49](https://github.com/thirdweb-dev/js/pull/49) [`e59735b`](https://github.com/thirdweb-dev/js/commit/e59735b6a2cdcfb660d7bdb16a038f64bd28ca74) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added ContractEncoder to custom contracts - `contract.encoder`

- [#52](https://github.com/thirdweb-dev/js/pull/52) [`2eb7e94`](https://github.com/thirdweb-dev/js/commit/2eb7e945b14fd47fc46408d90499888c1f87ca94) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for audited Pack contract

- Updated dependencies [[`2eb7e94`](https://github.com/thirdweb-dev/js/commit/2eb7e945b14fd47fc46408d90499888c1f87ca94)]:
  - @thirdweb-dev/contracts-js@1.1.2

## 2.4.2

### Patch Changes

- [#45](https://github.com/thirdweb-dev/js/pull/45) [`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19) Thanks [@jnsdls](https://github.com/jnsdls)! - switch back to preconstruct for building

- [#46](https://github.com/thirdweb-dev/js/pull/46) [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83) Thanks [@jnsdls](https://github.com/jnsdls)! - imrprove babel & tsconfig settings

- [#42](https://github.com/thirdweb-dev/js/pull/42) [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851) Thanks [@jnsdls](https://github.com/jnsdls)! - switch build to tsup

- [#34](https://github.com/thirdweb-dev/js/pull/34) [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95) Thanks [@jnsdls](https://github.com/jnsdls)! - add e2e tests

- [#34](https://github.com/thirdweb-dev/js/pull/34) [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95) Thanks [@jnsdls](https://github.com/jnsdls)! - fix build for CRA and vite builds (replaced `cbor` dependency with `cbor-web`)

- Updated dependencies [[`127bc50`](https://github.com/thirdweb-dev/js/commit/127bc50217139345dd44a09114a9bec2c3ac9e97), [`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19), [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83), [`c52a43c`](https://github.com/thirdweb-dev/js/commit/c52a43c8863052b6d1bc9b8c3e1e86d0e1759d39), [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95)]:
  - @thirdweb-dev/contracts-js@1.1.1
  - @thirdweb-dev/storage@0.2.3

## 2.4.1

### Patch Changes

- 02c2b52: force version
- Updated dependencies [02c2b52]
  - @thirdweb-dev/storage@0.2.2

## 2.4.0

### Minor Changes

- 3abe26c: initialze monorepo packages

### Patch Changes

- Updated dependencies [3abe26c]
  - @thirdweb-dev/contracts-js@1.1.0
  - @thirdweb-dev/storage@0.2.0

## 2.3.43

### Patch Changes

- d4abb09: Add support for Binance chains (BSC)
- 274afb5: make input/output versions of the release metadata schemas
- 86e3b58: use storage helpers from @thirdweb-dev/storage
- 0c78b16: Fix listening to a single contract event
- Updated dependencies [86e3b58]
  - @thirdweb-dev/storage@0.1.1
