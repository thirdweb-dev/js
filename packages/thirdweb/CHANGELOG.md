# thirdweb

## 5.4.0

### Minor Changes

- [#2736](https://github.com/thirdweb-dev/js/pull/2736) [`3847617`](https://github.com/thirdweb-dev/js/commit/3847617f8e5d5dc7e6674b0e55d00256e4af4cb0) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds fromGwei unit converter

- [#2735](https://github.com/thirdweb-dev/js/pull/2735) [`d9cd6f5`](https://github.com/thirdweb-dev/js/commit/d9cd6f5c2a2ea7c1d32bb694eb05d39bb7918fb5) Thanks [@jnsdls](https://github.com/jnsdls)! - added extension support for: Marketplace, ERC1155, ERC721

- [#2711](https://github.com/thirdweb-dev/js/pull/2711) [`14cecc9`](https://github.com/thirdweb-dev/js/commit/14cecc9c75f5923fea623883ba03bdaaf4efb24d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Export `useSendBatchTransaction()` for smart accounts

### Patch Changes

- [#2731](https://github.com/thirdweb-dev/js/pull/2731) [`1d4fdd6`](https://github.com/thirdweb-dev/js/commit/1d4fdd6753c394b8ee325862f3be6c212963cc1c) Thanks [@jnsdls](https://github.com/jnsdls)! - export `ChainMetadata` type from `thirdweb/chains`

- [#2712](https://github.com/thirdweb-dev/js/pull/2712) [`02583f8`](https://github.com/thirdweb-dev/js/commit/02583f857e0b4bb6bbd6641bbf7abd6c90b3fddc) Thanks [@jnsdls](https://github.com/jnsdls)! - fix `watchBlockNumber` polling when fully unsubscribing and later re-subscribing

## 5.3.1

### Patch Changes

- [#2701](https://github.com/thirdweb-dev/js/pull/2701) [`703cb6a`](https://github.com/thirdweb-dev/js/commit/703cb6ae3cc51fa4b0ba7c87f09f8e84dab8ed3f) Thanks [@jnsdls](https://github.com/jnsdls)! - updated dependencies

- [#2704](https://github.com/thirdweb-dev/js/pull/2704) [`7a9a086`](https://github.com/thirdweb-dev/js/commit/7a9a086cdc0eecc858c5b6314a6b50d7e7040f43) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Export ERC721 event: TokensLazyMintedEvent

## 5.3.0

### Minor Changes

- [#2697](https://github.com/thirdweb-dev/js/pull/2697) [`c2eba49`](https://github.com/thirdweb-dev/js/commit/c2eba49112d60027ee3dbd8e67452e5d98bd3362) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Deprecate `embeddedWallet` in favor of `inAppWallet` (same functionality)

### Patch Changes

- [#2689](https://github.com/thirdweb-dev/js/pull/2689) [`740a675`](https://github.com/thirdweb-dev/js/commit/740a675a404f8d13d50052aa751f4c013d35d528) Thanks [@jnsdls](https://github.com/jnsdls)! - ---

  ## Marketplace Extensions

  Added initial support for the Marketplace extensions, available via the `thirdweb/extensions/marketplace` module.

  ### Direct Listings

  #### Write

  - `createListing`

  #### Read

  - `totalListings`
  - `getListing`
  - `getAllListings`
  - `getAllValidListings`

  #### Events

  - `buyerApprovedForListingEvent`
  - `cancelledListingEvent`
  - `currencyApprovedForListingEvent`
  - `newListingEvent`
  - `newSaleEvent`
  - `updatedListingEvent`

  ### English Auctions

  #### Write

  - `createAuction`

  #### Read

  - `totalAuctions`
  - `getAuction`
  - `getAllAuctions`
  - `getAllValidAuctions`

  #### Events

  - `auctionClosedEvent`
  - `cancelledAuctionEvent`
  - `newAuctionEvent`
  - `newBidEvent`

  ### Types

  - `DirectListing`
  - `EnglishAuction`

  ## ERC721 Extensions

  - Added `isERC721` to the `thirdweb/extensions/erc721` module.

  ## ERC1155 Extensions

  - Added `isERC1155` to the `thirdweb/extensions/erc1155` module.

- [#2700](https://github.com/thirdweb-dev/js/pull/2700) [`f709f13`](https://github.com/thirdweb-dev/js/commit/f709f136a71575eeb16db852103510daca9433f1) Thanks [@jnsdls](https://github.com/jnsdls)! - ENS: add support for `resolveName()`, `resolveAvatar()` and `resolveText()`

- [#2686](https://github.com/thirdweb-dev/js/pull/2686) [`a2423ca`](https://github.com/thirdweb-dev/js/commit/a2423cac70cbeacbdc29494b9df9486e96aa73df) Thanks [@MananTank](https://github.com/MananTank)! - Add `modalSize` prop on `ConnectEmbed` to allow `"wide"` modal size.

- [#2684](https://github.com/thirdweb-dev/js/pull/2684) [`4504a8d`](https://github.com/thirdweb-dev/js/commit/4504a8d17020ee46fa813a3c012c35c651663ce4) Thanks [@MananTank](https://github.com/MananTank)! - Fix sourcemap warnings in CRA

- [#2677](https://github.com/thirdweb-dev/js/pull/2677) [`0e479e2`](https://github.com/thirdweb-dev/js/commit/0e479e2082fd685c9b8cae7d1cad53cade65de18) Thanks [@farhanW3](https://github.com/farhanW3)! - added 50k overhead to userOp gas estimations

## 5.2.0

### Minor Changes

- [#2667](https://github.com/thirdweb-dev/js/pull/2667) [`44d9630`](https://github.com/thirdweb-dev/js/commit/44d96309d5dd069fac5968f2708d555c4453fcfa) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - API update for ethers5 and ethers5 adapters:

  - Now all adapter functions take a singular object
  - ethers5: fixed adapted signer not containing a provider by default
  - ethers5: added support for sign typed data

- [#2674](https://github.com/thirdweb-dev/js/pull/2674) [`97a31f5`](https://github.com/thirdweb-dev/js/commit/97a31f57cee822cb26339e1fbfc80909d1ee6508) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add `useSendAndConfirmTransaction` hook

### Patch Changes

- [#2666](https://github.com/thirdweb-dev/js/pull/2666) [`127c476`](https://github.com/thirdweb-dev/js/commit/127c476cff1b5f7e67224dff3ed49ea2cbd93027) Thanks [@gregfromstl](https://github.com/gregfromstl)! - fix getAddresses for accounts converted to viem

- [#2637](https://github.com/thirdweb-dev/js/pull/2637) [`367576c`](https://github.com/thirdweb-dev/js/commit/367576ca00470a4b9a39c6fb748545d565d7c353) Thanks [@MananTank](https://github.com/MananTank)! - - Always start a new session when calling `wallet.connect` for WalletConnect
  - Fix JSDoc for `useConnectedWallets`
  - Add `accountsChanged` event back to `Wallet`
  - `wallet.disconnect` method cleanups

## 5.1.1

### Patch Changes

- [#2636](https://github.com/thirdweb-dev/js/pull/2636) [`c508751`](https://github.com/thirdweb-dev/js/commit/c508751f38e0e84710bb3917efe04fa7d868a333) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Optimie encode by caching asyncParams

- [#2662](https://github.com/thirdweb-dev/js/pull/2662) [`e4d243e`](https://github.com/thirdweb-dev/js/commit/e4d243ef34ee7881ecbcc8ef02084105c0ee5a03) Thanks [@jnsdls](https://github.com/jnsdls)! - fix `sendTransaction` within `viemAdapter.walletClient.toViem()`

## 5.1.0

### Minor Changes

- [#2602](https://github.com/thirdweb-dev/js/pull/2602) [`3aaad1e`](https://github.com/thirdweb-dev/js/commit/3aaad1e9bfa978139a4c2092e17d2b93193bb890) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds generateAccount function for generating a random local account

### Patch Changes

- [#2525](https://github.com/thirdweb-dev/js/pull/2525) [`7234e6b`](https://github.com/thirdweb-dev/js/commit/7234e6bc10e9d410b991f76d126e978a77fa203f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Better private-key account support

- [#2626](https://github.com/thirdweb-dev/js/pull/2626) [`e806393`](https://github.com/thirdweb-dev/js/commit/e8063936c91724e540bd7a20c90e480a1f86dabe) Thanks [@jnsdls](https://github.com/jnsdls)! - fix wallet connect uri parsing

- [#2632](https://github.com/thirdweb-dev/js/pull/2632) [`d89f009`](https://github.com/thirdweb-dev/js/commit/d89f009f14fc3500a05dcc21f6b7f688dfe81db4) Thanks [@MananTank](https://github.com/MananTank)! - Various Improvements for wallet connection

  - change `accountsChanged` event to `accountChanged` event and emit new `Account` object instead of creating it in the connection manager
  - WalletConnect connection improvements

- [#2610](https://github.com/thirdweb-dev/js/pull/2610) [`213f313`](https://github.com/thirdweb-dev/js/commit/213f31303409698d93e5da6eea22df6833512107) Thanks [@dependabot](https://github.com/apps/dependabot)! - build(deps): bump viem from 2.9.5 to 2.9.6

- [#2606](https://github.com/thirdweb-dev/js/pull/2606) [`0394eb2`](https://github.com/thirdweb-dev/js/commit/0394eb22bf5256e8e66c664834c0e7e8fe638bb4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add ERC4337 extensions

- [#2631](https://github.com/thirdweb-dev/js/pull/2631) [`1c29556`](https://github.com/thirdweb-dev/js/commit/1c29556f146b7c8ea28ed193b4d04e7099a9363e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Get userOp prices from bundler

## 5.0.3

### Patch Changes

- [#2595](https://github.com/thirdweb-dev/js/pull/2595) [`dd1141f`](https://github.com/thirdweb-dev/js/commit/dd1141f9af002817fb4fd4c002f5d77fde4ac950) Thanks [@MananTank](https://github.com/MananTank)! - Do not subscribe to `session_request_sent` event when using `walletConnect` because that is already handled when connecting with official Modal

- [#2591](https://github.com/thirdweb-dev/js/pull/2591) [`6d63920`](https://github.com/thirdweb-dev/js/commit/6d63920c0a25a395fed091f749e6e5438dce0b5d) Thanks [@MananTank](https://github.com/MananTank)! - Add `walletConnect`, fix WC connection issues

- [#2588](https://github.com/thirdweb-dev/js/pull/2588) [`eba8f1c`](https://github.com/thirdweb-dev/js/commit/eba8f1c19839ad89391d03271ef96b51d5f515ed) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix 721/1155 claimTo

## 5.0.2

### Patch Changes

- [#2585](https://github.com/thirdweb-dev/js/pull/2585) [`052892b`](https://github.com/thirdweb-dev/js/commit/052892b39677755b3167da7520d48446a5ce7c59) Thanks [@MananTank](https://github.com/MananTank)! - Fix wallet not opened on WC sessions request event on page reload on mobile

- [#2587](https://github.com/thirdweb-dev/js/pull/2587) [`6063f40`](https://github.com/thirdweb-dev/js/commit/6063f40f87b2a108840cb08e1e9025542931b7e0) Thanks [@jnsdls](https://github.com/jnsdls)! - [CLI] - fix execution on windows and when prettier is not installed

## 5.0.1

### Patch Changes

- [#2572](https://github.com/thirdweb-dev/js/pull/2572) [`701cd88`](https://github.com/thirdweb-dev/js/commit/701cd880dfc81cf294bb48a23996b2dc737c3d4b) Thanks [@jnsdls](https://github.com/jnsdls)! - point CLI backwards compatibility @latest instead of @beta

- [#2576](https://github.com/thirdweb-dev/js/pull/2576) [`04961f0`](https://github.com/thirdweb-dev/js/commit/04961f0e9a333f9626519d726006def9fb67d7db) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Change getWalletBalance prop from account to address

- [#2577](https://github.com/thirdweb-dev/js/pull/2577) [`d93286b`](https://github.com/thirdweb-dev/js/commit/d93286bc1f8224d055b50ce3ffa4f302869cb2b1) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

## 5.0.0

### Major Changes

- [#2356](https://github.com/thirdweb-dev/js/pull/2356) [`01fd523`](https://github.com/thirdweb-dev/js/commit/01fd5237f524302f4dc63bd4e106f24dcc520e94) Thanks [@jnsdls](https://github.com/jnsdls)! - Initial release of v5 of the thirdweb SDK.

  For more information please refer to the [documentation](https://portal.thirdweb.com/typescript/v5) and the [migration guide](https://portal.thirdweb.com/typescript/v5/migrate).

### Patch Changes

- [#2566](https://github.com/thirdweb-dev/js/pull/2566) [`c63d9ea`](https://github.com/thirdweb-dev/js/commit/c63d9ea7acdea12a6ce0f5e2bde139fe26887df5) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Verification status in progress
