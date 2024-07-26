# thirdweb

## 5.40.0

### Minor Changes

- [#3750](https://github.com/thirdweb-dev/js/pull/3750) [`4a4a061`](https://github.com/thirdweb-dev/js/commit/4a4a0612ed6976268d35605b6cd94b077e40c25a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New PayEmbed modes and revamp TransactionButton flow

  You can now configure the PayEmbed component to build 3 different flows:

  - Fund wallets: Inline component that allows users to buy any currency. (default)

  ```tsx
  <PayEmbed
    client={client}
    payOptions={{
      mode: "fund_wallet",
    }}
  />
  ```

  - Direct payments: Take payments from Fiat or Crypto directly to your seller wallet.

  ```tsx
  <PayEmbed
    client={client}
    payOptions={{
      mode: "direct_payment",
      paymentInfo: {
        sellerAddress: "0x...",
        chain: base,
        amount: "0.1",
      },
      metadata: {
        name: "Black Hoodie (Size L)",
        image: "https://example.com/image.png",
      },
    }}
  />
  ```

  - Transaction payments: Let your users pay for onchain transactions with fiat or crypto on any chain.

  ```tsx
  <PayEmbed
    client={client}
    payOptions={{
      mode: "transaction",
      transaction: claimTo({
        contract,
        tokenId: 0n,
        to: toAddress,
      }),
      metadata: nft?.metadata,
    }}
  />
  ```

  You can also configure the TransactionButton component to show metadata to personalize the transaction payment flow:

  ```tsx
  <TransactionButton
    transaction={() => {
      return transfer({
        contract,
        amount: 10n,
        to: toAddress,
      });
    }}
    payModal={{
      metadata: {
        name: "Buy me a coffee",
        image: "https://example.com/image.png",
      },
    }}
  />
  ```

- [#3822](https://github.com/thirdweb-dev/js/pull/3822) [`3848327`](https://github.com/thirdweb-dev/js/commit/3848327373e49aa83c5902e6a16d5b8e96cf1eeb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to open OAuth windows as a redirect. This is useful for embedded applications such as telegram web apps.

  Be sure to include your domain in the allowlisted domains for your client ID.

  ```ts
  import { inAppWallet } from "thirdweb/wallets";
  const wallet = inAppWallet({
    auth: {
      mode: "redirect",
    },
  });
  ```

### Patch Changes

- [#3813](https://github.com/thirdweb-dev/js/pull/3813) [`6081ac7`](https://github.com/thirdweb-dev/js/commit/6081ac7b18878812d55d945caaf0d9c3dd884b8b) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose types: NFTInput and NFTMetadata

- [#3815](https://github.com/thirdweb-dev/js/pull/3815) [`87dc9a5`](https://github.com/thirdweb-dev/js/commit/87dc9a5f90685b0c1015bd4d07ab356c104a2726) Thanks [@MananTank](https://github.com/MananTank)! - Allow clicking on other wallet when a wallet is connected and sign in is required in `ConnectEmbed` component.

## 5.39.0

### Minor Changes

- [#3785](https://github.com/thirdweb-dev/js/pull/3785) [`105e523`](https://github.com/thirdweb-dev/js/commit/105e523ce4cddbd343ac8c06fb9f234fb3a8b4f6) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add ClaimButton for claiming tokens from all thirdweb Drop contracts

  Higher level abstraction to claim tokens from all thirdweb Drop contracts

  ```tsx
  import { ClaimButton } from "thirdweb/react";
  import { ethereum } from "thirdweb/chains";

  <ClaimButton
    contractAddress="0x..."
    chain={ethereum}
    client={client}
    claimParams={{
      type: "ERC721",
      quantity: 1n,
    }}
  >
    Claim now
  </ClaimButton>;
  ```

### Patch Changes

- [#3792](https://github.com/thirdweb-dev/js/pull/3792) [`5fabe66`](https://github.com/thirdweb-dev/js/commit/5fabe6661399615b393d1055a722b9de59bf19bb) Thanks [@MananTank](https://github.com/MananTank)! - handle `null` value of `effectiveGasPrice` in `sendTransaction` method of `toEthersSigner` adapter that throws error when trying to convert to BigNumber. This is causing issue in XDC Network (chain Id 50) and XDC Apothem testnet (chain id 51)

- [#3804](https://github.com/thirdweb-dev/js/pull/3804) [`cb616f7`](https://github.com/thirdweb-dev/js/commit/cb616f75ed38fac2be243163f0139e5cbb9892be) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix gas estimation on arbitrum sepolia

- [#3524](https://github.com/thirdweb-dev/js/pull/3524) [`8599fbf`](https://github.com/thirdweb-dev/js/commit/8599fbf4e008de64c6118193c411b6d3b0810790) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Modular contracts deployment setup

- [#3782](https://github.com/thirdweb-dev/js/pull/3782) [`c82c524`](https://github.com/thirdweb-dev/js/commit/c82c524e139d7960794e08bca838a1a1b78a3532) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow overriding nonce for smart accounts

- [#3801](https://github.com/thirdweb-dev/js/pull/3801) [`a51f53f`](https://github.com/thirdweb-dev/js/commit/a51f53f531adedc355624fb89d2d50767a9fb1a1) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix RPC URL construction for chains

- [#3805](https://github.com/thirdweb-dev/js/pull/3805) [`5c9af85`](https://github.com/thirdweb-dev/js/commit/5c9af853fa7a58ee8c0572e235a5b20f8247297c) Thanks [@jnsdls](https://github.com/jnsdls)! - [performance] - fix rpc client reuse

- [#3796](https://github.com/thirdweb-dev/js/pull/3796) [`c51f785`](https://github.com/thirdweb-dev/js/commit/c51f7857e2363e01371f21487f4a5aa74f6f89f5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle polygon amoy gas station

- [#3800](https://github.com/thirdweb-dev/js/pull/3800) [`b15118a`](https://github.com/thirdweb-dev/js/commit/b15118a34fcfb3ed7b81d6ffea733a2499e5a895) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Minor style fixes on the Connect UI Send Funds page

- [#3791](https://github.com/thirdweb-dev/js/pull/3791) [`9cc9f05`](https://github.com/thirdweb-dev/js/commit/9cc9f05f68654f12ef8f9434a3d7af6fc40ecb18) Thanks [@keyding](https://github.com/keyding)! - Fix bun detection

## 5.38.0

### Minor Changes

- [#3766](https://github.com/thirdweb-dev/js/pull/3766) [`9f555ca`](https://github.com/thirdweb-dev/js/commit/9f555cab0d96f5094ea35efec14a1622a63379af) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add more chains: Astria EVM Dusknet (912559), Blast Sepolia (168587773), Celo (42220), Cronos (25), Degen (666666666), Fantom Testnet (4002), Fantom (250), Frame Tesnet (68840142), Gnosis Chiado Testnet (10200), Gnosis (100), GodWoken (71402), GodWoken Testnet (71401), Hokum Testnet (20482050), Localhost (1337), Loot chain (5151706), Manta Pacific (169), Manta Pacific Testnet (3441005), Moonbeam (1284), Palm Testnet (11297108099), Palm (11297108109), Polygon zkEvm Testnet (1442), Polygon zkEVM (1101), Rari Testnet (1918988905), Rari chain (1380012617), Scroll Alpha Testnet (534353), Scroll Sepolia Testnet (534353), Scroll (534352), Xai Sepolia (37714555429), Xai Mainnet(660279), zk Candy Sepolia (302)

### Patch Changes

- [#3767](https://github.com/thirdweb-dev/js/pull/3767) [`11b2ad0`](https://github.com/thirdweb-dev/js/commit/11b2ad05ad2bd42ecb1e2840796950ec93d6264a) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose roleMap and getRoleHash

- [#3764](https://github.com/thirdweb-dev/js/pull/3764) [`26d825b`](https://github.com/thirdweb-dev/js/commit/26d825bc4f0475523ea761aa18ab979557295c28) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add extension support for Lens Protocol

- [#3779](https://github.com/thirdweb-dev/js/pull/3779) [`d3c8302`](https://github.com/thirdweb-dev/js/commit/d3c83023f8d802d0cae54a27239d5c98668bf4d5) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improved in-app wallet sign-in speed

- [#3769](https://github.com/thirdweb-dev/js/pull/3769) [`a9a3f0f`](https://github.com/thirdweb-dev/js/commit/a9a3f0f423c1ec78c2cc72507f21c5b3ca0d1dbd) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix deterministic deploys with specified versions

- [#3687](https://github.com/thirdweb-dev/js/pull/3687) [`f082af0`](https://github.com/thirdweb-dev/js/commit/f082af0403befffa37a448d41864f1462ede3312) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Fix proxy resolution. Use implementation call in case of beacon.

## 5.37.0

### Minor Changes

- [#3678](https://github.com/thirdweb-dev/js/pull/3678) [`31ee4e5`](https://github.com/thirdweb-dev/js/commit/31ee4e53e2e42ecda3790c7a4bd08f4d5e2c1aaa) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Add discord login as an option of thirdweb in app wallet and ecosystem wallet logins

  ```typescript
  import { inAppWallet } from "thirdweb/wallets";
  const wallet = inAppWallet();
  const account = await wallet.connect({
    client,
    chain,
    strategy: "discord",
  });
  ```

- [#3716](https://github.com/thirdweb-dev/js/pull/3716) [`ec3405b`](https://github.com/thirdweb-dev/js/commit/ec3405b307b95dadd0abe3b40e8cbfe223c48a6b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds Discord login to the React Native SDK

### Patch Changes

- [#3746](https://github.com/thirdweb-dev/js/pull/3746) [`870be08`](https://github.com/thirdweb-dev/js/commit/870be083f747417d437e3b173e92e614b43c5b13) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Update Connect UI tabs styling

- [#3751](https://github.com/thirdweb-dev/js/pull/3751) [`aba1266`](https://github.com/thirdweb-dev/js/commit/aba1266431d020ee7bb8c8c8f2728a97d1161ad5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle minimum amount in buy to crypto flow

- [#3762](https://github.com/thirdweb-dev/js/pull/3762) [`6a94696`](https://github.com/thirdweb-dev/js/commit/6a94696c7e7db3d4e0920e039bdc187ab42e3c50) Thanks [@MananTank](https://github.com/MananTank)! - Fix Wallet switcher icon position in wallet details modal

- [#3661](https://github.com/thirdweb-dev/js/pull/3661) [`c6741b4`](https://github.com/thirdweb-dev/js/commit/c6741b42cd6dcb01bceaf7fc2c2e1c71bd93abd1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle ERC20 transaction value in Pay components

- [#3748](https://github.com/thirdweb-dev/js/pull/3748) [`24bcee2`](https://github.com/thirdweb-dev/js/commit/24bcee24ead355c79c62421353f70c83c3e2f9dc) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix disconnect button color in light mode SIWE react native

- [#3676](https://github.com/thirdweb-dev/js/pull/3676) [`56b34ce`](https://github.com/thirdweb-dev/js/commit/56b34ce197b4e9003d4d8625f0453532137ae8d2) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Allow to add extra call data to `prepareContractCall`

## 5.36.0

### Minor Changes

- [#3718](https://github.com/thirdweb-dev/js/pull/3718) [`6bda057`](https://github.com/thirdweb-dev/js/commit/6bda0573067162384bb2cade88fa2d0bc732be04) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds transaction history page to connect modal UI

### Patch Changes

- [#3730](https://github.com/thirdweb-dev/js/pull/3730) [`db2cadf`](https://github.com/thirdweb-dev/js/commit/db2cadfc4b4838bf3daf6894e437fc32b6300262) Thanks [@MananTank](https://github.com/MananTank)! - Update buffer calculation of transaction if gas estimation fails for Pay Modal

- [#3735](https://github.com/thirdweb-dev/js/pull/3735) [`6cc3038`](https://github.com/thirdweb-dev/js/commit/6cc3038298cb562372dee114cc7e80e65248b09e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add optional 'from' in readContract()

- [#3719](https://github.com/thirdweb-dev/js/pull/3719) [`05df89c`](https://github.com/thirdweb-dev/js/commit/05df89cb614cb40903f27b8904995c9847fd620c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add support for ERC20 paymaster for smart accounts

- [#3728](https://github.com/thirdweb-dev/js/pull/3728) [`0a5af48`](https://github.com/thirdweb-dev/js/commit/0a5af48f70a76fc060909b853e20c927328c31c3) Thanks [@MananTank](https://github.com/MananTank)! - Fix chain with custom RPC not used if the chain object is passed in the `chains` prop to `ConnectButton`, `ConnectEmbed` or `PayEmbed` components.

  This also fixes dashboard not using custom chain's RPC since it passes the chain object via `chains` prop

## 5.35.0

### Minor Changes

- [#3709](https://github.com/thirdweb-dev/js/pull/3709) [`73c74f1`](https://github.com/thirdweb-dev/js/commit/73c74f11d4d3fa1e67f8171228962e6474ae4602) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds fetchProofsERCXX methods

### Patch Changes

- [#3677](https://github.com/thirdweb-dev/js/pull/3677) [`a3fb673`](https://github.com/thirdweb-dev/js/commit/a3fb673e508f2236ebd71e4b50599e542f2ad763) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle universal links on ios for coinbase wallet connection

- [#3708](https://github.com/thirdweb-dev/js/pull/3708) [`1a09f46`](https://github.com/thirdweb-dev/js/commit/1a09f46f246dbcb322fcde84c78895943ecc04f1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support auth in React Native

- [#3689](https://github.com/thirdweb-dev/js/pull/3689) [`6ad65e2`](https://github.com/thirdweb-dev/js/commit/6ad65e234c6ce071c27e18af76720533dbf04a4a) Thanks [@MananTank](https://github.com/MananTank)! - Add `type` prop for `TransactionButton`

- [#3662](https://github.com/thirdweb-dev/js/pull/3662) [`8e1a24a`](https://github.com/thirdweb-dev/js/commit/8e1a24a60eac74923b323f15b73249c4f4f40e7d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add recipient address to PayEmbed

- [#3673](https://github.com/thirdweb-dev/js/pull/3673) [`9f3fb7d`](https://github.com/thirdweb-dev/js/commit/9f3fb7d1eeae91c301745647279c24d451989cc9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix account address override in smart wallet

- [#3694](https://github.com/thirdweb-dev/js/pull/3694) [`817a778`](https://github.com/thirdweb-dev/js/commit/817a778a17d4ccae8a5c46049deb24ed49c92d4b) Thanks [@MananTank](https://github.com/MananTank)! - Fix Network Switcher only showing 1 search result

- [#3681](https://github.com/thirdweb-dev/js/pull/3681) [`3479117`](https://github.com/thirdweb-dev/js/commit/3479117b286ddcd629cf6417eec4e38807317fe9) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Vietnamese locale for ConnectButton components

- [#3707](https://github.com/thirdweb-dev/js/pull/3707) [`f8f6790`](https://github.com/thirdweb-dev/js/commit/f8f6790da7f9a7747a4d4e67eee455f1f045c6b5) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix in-app wallet typed data signatures

- [#3706](https://github.com/thirdweb-dev/js/pull/3706) [`aadbd33`](https://github.com/thirdweb-dev/js/commit/aadbd33e9d696bd7dd77561fa3f3a0a0fa7747f5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Make client and chain mandatory in useWalletBalance

- [#3688](https://github.com/thirdweb-dev/js/pull/3688) [`7e416c0`](https://github.com/thirdweb-dev/js/commit/7e416c0f6b0c9ae42d615ca78aa49e13ae54501c) Thanks [@MananTank](https://github.com/MananTank)! - Add queryOptions for `useWalletBalance` hook

- [#3659](https://github.com/thirdweb-dev/js/pull/3659) [`eabb215`](https://github.com/thirdweb-dev/js/commit/eabb2150a93bdd5a6a1aacae141994f1b148232e) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add support for Zora1155 in ERC1155 > getOwned

- [#3690](https://github.com/thirdweb-dev/js/pull/3690) [`81751d3`](https://github.com/thirdweb-dev/js/commit/81751d3e0882a79611a9b2f2d9e7fbd8c60afbcd) Thanks [@MananTank](https://github.com/MananTank)! - Fix "add custom network" button not closing details modal

- [#3685](https://github.com/thirdweb-dev/js/pull/3685) [`aee7aef`](https://github.com/thirdweb-dev/js/commit/aee7aef76fd23eceed8b83badad5853a23d15b48) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Export utils method: getClaimParams for thirdweb Drop contracts

- [#3712](https://github.com/thirdweb-dev/js/pull/3712) [`c5b9740`](https://github.com/thirdweb-dev/js/commit/c5b97407b06c7255880e2ae483a62d961b7eb065) Thanks [@farhanW3](https://github.com/farhanW3)! - updated getUserOpReceipt & waitForUserOpReceipt to use a decodeRevertReason flag. Updated example for createUnsignedUserOp & signUserOp. Exposed getPaymasterAndData for Paymaster

- [#3704](https://github.com/thirdweb-dev/js/pull/3704) [`baec85f`](https://github.com/thirdweb-dev/js/commit/baec85f6b4f2bbc76aca9e2e0e3624f6aef16437) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix error message not showing on reverts

## 5.34.3

### Patch Changes

- [#3657](https://github.com/thirdweb-dev/js/pull/3657) [`3d14162`](https://github.com/thirdweb-dev/js/commit/3d14162a69eb413e8c3d89c257a3e76fccddf61c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix extension contract detection

## 5.34.2

### Patch Changes

- [#3642](https://github.com/thirdweb-dev/js/pull/3642) [`f239d09`](https://github.com/thirdweb-dev/js/commit/f239d09eaeb09d7f6d1f7f6cfde798b0a2f8143c) Thanks [@kien-ngo](https://github.com/kien-ngo)! - MediaRenderer: only render video poster if it's an image

- [#3656](https://github.com/thirdweb-dev/js/pull/3656) [`77d7dd1`](https://github.com/thirdweb-dev/js/commit/77d7dd135f9515b4d62b1531d376933838f7db50) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix autoconnect for phone number sign in on RN

- [#3655](https://github.com/thirdweb-dev/js/pull/3655) [`9dd7b4d`](https://github.com/thirdweb-dev/js/commit/9dd7b4de79c8cdd06980e637259c05a1a1a963a0) Thanks [@MananTank](https://github.com/MananTank)! - Ensure all wallet's account address is checksum encoded

## 5.34.1

### Patch Changes

- [#3634](https://github.com/thirdweb-dev/js/pull/3634) [`4d24208`](https://github.com/thirdweb-dev/js/commit/4d24208099d459ea2903a504106abd3ddd423966) Thanks [@MananTank](https://github.com/MananTank)! - Fix random behavior when connecting smart wallet where it sometimes does not add the personal wallet in the list of connected wallets

- [#3637](https://github.com/thirdweb-dev/js/pull/3637) [`02fff7d`](https://github.com/thirdweb-dev/js/commit/02fff7d9e83167ae5dd2c8d02f58f0efce2c151c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Loosen react native peer dep version restriction

## 5.34.0

### Minor Changes

- [#3613](https://github.com/thirdweb-dev/js/pull/3613) [`d253bad`](https://github.com/thirdweb-dev/js/commit/d253bad72f0c1eef565b9de23887dc39f745450e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds verifyTypedData and verifyHash functions with full wallet interoperability

- [#3619](https://github.com/thirdweb-dev/js/pull/3619) [`325416e`](https://github.com/thirdweb-dev/js/commit/325416ea19905901f30e795cbf93cb8a085be02f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds blast preset

- [#3585](https://github.com/thirdweb-dev/js/pull/3585) [`f6ff5a7`](https://github.com/thirdweb-dev/js/commit/f6ff5a78fc2d65f0f250b154f1405210ca57ce0a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds NFTs to the connect modal, specified with supportedNFTs

- [#3602](https://github.com/thirdweb-dev/js/pull/3602) [`21aaec8`](https://github.com/thirdweb-dev/js/commit/21aaec802fafa60b0f6ce43d8d2d8c2738f68d63) Thanks [@jnsdls](https://github.com/jnsdls)! - [erc20] - added `transferBatch()` extension

- [#3622](https://github.com/thirdweb-dev/js/pull/3622) [`95c9d3d`](https://github.com/thirdweb-dev/js/commit/95c9d3d92406de619cb1e4cccc61b0766dd2a0d4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose smart wallet and bundler utilities

### Patch Changes

- [#3602](https://github.com/thirdweb-dev/js/pull/3602) [`21aaec8`](https://github.com/thirdweb-dev/js/commit/21aaec802fafa60b0f6ce43d8d2d8c2738f68d63) Thanks [@jnsdls](https://github.com/jnsdls)! - improve <MediaRenderer />

- [#3633](https://github.com/thirdweb-dev/js/pull/3633) [`636fe40`](https://github.com/thirdweb-dev/js/commit/636fe40779ed358e4bc7d628cf68addaa9c2b4c4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix uploading files on mobile with directory

- [#3621](https://github.com/thirdweb-dev/js/pull/3621) [`5470dd9`](https://github.com/thirdweb-dev/js/commit/5470dd9cf854e6a28978c7a31669227c2000a98b) Thanks [@MananTank](https://github.com/MananTank)! - Pay UI improvements

  - Only perform token amount rounding when rendering the amount - not in state
  - increase the rendered decimals for token amount whereever we have enough space available in UI
  - Fix "Minimum required amount" error message for Buy with fiat when token amount is so low that server calculates its value as 0 USD - which prevents calculation of minimum required token amount
  - Show token symbol in Minimum required amount error message

- [#3603](https://github.com/thirdweb-dev/js/pull/3603) [`342d74e`](https://github.com/thirdweb-dev/js/commit/342d74efffe2464d9613b439db69d0420baa8b10) Thanks [@jnsdls](https://github.com/jnsdls)! - export JWT utils, fix naming of `decodeJWT`

- [#3611](https://github.com/thirdweb-dev/js/pull/3611) [`f103a90`](https://github.com/thirdweb-dev/js/commit/f103a902f355bfd92b9732d8178cf95340b85a04) Thanks [@MananTank](https://github.com/MananTank)! - Fix Transaction Button callbacks not called when tx is executed in Pay Modal

- [#3630](https://github.com/thirdweb-dev/js/pull/3630) [`41b9a53`](https://github.com/thirdweb-dev/js/commit/41b9a53e35f570aabf8e00acccc683b360064612) Thanks [@MananTank](https://github.com/MananTank)! - Fix Search in Network Selector screen

## 5.33.0

### Minor Changes

- [#3609](https://github.com/thirdweb-dev/js/pull/3609) [`9faa8fc`](https://github.com/thirdweb-dev/js/commit/9faa8fc112aec7109324aad4cb7d5e03d4a0ecbd) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds ERC-6942 utilities and verification compatibility. See [ERC-6942](https://eips.ethereum.org/EIPS/eip-6942) for more information.

### Patch Changes

- [#3597](https://github.com/thirdweb-dev/js/pull/3597) [`34b9bbe`](https://github.com/thirdweb-dev/js/commit/34b9bbe77f3a688df1a953e79b28e0349b15bba7) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix wallet disconnect events not being emitted

- [#3608](https://github.com/thirdweb-dev/js/pull/3608) [`2ab8b3c`](https://github.com/thirdweb-dev/js/commit/2ab8b3ca7898289d65d0197692e69ad6992b8178) Thanks [@MananTank](https://github.com/MananTank)! - Set selection data on wallet selection with no custom selection UI - This fixes UI bug in Connect wide modal that has both inApp and ecosystem wallets added

## 5.32.3

### Patch Changes

- [#3605](https://github.com/thirdweb-dev/js/pull/3605) [`c261921`](https://github.com/thirdweb-dev/js/commit/c261921e552f30c3cedfcde29aa84da9428c86d2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix inapp wallet layout reset

## 5.32.2

### Patch Changes

- [#3599](https://github.com/thirdweb-dev/js/pull/3599) [`eac126b`](https://github.com/thirdweb-dev/js/commit/eac126bb14e288108b740f2785d2e7db6889dddb) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect title and theme colors in react native modals

- [#3590](https://github.com/thirdweb-dev/js/pull/3590) [`106c013`](https://github.com/thirdweb-dev/js/commit/106c01356c545dffb34c091115d25cbdaa0f2c80) Thanks [@jnsdls](https://github.com/jnsdls)! - fix ethers5 adapter populateTransaction for sendTransaction

- [#3600](https://github.com/thirdweb-dev/js/pull/3600) [`e598f46`](https://github.com/thirdweb-dev/js/commit/e598f464227d5b8230ddfdd8ebce55e3d6236355) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Force legacy transactions on Vanguard chain

- [#3591](https://github.com/thirdweb-dev/js/pull/3591) [`e22b308`](https://github.com/thirdweb-dev/js/commit/e22b308fa72de881feb858acb07c227ff7d7593f) Thanks [@MananTank](https://github.com/MananTank)! - Various Pay UI improvements

- [#3592](https://github.com/thirdweb-dev/js/pull/3592) [`d2de83d`](https://github.com/thirdweb-dev/js/commit/d2de83da6675d8b323b85d083a097637cf9af0ac) Thanks [@jnsdls](https://github.com/jnsdls)! - make siwe_auth more robust

- [#3583](https://github.com/thirdweb-dev/js/pull/3583) [`229561e`](https://github.com/thirdweb-dev/js/commit/229561e1a79fe2ab3f010c5a8659c7e0fc497ec3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Animated connecting states for React Native

- [#3576](https://github.com/thirdweb-dev/js/pull/3576) [`687328a`](https://github.com/thirdweb-dev/js/commit/687328aae9eb8bb577c000f1183e43dd080ec8f4) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Blockscout v2 contract verification

- [#3593](https://github.com/thirdweb-dev/js/pull/3593) [`e0f4e5a`](https://github.com/thirdweb-dev/js/commit/e0f4e5a23366cc676bc7949e96c1d92407f816e6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix input validation in Send Funds modal

- [#3598](https://github.com/thirdweb-dev/js/pull/3598) [`e5cccb9`](https://github.com/thirdweb-dev/js/commit/e5cccb9d7028e10c93e17039403bde1fdeccd6cf) Thanks [@MananTank](https://github.com/MananTank)! - Fix Send Transaction UI

## 5.32.1

### Patch Changes

- [#3582](https://github.com/thirdweb-dev/js/pull/3582) [`9651b96`](https://github.com/thirdweb-dev/js/commit/9651b96b96d3f416662e9832902e655c0e6cf0fd) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose `waitForUserOpReceipt()` helper function

- [#3397](https://github.com/thirdweb-dev/js/pull/3397) [`49ae575`](https://github.com/thirdweb-dev/js/commit/49ae575211f8484296d4aac16782e94ae89c437d) Thanks [@jnsdls](https://github.com/jnsdls)! - improve loading performance for chains

- [#3577](https://github.com/thirdweb-dev/js/pull/3577) [`6b919e1`](https://github.com/thirdweb-dev/js/commit/6b919e13859e146f572619bfb315d5c357808a0e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Show ecosystem wallet branding on wide modal layout

## 5.32.0

### Minor Changes

- [#3570](https://github.com/thirdweb-dev/js/pull/3570) [`1a2e056`](https://github.com/thirdweb-dev/js/commit/1a2e0563299e22dbcac77d177a7b86011ecf377d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - ConnectButton and ConnectEmbed components for React Native

  ## ConnectButton and ConnectEmbed components for React Native

  Same behavior as the web, you can use these prebuilt components to quickly provide wallet connection flows to your users.

  You can use it the same way as you would in the web, with the same supported properties and configuration flags.

  ```ts
  import { ConnectButton } from "thirdweb/react";

  <ConnectButton
      client={client}
  />
  ```

  and same for ConnectEmbed

  ```ts
  import { ConnectEmbed } from "thirdweb/react";

  <ConnectEmbed
      client={client}
  />
  ```

### Patch Changes

- [#3574](https://github.com/thirdweb-dev/js/pull/3574) [`f526d73`](https://github.com/thirdweb-dev/js/commit/f526d733d0c512ed607a5fecad8d8e8220f6fe75) Thanks [@MananTank](https://github.com/MananTank)! - \* Fix broken inApp wallet connection flow in Compact size Connect UI

  - Fix missing back button in inApp wallet connection flow in Compact size Connect UI

- [#3575](https://github.com/thirdweb-dev/js/pull/3575) [`5953131`](https://github.com/thirdweb-dev/js/commit/59531310d946396fc413bfaea4f224ab74bb92d7) Thanks [@MananTank](https://github.com/MananTank)! - Reset wallet selection data on wallet selection

- [#3569](https://github.com/thirdweb-dev/js/pull/3569) [`e5f772d`](https://github.com/thirdweb-dev/js/commit/e5f772dd5c69e818bd17496a960d64775f9ffccc) Thanks [@edwardysun](https://github.com/edwardysun)! - Support localhost as a domain override option for the Pay service

## 5.31.1

### Patch Changes

- [#3558](https://github.com/thirdweb-dev/js/pull/3558) [`54c1789`](https://github.com/thirdweb-dev/js/commit/54c17893307ea4dac13894cb3e07d82821a6012f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix recommended wallet ordering

- [#3554](https://github.com/thirdweb-dev/js/pull/3554) [`cbb0bc2`](https://github.com/thirdweb-dev/js/commit/cbb0bc2835bcfef62e69c18596063842f305f624) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#3562](https://github.com/thirdweb-dev/js/pull/3562) [`98a9e22`](https://github.com/thirdweb-dev/js/commit/98a9e226fa4cecda00ddd4b7c675ec00d2139940) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix coinbase wallet connections on vite

## 5.31.0

### Minor Changes

- [#3543](https://github.com/thirdweb-dev/js/pull/3543) [`6704fa8`](https://github.com/thirdweb-dev/js/commit/6704fa887013322e23cb0b7a5d96b3cf647ce8c5) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to override transaction properties in mintTo functions

- [#3552](https://github.com/thirdweb-dev/js/pull/3552) [`31775dc`](https://github.com/thirdweb-dev/js/commit/31775dc1dcf38568390e505fd7fb53c6b5aa9cec) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds storage unpin function

- [#3533](https://github.com/thirdweb-dev/js/pull/3533) [`e4b6391`](https://github.com/thirdweb-dev/js/commit/e4b6391cb3b3c3879bc4c66eaa742e364ff17b83) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds StoredTransaction type

- [#3534](https://github.com/thirdweb-dev/js/pull/3534) [`cf2d1b8`](https://github.com/thirdweb-dev/js/commit/cf2d1b8df33a2fd271b5a75ec09a9ecd1169e388) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds shortenHex utility

### Patch Changes

- [#3529](https://github.com/thirdweb-dev/js/pull/3529) [`18c3d3b`](https://github.com/thirdweb-dev/js/commit/18c3d3be9f7065feb556649fecc8a3bb38e295c9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Do not log auto connect failure "errors"

- [#3541](https://github.com/thirdweb-dev/js/pull/3541) [`27daf22`](https://github.com/thirdweb-dev/js/commit/27daf220102e3c29e867c46043fb7a17ba2830dc) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix in-app wallet transcation execution via WalletConnect

- [#3539](https://github.com/thirdweb-dev/js/pull/3539) [`85f2f6d`](https://github.com/thirdweb-dev/js/commit/85f2f6d2bd61364ee1b66609f51dcaded0eba790) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix WalletConnect client disconnections

- [#3551](https://github.com/thirdweb-dev/js/pull/3551) [`b6ab038`](https://github.com/thirdweb-dev/js/commit/b6ab038802091ebb6cc6d880b4bafb682a37da95) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#3536](https://github.com/thirdweb-dev/js/pull/3536) [`8bfba81`](https://github.com/thirdweb-dev/js/commit/8bfba81d2ecd66c69240989716608a199545c082) Thanks [@maciekzygmunt](https://github.com/maciekzygmunt)! - Add Linea & Linea Sepolia chain config files

- [#3542](https://github.com/thirdweb-dev/js/pull/3542) [`517ecff`](https://github.com/thirdweb-dev/js/commit/517ecff0b2179062ab654592288b47e82c2e3405) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Rename Sepolia native currency symbol to ETH

- [#3545](https://github.com/thirdweb-dev/js/pull/3545) [`7e24260`](https://github.com/thirdweb-dev/js/commit/7e242602e91565c62d7db1e9ba042405ac66dbc6) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix errors thrown when connecting with an open access ecosystem

## 5.30.0

### Minor Changes

- [#3451](https://github.com/thirdweb-dev/js/pull/3451) [`2244631`](https://github.com/thirdweb-dev/js/commit/224463175e2496e73c69bb1f60f37e6ff6bec1fa) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds `getTransactionStore` to retrieve a transaction store for a given address

- [#3381](https://github.com/thirdweb-dev/js/pull/3381) [`6429acc`](https://github.com/thirdweb-dev/js/commit/6429acc1f7d45e26bbbe501497df4fb0c3baa5b3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds support for Dawn wallet

- [#3270](https://github.com/thirdweb-dev/js/pull/3270) [`b24e9b2`](https://github.com/thirdweb-dev/js/commit/b24e9b23203a66915ba9e8b4a2d2b8aa17451135) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds ecosystemWallet to TS SDK

  ### Usage

  ```ts
  import { ecosystemWallet } from "thirdweb/wallets";

  const wallet = ecosystemWallet("ecosystem.hooli", {
    partnerId: "pied-piper",
  });
  ```

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Adds watchAsset support in injected wallet accounts

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - - Add `purchaseData` parameter in `getBuyWithFiatQuote` and `getBuyWithCryptoQuote` functions and UI components to store Extra details for the purchase which can be retrieved later via the status API or Webhook

  - Add a required `fromAddress` parameter in `getBuyWithFiatQuote`

- [#3429](https://github.com/thirdweb-dev/js/pull/3429) [`a3a4008`](https://github.com/thirdweb-dev/js/commit/a3a4008831ca9c34cafe461cd4ca2c07941d1564) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds WalletConnect disconnect screen

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Added `onDisconnect` option in `useWalletDetailsModal`'s `open` method to add a callback when the user disconnects the wallet by clicking the disconnect button in the wallet details modal.

  ```tsx
  import { useWalletDetailsModal } from "thirdweb/react";

  function Example() {
    const detailsModal = useWalletDetailsModal();

    return (
      <button
        onClick={() => {
          detailsModal.open({
            client,
            onDisconnect: ({ wallet, account }) => {
              console.log("disconnected", wallet, account);
            },
          });
        }}
      >
        Show wallet details
      </button>
    );
  }
  ```

  `onDisconnect` prop of `ConnectButton` now gets called with the disconnected `wallet` and `account` as arguments

  ```tsx
  <ConnectButton
    onDisconnect={({ wallet, account }) => {
      console.log("disconnected", wallet, account);
    }}
  />
  ```

- [#3270](https://github.com/thirdweb-dev/js/pull/3270) [`b24e9b2`](https://github.com/thirdweb-dev/js/commit/b24e9b23203a66915ba9e8b4a2d2b8aa17451135) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds ecosystem wallet UI

### Patch Changes

- [#3444](https://github.com/thirdweb-dev/js/pull/3444) [`fe77516`](https://github.com/thirdweb-dev/js/commit/fe775166d40fdd50faaa8d6da3fcd624f9a450ed) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds wallet connect functions to react native

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Fix mobile Wallet Connect connection flow

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Add updateMetadata extension for Edition Drop (DropERC1155)

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Fix hex-based signatures for in-app wallets

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - - Fix ConnectButton not able to connect Unknown injected wallet provider + Fix Wallet Icon + Fix AutoConnect

- [#3449](https://github.com/thirdweb-dev/js/pull/3449) [`eaa5093`](https://github.com/thirdweb-dev/js/commit/eaa509359fc57a7b0dcdeb4773a1045c91bf0dc6) Thanks [@jnsdls](https://github.com/jnsdls)! - [internals] refactor context usage in connect wallet UI

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Fix uploadMobile function not respecting bundleId

- [#3421](https://github.com/thirdweb-dev/js/pull/3421) [`02a70b9`](https://github.com/thirdweb-dev/js/commit/02a70b928d3b916c94466e3d29fb37319196a2c8) Thanks [@MananTank](https://github.com/MananTank)! - Pay UI improvements - Break down the complex screen into multiple screens each prompting the user for a single action

  Fix PayEmbed Modal title alignment

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Update Connect Modal icons

- [#3513](https://github.com/thirdweb-dev/js/pull/3513) [`c330d0d`](https://github.com/thirdweb-dev/js/commit/c330d0d815eefd9380f7110d597e47ca0fa0d402) Thanks [@gregfromstl](https://github.com/gregfromstl)! - resolveName returns null if no ENS exists for an address

- [#3443](https://github.com/thirdweb-dev/js/pull/3443) [`ea46c70`](https://github.com/thirdweb-dev/js/commit/ea46c70d7ae5132ac9df9c306c5c3cb1ba871a76) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Fix EIP155 check for create2 factory deployment

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Fix React warning when clicking copy address button and layout shift

- [#3521](https://github.com/thirdweb-dev/js/pull/3521) [`16ea2bc`](https://github.com/thirdweb-dev/js/commit/16ea2bc68420386ec1a65c7ee879f0d0b6f31822) Thanks [@MananTank](https://github.com/MananTank)! - Fix wallet app not opening when using ConnectButton inside an iframe

- [#3465](https://github.com/thirdweb-dev/js/pull/3465) [`70b31dd`](https://github.com/thirdweb-dev/js/commit/70b31ddcd09bfd1c67906f72a89423865610185c) Thanks [@iamcryptofennec](https://github.com/iamcryptofennec)! - Fix error when Switching to an unknown network in wallet when connected using WaletConnect

  Fix Network Selector not closed sometimes when Network switch is successful when connected using WalletConnect

- [#3481](https://github.com/thirdweb-dev/js/pull/3481) [`8807042`](https://github.com/thirdweb-dev/js/commit/88070422ff8389997a92591e0ba4c0fe2528d0f5) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Export getClaimConditionById for Drop1155

- [#3428](https://github.com/thirdweb-dev/js/pull/3428) [`fab5cd4`](https://github.com/thirdweb-dev/js/commit/fab5cd43bed972b0a3f70f0f39a790349672ba72) Thanks [@jnsdls](https://github.com/jnsdls)! - Fixed return type for useConnectModal.connect

## 5.29.6

### Patch Changes

- [#3366](https://github.com/thirdweb-dev/js/pull/3366) [`9dd1b5a`](https://github.com/thirdweb-dev/js/commit/9dd1b5a5ebaeaecafdcacbb4f4b81c3006d5074c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix sign raw message through ethers 5/6 adapters

- [#3369](https://github.com/thirdweb-dev/js/pull/3369) [`b808652`](https://github.com/thirdweb-dev/js/commit/b80865280585548615e4741634ea6b884a16e2cf) Thanks [@jnsdls](https://github.com/jnsdls)! - do not consider localhost a thirdweb url (except for dev mode)

## 5.29.5

### Patch Changes

- [#3356](https://github.com/thirdweb-dev/js/pull/3356) [`2d7ebe2`](https://github.com/thirdweb-dev/js/commit/2d7ebe2111d24448dd85ace25fc9fdbef987a57d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix ConnectButton theming prop

- [#3364](https://github.com/thirdweb-dev/js/pull/3364) [`7304c5b`](https://github.com/thirdweb-dev/js/commit/7304c5b0c7060080f302160dc9b24b2becc17524) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect coinbase wallet create settings when preloading the provider

- [#3347](https://github.com/thirdweb-dev/js/pull/3347) [`a9ce10f`](https://github.com/thirdweb-dev/js/commit/a9ce10f39ad47f386e8086e230679093aab08754) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add ERC721 extension: updateMetadata

## 5.29.4

### Patch Changes

- [#3345](https://github.com/thirdweb-dev/js/pull/3345) [`79e6a04`](https://github.com/thirdweb-dev/js/commit/79e6a047d6ae6cb341fdad22137bd83ad6e611d4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix react native inAppWallet creation

## 5.29.3

### Patch Changes

- [#3329](https://github.com/thirdweb-dev/js/pull/3329) [`c94bcd5`](https://github.com/thirdweb-dev/js/commit/c94bcd574aa4eaf2bd76ab8b6379302de4731ed4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Dynamically import coinbase sdk to avoid cloudflare bundler issues

- [#3341](https://github.com/thirdweb-dev/js/pull/3341) [`1c533ef`](https://github.com/thirdweb-dev/js/commit/1c533efcd5fbc8a72fd03c98510fa601ee5f34b5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix transaction button not respecting theme prop

- [#3298](https://github.com/thirdweb-dev/js/pull/3298) [`ffaff74`](https://github.com/thirdweb-dev/js/commit/ffaff744f72d2cb22896e7501677b48f76ea857a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - refactor exports to handle native vs non-native dependencies

- [#3330](https://github.com/thirdweb-dev/js/pull/3330) [`9cf3a1d`](https://github.com/thirdweb-dev/js/commit/9cf3a1d6636fcd56559e889ab2bfe3249d51162a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix coinbase wallet popup sometimes not opening on safari + improve inAppWallet web performance

## 5.29.2

### Patch Changes

- [#2880](https://github.com/thirdweb-dev/js/pull/2880) [`7768067`](https://github.com/thirdweb-dev/js/commit/7768067bf4f571a8c8ee6b646a58e2fc5f6bd052) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Modular contract publish and deploy setup

- [#3318](https://github.com/thirdweb-dev/js/pull/3318) [`fb6a07d`](https://github.com/thirdweb-dev/js/commit/fb6a07d4b84ba8ea6389ca04c73625f670a0d9c4) Thanks [@jnsdls](https://github.com/jnsdls)! - add missing erc4337 extensions

## 5.29.1

### Patch Changes

- [#3290](https://github.com/thirdweb-dev/js/pull/3290) [`b248afc`](https://github.com/thirdweb-dev/js/commit/b248afc16062f8fe0967e42535ae119642897003) Thanks [@alecananian](https://github.com/alecananian)! - Fixed Connect modal title not using custom title and icon in compact mode

- [#3292](https://github.com/thirdweb-dev/js/pull/3292) [`132b3cb`](https://github.com/thirdweb-dev/js/commit/132b3cb45ae1d56f8de240a361b31c76d5b9b4a7) Thanks [@alecananian](https://github.com/alecananian)! - Updated the `ConnectButton` `label` prop to be of type `ReactNode`

- [#3305](https://github.com/thirdweb-dev/js/pull/3305) [`e7ba698`](https://github.com/thirdweb-dev/js/commit/e7ba698f3e60e0749f8739ad1aec76a8ab2c2fb3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix default sale and royalty recipients for signature mints

## 5.29.0

### Minor Changes

- [#3273](https://github.com/thirdweb-dev/js/pull/3273) [`7afd2da`](https://github.com/thirdweb-dev/js/commit/7afd2dac0ace82fd7ba14766acd73555f4fa10ce) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds options refetchInterval and retry params to useReadContract

- [#3231](https://github.com/thirdweb-dev/js/pull/3231) [`dbf74aa`](https://github.com/thirdweb-dev/js/commit/dbf74aad3ffaeaa3e3967801549f6ec26f721dea) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - TransactionButton react native implementation

- [#3271](https://github.com/thirdweb-dev/js/pull/3271) [`3a1fd98`](https://github.com/thirdweb-dev/js/commit/3a1fd985fc4b2720f4d46d54b562c00b2edf21ce) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Align inAppWallet secret sharing implementation with web and previous RN SDK

- [#3229](https://github.com/thirdweb-dev/js/pull/3229) [`e7b9b9f`](https://github.com/thirdweb-dev/js/commit/e7b9b9f438ad303fdc79aaca1ca674acd8c7a7ba) Thanks [@MananTank](https://github.com/MananTank)! - Add `useWalletDetailsModal` hook to open Wallet Details Modal without using `<ConnectButton />` component

  ```tsx
  import { createThirdwebClient } from "thirdweb";
  import { useWalletDetailsModal } from "thirdweb/react";

  const client = createThirdwebClient({
    clientId: "<your_client_id>",
  });

  function Example() {
    const { open } = useWalletDetailsModal();

    function handleClick() {
      open({ client, theme: "light" });
    }

    return <button onClick={handleClick}> Show Wallet Details </button>;
  }
  ```

### Patch Changes

- [#3278](https://github.com/thirdweb-dev/js/pull/3278) [`5698b0c`](https://github.com/thirdweb-dev/js/commit/5698b0c5a9779830fa2d2582e551d050427c6254) Thanks [@0xFirekeeper](https://github.com/0xFirekeeper)! - [v4 & v5] zkCandy Sepolia AA Support

- [#3263](https://github.com/thirdweb-dev/js/pull/3263) [`f2004b5`](https://github.com/thirdweb-dev/js/commit/f2004b54eaf3137297fd8a4d29c85b4aa5c78dcb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Add potential error message for eip155 failure

- [#3266](https://github.com/thirdweb-dev/js/pull/3266) [`e763ace`](https://github.com/thirdweb-dev/js/commit/e763ace602639f08f95b600ba1532708f2569eb9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix sign typed data with inAppWallet when the domain contains a salt param

- [#3264](https://github.com/thirdweb-dev/js/pull/3264) [`3948f43`](https://github.com/thirdweb-dev/js/commit/3948f4320cdf9546975955414aa756bc5e57c08a) Thanks [@MananTank](https://github.com/MananTank)! - - Remove the feature that sets another connected wallet as active when disconnecting the current active wallet.

  - Do not save personal wallet as a separate wallet in connected wallets list.

- [#3256](https://github.com/thirdweb-dev/js/pull/3256) [`923a5ec`](https://github.com/thirdweb-dev/js/commit/923a5ec556b5a857e855377c90ad339485ac828f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Automatic retries on watchContractEvents

- [#3280](https://github.com/thirdweb-dev/js/pull/3280) [`7dec4d0`](https://github.com/thirdweb-dev/js/commit/7dec4d049d9433782ef3b9de0738d6bce29fa6a8) Thanks [@MananTank](https://github.com/MananTank)! - Fix in-app wallet sending another verification code on window focus when using ConnectEmbed.

  Fix the underlying issue of `useAutoConnect` running again on window focus.

  Add `refetchOnWindowFocus: false` on few more `useQuery` instances to avoid unnecessary refetches

- [#3235](https://github.com/thirdweb-dev/js/pull/3235) [`824a631`](https://github.com/thirdweb-dev/js/commit/824a631b55bb4b8d4a0290d19dde081dd90a8647) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds EIP-5792 hook exports to thirdweb/react

- [#3241](https://github.com/thirdweb-dev/js/pull/3241) [`37ec4ca`](https://github.com/thirdweb-dev/js/commit/37ec4ca28d7d0290d4cc8b838d888f67c70e172f) Thanks [@jnsdls](https://github.com/jnsdls)! - fix ipfs `resolveScheme` bug for v1 ipfs schemes

- [#3240](https://github.com/thirdweb-dev/js/pull/3240) [`d488223`](https://github.com/thirdweb-dev/js/commit/d4882236b786660efd1f60c181d37351109949ff) Thanks [@MananTank](https://github.com/MananTank)! - Fix custom theme not used in ConnectEmbed loading screen

- [#3251](https://github.com/thirdweb-dev/js/pull/3251) [`ce45a79`](https://github.com/thirdweb-dev/js/commit/ce45a793b54ab656dac01f2f99d9db8df52f4e23) Thanks [@MananTank](https://github.com/MananTank)! - Allow selecting fiat currency in Pay UI

## 5.28.0

### Minor Changes

- [#3198](https://github.com/thirdweb-dev/js/pull/3198) [`ca31a6c`](https://github.com/thirdweb-dev/js/commit/ca31a6c0d8f2d246d48b8f382fa01377a6a3e2cf) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Exports toSerializableTransaction to convert preparedTransaction into a fully serializable transaction.
  Exports estimateGasCost to estimate the gas cost of a transaction in ether and wei.
  Exports getGasPrice to get the currect gas price for a chain.

  ### `toSerializableTransaction`

  ```ts
  import { prepareTransaction, toSerializableTransaction } from "thirdweb";

  const transaction = await prepareTransaction({
    transaction: {
      to: "0x...",
      value: 100,
    },
  });
  const serializableTransaction = await toSerializableTransaction({
    transaction,
  });

  account.sendTransaction(serializableTransaction);
  ```

  ### `estimateGasCost`

  ```ts
  import { estimateGasCost } from "thirdweb";

  const gasCost = await estimateGasCost({ transaction });
  ```

  ### `getGasPrice`

  ```ts
  import { getGasPrice } from "thirdweb";

  const gasPrice = await getGasPrice({ client, chain });
  ```

### Patch Changes

- [#3207](https://github.com/thirdweb-dev/js/pull/3207) [`e7443ed`](https://github.com/thirdweb-dev/js/commit/e7443edda77f0a4528f1f9782b2046dcc43a9a12) Thanks [@MananTank](https://github.com/MananTank)! - Fixes #3204 - Account methods not properly updated when account is changed in wallet

- [#3226](https://github.com/thirdweb-dev/js/pull/3226) [`58d14c9`](https://github.com/thirdweb-dev/js/commit/58d14c9eaf964620a44732ee247deb364c3aec09) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add option to choose the contract type for erc1155/generateMintSignature

- [#3227](https://github.com/thirdweb-dev/js/pull/3227) [`043f0da`](https://github.com/thirdweb-dev/js/commit/043f0da708b267336c79f12f6c186beedf3206d7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Better gas estimation for opBNB mainnet & testnet

- [#3201](https://github.com/thirdweb-dev/js/pull/3201) [`0328bc8`](https://github.com/thirdweb-dev/js/commit/0328bc894e62d15ce2d457abd5f06d16fbd8c7e1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fallback to default metadata on failure to fetch erc20 metadata

## 5.27.0

### Minor Changes

- [#3181](https://github.com/thirdweb-dev/js/pull/3181) [`a346111`](https://github.com/thirdweb-dev/js/commit/a3461114c5e9adb8d0ea2f36bc9fb3d96366c5b9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds headless functions for creating and managing a WalletConnect session with a connected wallet

  ### `createWalletConnectClient`

  ```ts
  import { createWalletConnectClient } from "thirdweb/wallets/wallet-connect";

  createWalletConnectClient({
    client: client,
    wallet: wallet,
    onConnect: (session: any) => {
      alert("Connected");
    },
    onDisconnect: (session: any) => {
      alert("Disconnected");
    },
  });
  ```

  ### `createWalletConnectSession`

  ```ts
  import { createWalletConnectSession } from "thirdweb/wallets/wallet-connect";

  createWalletConnectSession({
    walletConnectClient: wcClient,
    uri: "wc:...",
  });
  ```

  ### `getWalletConnectSessions`

  ```ts
  import {
    getWalletConnectSession,
    type WalletConnectSession,
  } from "thirdweb/wallets/wallet-connect";

  const sessions: WalletConnectSession[] = await getWalletConnectSessions();
  ```

  ### `disconnectWalletConnectClient`

  ```ts
  import { disconnectWalletConnectClient } from "thirdweb/wallets/wallet-connect";

  disconnectWalletConnectClient({ session, walletConnectClient: wcClient });
  ```

- [#3105](https://github.com/thirdweb-dev/js/pull/3105) [`51e7ada`](https://github.com/thirdweb-dev/js/commit/51e7adaeb0fe050eb132510291ecac7a12e4c4ad) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - First party support for zkSync native account abstraction

  You can now use smart accounts on zkSync and zkSync sepolia without any extra setup.

  ```ts
  const wallet = smartWallet({
    chain: zkSync,
    sponsorGas: true,
  });

  const smartAccount = await wallet.connect({
    client,
    personalAccount,
  });

  // now your can perform transactions normally, gas will be sponsored
  sendTransaction({ transaction, account: smartAccount });
  ```

- [#3105](https://github.com/thirdweb-dev/js/pull/3105) [`51e7ada`](https://github.com/thirdweb-dev/js/commit/51e7adaeb0fe050eb132510291ecac7a12e4c4ad) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - ZkSync transaction support

### Patch Changes

- [#3195](https://github.com/thirdweb-dev/js/pull/3195) [`3f66945`](https://github.com/thirdweb-dev/js/commit/3f669453d086487a217ae9af82745199e26550c6) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix `estimateGas` type resolution

## 5.26.0

### Minor Changes

- [#3161](https://github.com/thirdweb-dev/js/pull/3161) [`b569eb4`](https://github.com/thirdweb-dev/js/commit/b569eb48ad018619e4589b9efb5aa774c7b77642) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds waitForBundle function to await a sendCalls bundle's complete confirmation.

  ### Usage

  ```ts
  import { waitForBundle } from "thirdweb/wallets/eip5792";
  const result = await waitForBundle({
    client,
    chain,
    wallet,
    bundleId: "0x123...",
  });
  ```

- [#3161](https://github.com/thirdweb-dev/js/pull/3161) [`b569eb4`](https://github.com/thirdweb-dev/js/commit/b569eb48ad018619e4589b9efb5aa774c7b77642) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds EIP-5792 react hooks

  ## `useSendCalls`

  `useSendCalls` will automatically revalidate all reads from contracts that are interacted with.

  ```tsx
  import { useSendCalls } from "thirdweb/react";

  const sendTx1 = approve({
    contract: USDT_CONTRACT,
    amount: 100,
    spender: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
  });
  const sendTx2 = approve({
    contract: USDT_CONTRACT,
    amount: 100,
    spender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  });
  const { mutate: sendCalls, data: bundleId } = useSendCalls({ client });
  await sendCalls({
    wallet,
    client,
    calls: [sendTx1, sendTx2],
  });
  ```

  Await the bundle's full confirmation:

  ```tsx
  const { mutate: sendCalls, data: bundleId } = useSendCalls({
    client,
    waitForResult: true,
  });
  await sendCalls({
    wallet,
    client,
    calls: [sendTx1, sendTx2],
  });
  ```

  Sponsor transactions with a paymaster:

  ```ts
  const { mutate: sendCalls, data: bundleId } = useSendCalls();
  await sendCalls({
    client,
    calls: [sendTx1, sendTx2],
    capabilities: {
      paymasterService: {
        url: `https://${CHAIN.id}.bundler.thirdweb.com/${client.clientId}`,
      },
    },
  });
  ```

  ## `useCapabilities`

  ```tsx
  import { useCapabilities } from "thirdweb/react";
  const { data: capabilities, isLoading } = useCapabilities();
  ```

  ## `useCallsStatus`

  ```tsx
  import { useCallsStatus } from "thirdweb/react";
  const { data: status, isLoading } = useCallsStatus({ bundleId, client });
  ```

### Patch Changes

- [#3178](https://github.com/thirdweb-dev/js/pull/3178) [`3dca028`](https://github.com/thirdweb-dev/js/commit/3dca028a7eff926ae406eb29cc82016ae6c994b3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix gas estimation in transaction button

- [#3187](https://github.com/thirdweb-dev/js/pull/3187) [`874747b`](https://github.com/thirdweb-dev/js/commit/874747b3e00714e9a7336dcfda34e7b92b82e7e1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Upgrade to latest coinbase wallet sdk

- [#3186](https://github.com/thirdweb-dev/js/pull/3186) [`123275b`](https://github.com/thirdweb-dev/js/commit/123275bbe275457b0be5205812ba0ef75b1f0e5b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Catch any errors thrown while polling block numbers

## 5.25.1

### Patch Changes

- [#3169](https://github.com/thirdweb-dev/js/pull/3169) [`f8cad77`](https://github.com/thirdweb-dev/js/commit/f8cad774ec979a02d47388bc835386caaed218e8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Mark coinbase mobile wallet as optional dep

## 5.25.0

### Minor Changes

- [#3140](https://github.com/thirdweb-dev/js/pull/3140) [`fc1b658`](https://github.com/thirdweb-dev/js/commit/fc1b65888f71b93e4c76a61a5a2d0146c8129d1e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Show in-app wallet users an option to export their private key. Enabled by default.

  ### Usage

  To hide the private key export:

  ```tsx
  import { inAppWallet } from "thirdweb/wallets";
  const wallet = inAppWallet({
    hidePrivateKeyExport: true,
  });
  ```

- [#3154](https://github.com/thirdweb-dev/js/pull/3154) [`99d11bb`](https://github.com/thirdweb-dev/js/commit/99d11bb8591180a7837eafc19e85afedcca46100) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to copy the wallet connect connection link as an alternative to scanning the QR code

- [#3150](https://github.com/thirdweb-dev/js/pull/3150) [`9c417d9`](https://github.com/thirdweb-dev/js/commit/9c417d9be35a4793c8d3d6ff4a143168f8356379) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds onDisconnect callback to connect button

  ### Usage

  ```tsx
  <ConnectButton
    client={THIRDWEB_CLIENT}
    onDisconnect={() => console.log("disconnect")}
    theme={theme === "light" ? "light" : "dark"}
  />
  ```

### Patch Changes

- [#3162](https://github.com/thirdweb-dev/js/pull/3162) [`b9b185b`](https://github.com/thirdweb-dev/js/commit/b9b185b665e9cc2085f0cc07e3a3cc06a755b42a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add support for CB wallet in react native

- [#3151](https://github.com/thirdweb-dev/js/pull/3151) [`8b606b5`](https://github.com/thirdweb-dev/js/commit/8b606b51e4dceae031dc98380847fdb2ecf61994) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Better handling for multiple accounts connected

- [#3144](https://github.com/thirdweb-dev/js/pull/3144) [`c1d3a5a`](https://github.com/thirdweb-dev/js/commit/c1d3a5a259341e6fdda62e3dcaf0c4dae3bd60ff) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix resolveScheme for native apps

- [#3153](https://github.com/thirdweb-dev/js/pull/3153) [`3b03cd0`](https://github.com/thirdweb-dev/js/commit/3b03cd098716070821c6b20ecedacec1df47648f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improve the copy on the pending connection QR code screen in the connect modal

## 5.24.0

### Minor Changes

- [#2943](https://github.com/thirdweb-dev/js/pull/2943) [`2774d1f`](https://github.com/thirdweb-dev/js/commit/2774d1fa7383a5a1150991c5c44019e64f276eea) Thanks [@MananTank](https://github.com/MananTank)! - Added `useConnectModal` hook.

  Add `useConnectModal` hook that allows you to open the Connect UI in a Modal to prompt the user to connect wallet.

  ```tsx
  import { createThirdwebClient } from "thirdweb";
  import { useConnectModal } from "thirdweb/react";

  const client = createThirdwebClient({
    clientId: "<your_client_id>",
  });

  function Example() {
    const { connect, isConnecting } = useConnectModal();

    async function handleConnect() {
      const wallet = await connect({ client }); // opens the connect modal
      console.log("connected to", wallet);
    }

    return <button onClick={handleConnect}> Connect </button>;
  }
  ```

- [#3127](https://github.com/thirdweb-dev/js/pull/3127) [`5031e44`](https://github.com/thirdweb-dev/js/commit/5031e44d92d959bbdd43a90122eaf33fb9598ea0) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds contract extensions for delayed reveal NFTs

- [#3118](https://github.com/thirdweb-dev/js/pull/3118) [`546d2db`](https://github.com/thirdweb-dev/js/commit/546d2db93ea61f9fbae1e0f3383781d7d766ad25) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds React Native to the thirdweb create CLI

- [#3126](https://github.com/thirdweb-dev/js/pull/3126) [`764bce2`](https://github.com/thirdweb-dev/js/commit/764bce2ba93b6e24fc81e9b804b765396b873363) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - WalletConnect in React Native + useAutoConnect hook

  ## Support WalletConnect compatible wallets in React Native

  You can now connect any of the 300+ WalletConnect compatible mobile wallets from react native.

  ```ts
  import { useConnect } from "thirdweb/react";
  import { createWallet } from "thirdweb/wallets";

  const { connect, isConnecting } = useConnect();

  const connectMetamask = async () => {
    await connect(async () => {
      const wallet = createWallet("io.metamask");
      await wallet.connect({
        client,
        chain,
      });
      return wallet;
    });
  };
  ```

  ## Exposed `useAutoConnect` hook

  You can now use a hook to trigger autoconnecting to the last connected wallet

  ```ts
  import { useAutoConnect } from "thirdweb/react";

  const { data: autoConnected, isLoading } = useAutoConnect({
    client,
    accountAbstraction,
    wallets,
    onConnect,
    timeout,
  });
  ```

- [#3125](https://github.com/thirdweb-dev/js/pull/3125) [`c3a92bf`](https://github.com/thirdweb-dev/js/commit/c3a92bfe90adf9a9d16707d9be04ad23ad2b0199) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Added `useWalletBalance()` hook

  Adds the `useWalletBalance` hook. The hook will default to the native token balance if no `tokenAddress` is provided.

  ### Usage

  ```ts
  import { useWalletBalance } from "thirdweb/react";

  const { data, isLoading, isError } = useWalletBalance({
    chain: walletChain,
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    address: activeAccount?.address,
    client,
  });
  ```

### Patch Changes

- [#3143](https://github.com/thirdweb-dev/js/pull/3143) [`b72daa4`](https://github.com/thirdweb-dev/js/commit/b72daa4f45eab927a94b8e3ed5ae74a66ba9e32b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose useWalletBalance in react native

- [#3136](https://github.com/thirdweb-dev/js/pull/3136) [`8b3e1e2`](https://github.com/thirdweb-dev/js/commit/8b3e1e2682954370e37fe316c89c4f28bb32b476) Thanks [@MananTank](https://github.com/MananTank)! - Prefer native wallet app link in android as well for WalletConnect session

- [#3139](https://github.com/thirdweb-dev/js/pull/3139) [`4eda306`](https://github.com/thirdweb-dev/js/commit/4eda306645df107280fed11847a7a333fafaa05e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Converts chainId hex to number for proper signTypedData type

- [#3104](https://github.com/thirdweb-dev/js/pull/3104) [`d021f4e`](https://github.com/thirdweb-dev/js/commit/d021f4e5efc8432a3e4cee8c681f2622056da9a8) Thanks [@MananTank](https://github.com/MananTank)! - Fix WalletConnect connection and show Retry option on connection failure/rejection

## 5.23.0

### Minor Changes

- [#3103](https://github.com/thirdweb-dev/js/pull/3103) [`a2275c4`](https://github.com/thirdweb-dev/js/commit/a2275c409c4a7f8f595bd1ee7250fee46d54f1e7) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds `unstyled` prop to `TransactionButton` to remove default styles

  ```tsx
  <TransactionButton
    transaction={() => {}}
    onSuccess={handleSuccess}
    onError={handleError}
    unstyled
    className="bg-white text-black rounded-md p-4 flex items-center justify-center"
  >
    Confirm Transaction
  </TransactionButton>
  ```

- [#3083](https://github.com/thirdweb-dev/js/pull/3083) [`5994685`](https://github.com/thirdweb-dev/js/commit/599468559d2c63b337f770fb492d386cdd90e7ae) Thanks [@MananTank](https://github.com/MananTank)! - Add support for deep-linking to Metamask app instead of using WalletConnect on mobile devices when using Connect UI (`ConnectButton` / `ConnectEmbed`) components.

  ```ts
  <ConnectButton
    client={client}
    wallets={[
      createWallet("io.metamask", {
        preferDeepLink: true,
      }),
    ]}
  />
  ```

- [#3064](https://github.com/thirdweb-dev/js/pull/3064) [`f55fa4c`](https://github.com/thirdweb-dev/js/commit/f55fa4ca856924a0a1eb6b8e5fe743d76b6e2760) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - In-app wallet support for react native

### Patch Changes

- [#3085](https://github.com/thirdweb-dev/js/pull/3085) [`a22eb5c`](https://github.com/thirdweb-dev/js/commit/a22eb5c4bff839aa5137b0a743d75afc929b49f1) Thanks [@MananTank](https://github.com/MananTank)! - Fix `onConnect` prop called twice when connecting inApp wallet using Social login

- [#3071](https://github.com/thirdweb-dev/js/pull/3071) [`da63eab`](https://github.com/thirdweb-dev/js/commit/da63eab29a53ff04cbe1dc175c6a6b6066a1ee9d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fully clear in-app wallet user data when disconnecting

- [#3063](https://github.com/thirdweb-dev/js/pull/3063) [`f49f8ca`](https://github.com/thirdweb-dev/js/commit/f49f8cacb4f69dc46551b023c22bda71712df04a) Thanks [@jnsdls](https://github.com/jnsdls)! - ethers6 adapter: allow optional account to be passed to `contract.toEthers` that will automatically hook up the contract with a signer instead of provider

- [#3079](https://github.com/thirdweb-dev/js/pull/3079) [`f8e0a50`](https://github.com/thirdweb-dev/js/commit/f8e0a50136a600b93c05802322f208c133a9c81e) Thanks [@MananTank](https://github.com/MananTank)! - Fix PayEmbed not passing theme to ConnectButton

- [#3107](https://github.com/thirdweb-dev/js/pull/3107) [`57f7cd5`](https://github.com/thirdweb-dev/js/commit/57f7cd5a661ac3b0611782f17e96a3e30a3485ae) Thanks [@MananTank](https://github.com/MananTank)! - - Fix spacing issues in UI components

  - Revert color changes in UI components

- [#3067](https://github.com/thirdweb-dev/js/pull/3067) [`b46173f`](https://github.com/thirdweb-dev/js/commit/b46173f982dd3b31795739b9a834046ed3599dba) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix TransactionButton styles when overriding with custom styles

- [#3080](https://github.com/thirdweb-dev/js/pull/3080) [`7abbe03`](https://github.com/thirdweb-dev/js/commit/7abbe03a11fc38a02a64329de201636d8e1c5b44) Thanks [@MananTank](https://github.com/MananTank)! - Improved OTP input using input-otp library

- [#3110](https://github.com/thirdweb-dev/js/pull/3110) [`49aa6e4`](https://github.com/thirdweb-dev/js/commit/49aa6e41d5df93204821b72f17f1ba5c3cfe41f7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Phone number sign in for React Native

- [#3082](https://github.com/thirdweb-dev/js/pull/3082) [`9c9969e`](https://github.com/thirdweb-dev/js/commit/9c9969e41abb86f819bad55f5bb3dd36447e41e4) Thanks [@MananTank](https://github.com/MananTank)! - Add switch account button in `ConnectButton` details button for MetaMask injected provider

## 5.22.1

### Patch Changes

- [#3059](https://github.com/thirdweb-dev/js/pull/3059) [`5a40c6a`](https://github.com/thirdweb-dev/js/commit/5a40c6a99b5f4fcafc9c2835f05b41dba8023e4a) Thanks [@jnsdls](https://github.com/jnsdls)! - fix losing state when looking at transactions during pay

- [#3058](https://github.com/thirdweb-dev/js/pull/3058) [`1698c40`](https://github.com/thirdweb-dev/js/commit/1698c40c37a2d9d7e31a8b15d95d87896afab063) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes MediaRenderer flashing its failed state while loading

## 5.22.0

### Minor Changes

- [#3001](https://github.com/thirdweb-dev/js/pull/3001) [`726618b`](https://github.com/thirdweb-dev/js/commit/726618b97a532844c2fede137d7d857deb5e68ec) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds basic EIP-5792 support for wallets with functions `getCapabilities`, `sendCalls`, `showCallsStatus`, `getCallsStatus`.

  ## Example Usage

  ### `getCapabilities`

  Returns the capabilities of the wallet according to EIP-5792.

  ```ts
  import { getCapabilities } from "thirdweb/wallets/eip5792";

  const capabilities = await getCapabilities({ wallet });
  ```

  ### `sendCalls`

  Sends the given calls to the wallet for execution, and attempts to fallback to normal execution if the wallet does not support EIP-5792.

  ```ts
  import { sendCalls } from "thirdweb/wallets/eip5792";

  const transfer1 = transfer({
    contract: USDC_CONTRACT,
    amount: 5000,
    to: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
  });

  const transfer2 = transfer({
    contract: USDT_CONTRACT,
    amount: 1000,
    to: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
  });

  const bundleId = await sendCalls({
    wallet,
    client,
    calls: [transfer1, transfer2],
  });
  ```

  ### `showCallsStatus`

  Requests the wallet to show the status of a given bundle ID.

  ```ts
  import { showCallsStatus } from "thirdweb/wallets/eip5792";

  await showCallsStatus({ wallet, bundleId });
  ```

  ### `getCallsStatus`

  Returns the status of the given bundle ID and the transaction receipts if completed.

  ```ts
  import { getCallsStatus } from "thirdweb/wallets/eip5792";

  const status = await getCallsStatus({ wallet, bundleId });
  ```

### Patch Changes

- [#3048](https://github.com/thirdweb-dev/js/pull/3048) [`cfe60d2`](https://github.com/thirdweb-dev/js/commit/cfe60d22a3eb00241dbc653eba1b7d52c9ce97b1) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Improve error message for `resolveAbiFromBytecode`

- [#3040](https://github.com/thirdweb-dev/js/pull/3040) [`ce45475`](https://github.com/thirdweb-dev/js/commit/ce4547501f9d2c9bd3c6001d39dd6211dbd4e5d6) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes caching issue when using `defineChain`

- [#3037](https://github.com/thirdweb-dev/js/pull/3037) [`f006429`](https://github.com/thirdweb-dev/js/commit/f006429d7c2415e9f2206e081f6b867854842f0b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updates for react native compatibility

## 5.21.0

### Minor Changes

- [#3034](https://github.com/thirdweb-dev/js/pull/3034) [`99fa2da`](https://github.com/thirdweb-dev/js/commit/99fa2da05abc32646036a2269f90213c5756a5ba) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to set a custom logo for the social login modal

  ```ts
  import { inAppWallet } from "thirdweb/wallets";
  const wallet = inAppWallet({
    metadata: {
      image: {
        src: "https://example.com/logo.png",
        alt: "My logo",
        width: 100,
        height: 100,
      },
    },
  });
  ```

### Patch Changes

- [#3035](https://github.com/thirdweb-dev/js/pull/3035) [`3c04450`](https://github.com/thirdweb-dev/js/commit/3c044508eee18ca741878da43e199ed4cc0528b7) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Export extensions for Pack contract

## 5.20.0

### Minor Changes

- [#2912](https://github.com/thirdweb-dev/js/pull/2912) [`9caa9d7`](https://github.com/thirdweb-dev/js/commit/9caa9d7a8df173d06ddaf3a8fab929f65adab092) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updated Connect Modal UI + Passkey support

  - Passkey is now an auth option for `inAppWallet`
  - Connect UI component UI refresh

  ```ts
  const wallet = inAppWallet();
  const hasPasskey = await hasStoredPasskey(client);
  await wallet.connect({
    client,
    strategy: "passkey",
    type: hasPasskey ? "sign-in" : "sign-up",
  });
  ```

- [#3018](https://github.com/thirdweb-dev/js/pull/3018) [`5083464`](https://github.com/thirdweb-dev/js/commit/50834640af8a8c17483465f308642e266dbac290) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds support for Core wallet extension

### Patch Changes

- [#3024](https://github.com/thirdweb-dev/js/pull/3024) [`eb29adf`](https://github.com/thirdweb-dev/js/commit/eb29adf157103cc277d6787c8427403b2eba8472) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add BSC mainnet and testnet

- [#3004](https://github.com/thirdweb-dev/js/pull/3004) [`145ff48`](https://github.com/thirdweb-dev/js/commit/145ff4890fa763288610b2e1af152e7827ec0d8e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Updates shortenAddress to accept a string

- [#3027](https://github.com/thirdweb-dev/js/pull/3027) [`c08a5f2`](https://github.com/thirdweb-dev/js/commit/c08a5f298d59f0b54b4b941d719911c294b8bf04) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes chain metadata overrides

## 5.19.1

### Patch Changes

- [#3005](https://github.com/thirdweb-dev/js/pull/3005) [`0006e54`](https://github.com/thirdweb-dev/js/commit/0006e547a4425406101ef85c635b83c5c6186d1d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - - useSendTransaction now switches chain if needed
  - Fix chain switching with in-app smart accounts
  - Fix tx simulation for pay modal

## 5.19.0

### Minor Changes

- [#2995](https://github.com/thirdweb-dev/js/pull/2995) [`523cd1e`](https://github.com/thirdweb-dev/js/commit/523cd1e16fd1194ffbf8970150ed6f09d4e01fe9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds shortenAddress util

- [#2997](https://github.com/thirdweb-dev/js/pull/2997) [`cf7b6fc`](https://github.com/thirdweb-dev/js/commit/cf7b6fc7bc1686f3b4c54515d569d799d5e3ceea) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - added `createWalletAdapter` helper for interop with diff libraries

### Patch Changes

- [#3000](https://github.com/thirdweb-dev/js/pull/3000) [`0ab1407`](https://github.com/thirdweb-dev/js/commit/0ab14075d37aec27167c5885155f48ea880c9574) Thanks [@MananTank](https://github.com/MananTank)! - Fix WalletImage fallback icon

## 5.18.1

### Patch Changes

- [#2988](https://github.com/thirdweb-dev/js/pull/2988) [`02c0319`](https://github.com/thirdweb-dev/js/commit/02c03196ad38de888ff86311c68fa010018bda60) Thanks [@jnsdls](https://github.com/jnsdls)! - bump all to fix release

## 5.18.0

### Minor Changes

- [#2985](https://github.com/thirdweb-dev/js/pull/2985) [`55081d8`](https://github.com/thirdweb-dev/js/commit/55081d833585b8c7c24690abd87cabeee95cde33) Thanks [@jnsdls](https://github.com/jnsdls)! - ### "Credit Card" payment method added in thirdweb Pay for Fiat on-ramp

  ### `PayEmbed` component added to embed thirdweb Pay UI

  ```tsx
  <PayEmbed
    client={client}
    style={{
      width: "360px",
    }}
  />
  ```

  ### thirdweb Pay UI customization available in `PayEmbed` and `ConnectButton`

  `payOptions` prop in `PayEmbed` and `ConnectButton > detailsModal` allows you custimize :

  - Enable/Disable payment methods
  - Set default amount for Buy token
  - Set Buy token/chain to be selected by default
  - Set Source token/chain to be selected by default for Crypto payment method
  - Disable editing for Buy token/chain/amount and Source token/chain

  ```tsx
  <ConnectButton
    client={client}
    detailsModal={{
      payOptions: yourOptions,
    }}
  />

  <PayEmbed
    client={client}
    detailsModal={{
      payOptions: yourOptions,
    }}
  />
  ```

  ### Fiat on-ramp functions and hooks added

  - `getBuyWithFiatQuote`, `useBuyWithFiatQuote` to get a quote for buying crypto with fiat currency
  - `getBuyWithFiatStatus`, `useBuyWithFiatStatus` to get status of "Buy with fiat" transaction
  - `getBuyWithFiatHistory`, `useBuyWithFiatHistory` to get "Buy with fiat" transaction history
  - `getPostOnRampQuote`, `usePostOnRampQuote` to get quote for swapping on-ramp token to destination token after doing on-ramp
  - Add `getBuyHistory` and `useBuyHistory` to get both "Buy with Fiat" and "Buy with Crypto" transaction history in a single list

## 5.17.0

### Minor Changes

- [#2931](https://github.com/thirdweb-dev/js/pull/2931) [`24c1670`](https://github.com/thirdweb-dev/js/commit/24c1670e7044ba55e8d0f0f6e9be6a19cca92b28) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New `smartAccount` prop for `inAppWallet()`

  You can now convert an inAppWallet to a smart account simply by passing the `smartAccount` prop.

  ```ts
  const wallet = inAppWallet({
    smartAccount: {
      chain: sepolia,
      sponsorGas: true,
    },
  });

  await wallet.connect({
    client,
    strategy: "google",
  });
  ```

  Note: beware that when toggling this flag on and off, you will get a different address (admin EOA vs smart account).

### Patch Changes

- [#2959](https://github.com/thirdweb-dev/js/pull/2959) [`3377fc9`](https://github.com/thirdweb-dev/js/commit/3377fc98825a29abe58b87907165afe6a7dca946) Thanks [@MananTank](https://github.com/MananTank)! - Fix custom details button not opening the details modal in `ConnectButton`

- [#2955](https://github.com/thirdweb-dev/js/pull/2955) [`fd1bd7e`](https://github.com/thirdweb-dev/js/commit/fd1bd7e7ef11285e103898df1d71f079da8ee06f) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add resolve method for Arweave URIs

- [#2950](https://github.com/thirdweb-dev/js/pull/2950) [`d4808fd`](https://github.com/thirdweb-dev/js/commit/d4808fd7e83e0ca9f0b0f78e4248a854ecfec710) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Export getUserPhoneNumber and getAuthenticatedUser in-app wallet functions

- [#2972](https://github.com/thirdweb-dev/js/pull/2972) [`b1ca05e`](https://github.com/thirdweb-dev/js/commit/b1ca05ec12dfa40784667b95944d64982d17b753) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix issue with nonce set to 0 on toSerializableTransaction

- [#2966](https://github.com/thirdweb-dev/js/pull/2966) [`4de8802`](https://github.com/thirdweb-dev/js/commit/4de88024357cf8197ec78fb4fabaf5bddd47c605) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes issue with contract compilation in hardhat

- [#2962](https://github.com/thirdweb-dev/js/pull/2962) [`5b6b241`](https://github.com/thirdweb-dev/js/commit/5b6b24133430db7953d14bbda21393c0f3fbfa74) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Makes multiple bugfixes on the deployPublishedContract code path

  - Contracts with no constructor can now deploy as abi inputs defaults to `[]` when encoding the parameters
  - Properly finds contract versions when specified
  - Defaults to standard deployment if no deployType is specified

- [#2965](https://github.com/thirdweb-dev/js/pull/2965) [`ae10776`](https://github.com/thirdweb-dev/js/commit/ae1077656fe2cf7eb9848b7391c8edcdba0fe77a) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Arweave URI support to <MediaRenderer />

- [#2969](https://github.com/thirdweb-dev/js/pull/2969) [`d660b6c`](https://github.com/thirdweb-dev/js/commit/d660b6ce3249bdcd1ff57719ecee7db5c7d47718) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes deterministic deploys of contracts with no constructor

- [#2958](https://github.com/thirdweb-dev/js/pull/2958) [`02a0ca9`](https://github.com/thirdweb-dev/js/commit/02a0ca9727e1fabfaf1593dd8a3728ca9a32842d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes inconsistent block numbers when fetching events.

  `getContractEvents` will now properly handle `blockRange` interaction with `fromBlock` and `toBlock` given they are both inclusive (i.e. it will only return logs for the number of blocks specified in `blockRange`).

## 5.16.1

### Patch Changes

- [#2936](https://github.com/thirdweb-dev/js/pull/2936) [`a692154`](https://github.com/thirdweb-dev/js/commit/a6921549244e3a0a959fa0611f3ab92328c06f4b) Thanks [@MananTank](https://github.com/MananTank)! - Fix OTP input entered by by clicking on “from messages” option in iOS safari

- [#2934](https://github.com/thirdweb-dev/js/pull/2934) [`bdb919f`](https://github.com/thirdweb-dev/js/commit/bdb919f32ae459608b29dd1e4d511afc226470c6) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Updates the CLI `create` command to use the v5 templates for Next.js and Vite

  Other templates will be updated in the future from within their existing repositories

  Removes React Native starters from the CLI menu
  Removes JS template support from the CLI

- [#2941](https://github.com/thirdweb-dev/js/pull/2941) [`795a59e`](https://github.com/thirdweb-dev/js/commit/795a59e436d791fcfef093971d295622951c832c) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Can now optionally specify `blockRange` on `getContractEvents` in combination with `toBlock` and `fromBlock`.

  ## Usage

  Specify a `blockRange`, defaulting `toBlock` to the current block number.

  ```ts
  await getContractEvents({
    contract: myContract,
    blockRange: 123456n,
    events: [preparedEvent, preparedEvent2],
  });
  ```

  Specify a block range with `toBlock`.

  ```ts
  await getContractEvents({
    contract: myContract,
    toBlock: endBlock,
    blockRange: 123456n,
    events: [preparedEvent, preparedEvent2],
  });
  ```

  Specify a block range starting from `fromBlock` (great for pagination).

  ```ts
  await getContractEvents({
    contract: myContract,
    fromBlock: lastBlockFetched,
    blockRange: 123456n,
    events: [preparedEvent, preparedEvent2],
  });
  ```

- [#2945](https://github.com/thirdweb-dev/js/pull/2945) [`b64c8e7`](https://github.com/thirdweb-dev/js/commit/b64c8e7b6efaf09be2afc73b92624c5576a4b24e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Removes deprecated template options from the CLI, specifically PWA Vite, Express, and React

- [#2951](https://github.com/thirdweb-dev/js/pull/2951) [`49d4494`](https://github.com/thirdweb-dev/js/commit/49d44940084dc43fb48836f9d628b8e36dcb917a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Increase gas on MarketplaceV3 writes

- [#2948](https://github.com/thirdweb-dev/js/pull/2948) [`44680c6`](https://github.com/thirdweb-dev/js/commit/44680c65c1cb8aeb0643fff5084b3b013460c610) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds extraGas override to transactions. Useful when gas estimates are faulty or to ensure a transaction goes through.

  ## Usage

  ```ts
  const transaction = prepareTransaction({
    to: "0x1234567890123456789012345678901234567890",
    chain: ethereum,
    client: thirdwebClient,
    value: toWei("1.0"),
    gasPrice: 30n,
    extraGas: 50_000n,
  });
  ```

- [#2932](https://github.com/thirdweb-dev/js/pull/2932) [`86105c9`](https://github.com/thirdweb-dev/js/commit/86105c9d918852da86215ec0806aadbcf8eafdea) Thanks [@gregfromstl](https://github.com/gregfromstl)! - TransactionButton throws error on reverted transaction

- [#2946](https://github.com/thirdweb-dev/js/pull/2946) [`ec149f3`](https://github.com/thirdweb-dev/js/commit/ec149f383415722d34e0de68b0807c84ad3dc55a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Read RPC url from viem chain in viem chain adapter

- [#2928](https://github.com/thirdweb-dev/js/pull/2928) [`cea736c`](https://github.com/thirdweb-dev/js/commit/cea736c7e4031b5eaebcd788488314f24d5cab83) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Filters invalid listings and auctions from marketplace

- [#2949](https://github.com/thirdweb-dev/js/pull/2949) [`0e19911`](https://github.com/thirdweb-dev/js/commit/0e199116682727f72b87b81f027f67b223bccfad) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Docs update: fix typos and add code snippet

- [#2944](https://github.com/thirdweb-dev/js/pull/2944) [`82e8911`](https://github.com/thirdweb-dev/js/commit/82e89116af8ef6e8c3c7faef1829e0e323e146ae) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Show auth provider icon in connect UI when connected to in app wallet

- [#2933](https://github.com/thirdweb-dev/js/pull/2933) [`8e0a3ce`](https://github.com/thirdweb-dev/js/commit/8e0a3cea1e354f45e7aa107851909e7d57604f0d) Thanks [@MananTank](https://github.com/MananTank)! - ### Integrate Pay Modal with TransactionButton

  By default, the Pay Modal is integrated with the `TransactionButton` component. If the user performs a transaction and does not have enough funds to execute it and if [thirdweb pay](https://portal.thirdweb.com/connect/pay/buy-with-crypto) is available for that blockchain, the Pay Modal will be displayed to allow user to buy the required amount of tokens

  A new prop `payModal` is added to the `TransactionButton` component customize the Pay Modal UI or disable it entirely

  Example: Disable Pay Modal

  ```tsx
  <TransactionButton payModal={false}> Example 1 </TransactionButton>
  ```

  Example: Customize Pay Modal UI

  ```tsx
  <TransactionButton
    payModal={{
      theme: "light",
    }}
  >
    Example 2
  </TransactionButton>
  ```

  ### Disable Pay Modal for certain configurations in `useSendTransaction` hook

  If `useSendTransaction` hook is passed `gasless: true` configuration or if current active wallet is a smart wallet with `sponsorGas: true` configuration - the Pay Modal will be disabled

- [#2929](https://github.com/thirdweb-dev/js/pull/2929) [`9f817cf`](https://github.com/thirdweb-dev/js/commit/9f817cf812e3fff6f64382778df1f99739fc3379) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Tweaked connected modal UI layout

## 5.16.0

### Minor Changes

- [#2917](https://github.com/thirdweb-dev/js/pull/2917) [`5b0c37a`](https://github.com/thirdweb-dev/js/commit/5b0c37a0d9b7ba3d7f38647bb41463e91cc91a49) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Factory address is now optional in `accountAbstraction` and `smartWallet` options.

  - Defaults to a global permissionless factory deployed on all chains.
  - Also enables switching chains for smart wallets, as long as the factory is deployed

- [#2915](https://github.com/thirdweb-dev/js/pull/2915) [`664082e`](https://github.com/thirdweb-dev/js/commit/664082e5e613b8748713522353585839fe018fc2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New `prepareDeterministicDeployTransaction` extension for deploying published contracts with the same address on multiple chains

- [#2921](https://github.com/thirdweb-dev/js/pull/2921) [`d77b6f6`](https://github.com/thirdweb-dev/js/commit/d77b6f67adc6eaf7c306ef738714e8d650ed5af3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the 'use client' directive to all client-only components

- [#2919](https://github.com/thirdweb-dev/js/pull/2919) [`47de345`](https://github.com/thirdweb-dev/js/commit/47de345b604dbd9afbaaa95a76569b9029d69b00) Thanks [@jnsdls](https://github.com/jnsdls)! - Add support for several additional wallets

### Patch Changes

- [#2914](https://github.com/thirdweb-dev/js/pull/2914) [`24a3ee4`](https://github.com/thirdweb-dev/js/commit/24a3ee49d182a840c864a221eee4dd7d05c5c469) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix legacy transactions with in-app wallets

- [#2913](https://github.com/thirdweb-dev/js/pull/2913) [`5525a0e`](https://github.com/thirdweb-dev/js/commit/5525a0e336177407d508da37058ca24a3abfae37) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Filter invalid auctions in getAllAuctions

- [#2911](https://github.com/thirdweb-dev/js/pull/2911) [`35acbcd`](https://github.com/thirdweb-dev/js/commit/35acbcd10e146b886dfe8a83cd485e96b8c70928) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Updates mintWithSignature return types to properly parse

## 5.15.0

### Minor Changes

- [#2875](https://github.com/thirdweb-dev/js/pull/2875) [`7882b22`](https://github.com/thirdweb-dev/js/commit/7882b22306c1ccd4919fe088dfcd7c68bff954f9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for Coinbase Smart Wallet

- [#2898](https://github.com/thirdweb-dev/js/pull/2898) [`88886ac`](https://github.com/thirdweb-dev/js/commit/88886acd762e637ac130bb7fa0eda12c6e5da4fc) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds overrides to extension functions

### Patch Changes

- [#2906](https://github.com/thirdweb-dev/js/pull/2906) [`75e66b1`](https://github.com/thirdweb-dev/js/commit/75e66b189d790778358edeacdd71965f248902c2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix signTypedData external verification for smart accounts

- [#2897](https://github.com/thirdweb-dev/js/pull/2897) [`f916d7a`](https://github.com/thirdweb-dev/js/commit/f916d7a453854bcb8c6f0b9c95b49d34eb865882) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes TransactionButton loading state layout shift

- [#2905](https://github.com/thirdweb-dev/js/pull/2905) [`9a031bb`](https://github.com/thirdweb-dev/js/commit/9a031bb19fe9b39ff88a02c48c311ba5c3184aab) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Bump timeout for userOps receipts to 2mins

- [#2899](https://github.com/thirdweb-dev/js/pull/2899) [`e6fce1f`](https://github.com/thirdweb-dev/js/commit/e6fce1f2e617c795377ef4de12e2112f1fa03ebb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes useContractEvents duplicating events

## 5.14.0

### Minor Changes

- [#2869](https://github.com/thirdweb-dev/js/pull/2869) [`fa4bd43`](https://github.com/thirdweb-dev/js/commit/fa4bd436e01041419b668379103abb2759dc702f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the disabled prop to TransactionButton component

### Patch Changes

- [#2881](https://github.com/thirdweb-dev/js/pull/2881) [`7f4caf0`](https://github.com/thirdweb-dev/js/commit/7f4caf06274ed9a0c753f034f5b8279e618a0644) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix nonce value for ethers5 adapter

- [#2874](https://github.com/thirdweb-dev/js/pull/2874) [`d2aead4`](https://github.com/thirdweb-dev/js/commit/d2aead486e4335130b8fa8d3961c3a99da9a07b3) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Docs: update incorrect code snippet for viem adapter

- [#2882](https://github.com/thirdweb-dev/js/pull/2882) [`bfdfc23`](https://github.com/thirdweb-dev/js/commit/bfdfc23e3aac6cf977774e3905dfe97c8b49d69a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Better error message for failed smart wallet connections

- [#2879](https://github.com/thirdweb-dev/js/pull/2879) [`597900b`](https://github.com/thirdweb-dev/js/commit/597900bdcc2c51e4623a3c196c5ccf9cc704e12c) Thanks [@MananTank](https://github.com/MananTank)! - - Add onConnect prop on `AutoConnect` component

  - Call the `onConnect` callback passed to `ConnectButton` and `ConnectEmbed` when wallet is auto-connected

- [#2866](https://github.com/thirdweb-dev/js/pull/2866) [`62c799d`](https://github.com/thirdweb-dev/js/commit/62c799d3484abe54a9c648148e5e207876f8bb46) Thanks [@MananTank](https://github.com/MananTank)! - Fix exception on passing chain with unknown chainId to ConnectButton

- [#2872](https://github.com/thirdweb-dev/js/pull/2872) [`99298b3`](https://github.com/thirdweb-dev/js/commit/99298b397c2fa03e98d8a4a828a483e243815e1d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add optional `icon` in `ChainOptions` when defining a chain

- [#2867](https://github.com/thirdweb-dev/js/pull/2867) [`674fcc7`](https://github.com/thirdweb-dev/js/commit/674fcc7e9510e85f67d6ab7b056612a15856e0df) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes single phase drop compatibility across erc20, erc721, and erc1155 contracts

- [#2883](https://github.com/thirdweb-dev/js/pull/2883) [`48e6427`](https://github.com/thirdweb-dev/js/commit/48e6427d657ec202b8415d716411a6d6b194d185) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improve docs for verifySignature

- [#2870](https://github.com/thirdweb-dev/js/pull/2870) [`8ae8e6a`](https://github.com/thirdweb-dev/js/commit/8ae8e6a702d074890c145005a32450fe7ee44b27) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix TransactionButton layout shift while loading

## 5.13.0

### Minor Changes

- [#2853](https://github.com/thirdweb-dev/js/pull/2853) [`56c139c`](https://github.com/thirdweb-dev/js/commit/56c139c5a2c1e702e038a8948fefd647b3695823) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add account abstraction options to `useConnect` and handle smart wallet autoconnection outside of UI components

### Patch Changes

- [#2859](https://github.com/thirdweb-dev/js/pull/2859) [`03d8d6c`](https://github.com/thirdweb-dev/js/commit/03d8d6c15b02fb6889680484daf40f6189ad6359) Thanks [@jnsdls](https://github.com/jnsdls)! - add `gasless` prop to `<TransactionButton />`

- [#2861](https://github.com/thirdweb-dev/js/pull/2861) [`5b83353`](https://github.com/thirdweb-dev/js/commit/5b833532372dd6e96dd0aeda7a4b190e9f280d4f) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Export airdrop extensions

- [#2857](https://github.com/thirdweb-dev/js/pull/2857) [`77c2a8a`](https://github.com/thirdweb-dev/js/commit/77c2a8ae0cdb49091bd961b60ef5c316ccd6e119) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Docs: update incorrect code snippets, fix typos

## 5.12.0

### Minor Changes

- [#2841](https://github.com/thirdweb-dev/js/pull/2841) [`2ae9a13`](https://github.com/thirdweb-dev/js/commit/2ae9a13b01e7a436536b3d412690150f9f960c72) Thanks [@kumaryash90](https://github.com/kumaryash90)! - SDK V5 extension for new Airdrop contract.

- [#2846](https://github.com/thirdweb-dev/js/pull/2846) [`e8e3368`](https://github.com/thirdweb-dev/js/commit/e8e3368fdef1aa9aaefe6243486395b666b47137) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add isERC20 extension

### Patch Changes

- [#2848](https://github.com/thirdweb-dev/js/pull/2848) [`41be954`](https://github.com/thirdweb-dev/js/commit/41be954bd0a92d49767d62a6fa02f1ee0effb469) Thanks [@jnsdls](https://github.com/jnsdls)! - add `celo` chains to known `op stack` chains

- [#2850](https://github.com/thirdweb-dev/js/pull/2850) [`aa0b8c4`](https://github.com/thirdweb-dev/js/commit/aa0b8c44650b9d0f45f6dff66ebbceb64cfd7be3) Thanks [@MananTank](https://github.com/MananTank)! - Fix "All wallets" UI in Connect

  - Remove duplicated entry for "inApp"
  - Remove wallets specified by developer

## 5.11.0

### Minor Changes

- [#2679](https://github.com/thirdweb-dev/js/pull/2679) [`560d8ad`](https://github.com/thirdweb-dev/js/commit/560d8adafa011dc48e48e73d7eb6a36170d38cef) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Add support for connecting in-app wallet using phone number

  ## Usage in TypeScript

  ```ts
  import { createThirdwebClient, createWallet } from "thirdweb";
  import { preAuthenticate } from "thirdweb/wallets/in-app";

  const client = createThirdwebClient({ clientId: "..." });

  const phoneNumber = '+123456789';

  // Send OTP to given phone number
  async function sendOTP() {
    await preAuthenticate({
      strategy: "phone",
      phoneNumber,
      client,
    });
  }

  async function connect() {
    // create a in-app wallet instance
    const wallet = createWallet('inApp');
    // if the OTP is correct, the wallet will be connected else an error will be thrown
    const account = await wallet.connect({
      client,
      strategy: "phone";
      phoneNumber,
      verificationCode: '...' // Pass the OTP entered by the user
    });

    console.log('connected to', account);
  }
  ```

  ## Usage in React

  ```tsx
  import { createThirdwebClient } from "thirdweb";
  import { preAuthenticate } from "thirdweb/wallets/in-app";
  import { useConnect } from "thirdweb/react";

  const client = createThirdwebClient({ clientId: "..." });

  function Component() {
    const { connect } = useConnect();
    const [phoneNumber, setPhoneNumber] = useState(''); // get phone number from user
    const [otp, setOtp] = useState(''); // get OTP from user

    // Send OTP to given phone number
    async function sendOTP() {
      await preAuthenticate({
        strategy: "phone",
        phoneNumber,
        client,
      });
    }

    async function connect() {
      // create a in-app wallet instance
      const wallet = createWallet('inApp');
      // if the OTP is correct, the wallet will be connected else an error will be thrown
      await wallet.connect({
        client,
        strategy: "phone";
        phoneNumber,
        verificationCode: otp
      });

      // set the wallet as active
      connect(wallet)
    }

    // render UI to get OTP and phone number from user
    return <div> ...  </div>
  }
  ```

- [#2818](https://github.com/thirdweb-dev/js/pull/2818) [`948f155`](https://github.com/thirdweb-dev/js/commit/948f155e7c2406cc5a172a6c5abe18ba8da89e2a) Thanks [@jnsdls](https://github.com/jnsdls)! - **Gasless transactions in Typescript**

  ```ts
  import { sendTransaction } from "thirdweb";

  const result = sendTransaction({
    transaction,
    account,
    gasless: {
      provider: "engine",
      relayerUrl: "https://...",
      relayerForwarderAddress: "0x...",
    },
  });
  ```

  **Gasless transactions in React**

  ```jsx
  import { useSendTransaction } from "thirdweb/react";

  const { mutate } = useSendTransaction({
    gasless: {
      provider: "engine",
      relayerUrl: "https://...",
      relayerForwarderAddress: "0x...",
    },
  });

  // Call mutate with the transaction object
  mutate(transaction);
  ```

### Patch Changes

- [#2842](https://github.com/thirdweb-dev/js/pull/2842) [`d7e6671`](https://github.com/thirdweb-dev/js/commit/d7e6671c0a34cc8a3523f397a45d754617c9fbb0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - fix: handle signature minting with price and currency

- [#2839](https://github.com/thirdweb-dev/js/pull/2839) [`3be61dd`](https://github.com/thirdweb-dev/js/commit/3be61ddc52cef168cda0bee13e93a926dedf479a) Thanks [@MananTank](https://github.com/MananTank)! - Enable Buy Modal by default with useSendTransaction hook

- [#2768](https://github.com/thirdweb-dev/js/pull/2768) [`cfff7e8`](https://github.com/thirdweb-dev/js/commit/cfff7e838af1c464c9b5fbb547153eaae41e2c66) Thanks [@MananTank](https://github.com/MananTank)! - Fix custom chain not being used

## 5.10.1

### Patch Changes

- [#2836](https://github.com/thirdweb-dev/js/pull/2836) [`3810df5`](https://github.com/thirdweb-dev/js/commit/3810df57aa9590b0a2fa14071a5c061bd94b1ec6) Thanks [@jnsdls](https://github.com/jnsdls)! - add missing events for `erc721`, `erc1155` and `erc20`

## 5.10.0

### Minor Changes

- [#2822](https://github.com/thirdweb-dev/js/pull/2822) [`a919b27`](https://github.com/thirdweb-dev/js/commit/a919b27c7af41dc003ddb643eb0641eaa8aefc07) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add multicall3 extension

### Patch Changes

- [#2834](https://github.com/thirdweb-dev/js/pull/2834) [`be85410`](https://github.com/thirdweb-dev/js/commit/be8541054e392a12678ffee534284e7d1b203ad4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - fix: erc1155 sigmint with additional supply

- [#2831](https://github.com/thirdweb-dev/js/pull/2831) [`38f3b2e`](https://github.com/thirdweb-dev/js/commit/38f3b2eb21e74e5947f03cc594dee22c96099f8b) Thanks [@MananTank](https://github.com/MananTank)! - Fix In-App + Smart wallet Connection issue

## 5.9.0

### Minor Changes

- [#2793](https://github.com/thirdweb-dev/js/pull/2793) [`4dbcbd1`](https://github.com/thirdweb-dev/js/commit/4dbcbd13dbd388454993aee7e67b43bb9d9249aa) Thanks [@jnsdls](https://github.com/jnsdls)! - **thirdweb/react**

  Add a new optional `auth` prop to `<ConnectButton />` to allow specifying a SIWE auth flow after users connect their wallets.

  ```jsx
  <ConnectButton
    client={client}
    auth={{
      isLoggedIn: async (address) => {
        // check if the user is logged in by calling your server, etc.
        // then return a boolean value
        return true || false;
      },
      getLoginPayload: async ({ address, chainId }) => {
        // send the address (and optional chainId) to your server to generate the login payload for the user to sign
        // you can use the `generatePayload` function from `thirdweb/auth` to generate the payload
        // once you have retrieved the payload return it from this function

        return; // <the login payload here>
      },
      doLogin: async (loginParams) => {
        // send the login params to your server where you can validate them using the `verifyPayload` function
        // from `thirdweb/auth`
        // you can then set a cookie or return a token to save in local storage, etc
        // `isLoggedIn` will automatically get called again after this function resolves
      },
      doLogout: async () => {
        //  do anything you need to do such as clearing cookies, etc when the user should be logged out
        // `isLoggedIn` will automatically get called again after this function resolves
      },
    }}
  />
  ```

### Patch Changes

- [#2816](https://github.com/thirdweb-dev/js/pull/2816) [`d664647`](https://github.com/thirdweb-dev/js/commit/d6646475e2715c666316174e1c035a035a075ab1) Thanks [@jnsdls](https://github.com/jnsdls)! - adapters(viem): explicitly type walletClient return type

## 5.8.0

### Minor Changes

- [#2806](https://github.com/thirdweb-dev/js/pull/2806) [`94e354a`](https://github.com/thirdweb-dev/js/commit/94e354aad30fc94b4d4c379e01810b0f4e2087bf) Thanks [@jnsdls](https://github.com/jnsdls)! - Implement `Offers` in the Marketplace extensions, available via `thirdweb/extensions/marketplace`.

- [#2814](https://github.com/thirdweb-dev/js/pull/2814) [`bebcf46`](https://github.com/thirdweb-dev/js/commit/bebcf46c3a900fcbff6d544b18c7f0140c5ca9be) Thanks [@jnsdls](https://github.com/jnsdls)! - Add support for updating metadata for ERC1155 contracts

- [#2811](https://github.com/thirdweb-dev/js/pull/2811) [`1b2bfc8`](https://github.com/thirdweb-dev/js/commit/1b2bfc83d786d1c7b7d1fefa480dbab559e84c54) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added ERC1155 and ERC20 signature mint extensions

### Patch Changes

- [#2815](https://github.com/thirdweb-dev/js/pull/2815) [`381b669`](https://github.com/thirdweb-dev/js/commit/381b669cd1b4c621519636211f47a6910ca048f0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix query invalidation when using react hooks

## 5.7.0

### Minor Changes

- [#2803](https://github.com/thirdweb-dev/js/pull/2803) [`a54c745`](https://github.com/thirdweb-dev/js/commit/a54c745977e7806c0339633486eef55f92b02832) Thanks [@jnsdls](https://github.com/jnsdls)! - Added new extensions for "English Auctions" in `thirdweb/extensions/marketplace` module:

  - `bidInAuction`
  - `cancelAuction`
  - `buyoutAuction`
  - `collectAuctionPayout`
  - `collectAuctionTokens`
  - `executeSale`

- [#2767](https://github.com/thirdweb-dev/js/pull/2767) [`300e4c8`](https://github.com/thirdweb-dev/js/commit/300e4c8a51581156acdfac431655510f0cdbca21) Thanks [@MananTank](https://github.com/MananTank)! - Open "Pay Modal" UI when sending transaction using the `useSendTransaction` hook if the user does not have enough funds to execute the transaction to prompt the user to buy tokens

  `useSendTransaction` now takes an optional `config` option to customize the "Pay Modal" UI

  ```tsx
  const sendTransaction = useSendTransaction({
    payModal: {
      locale: "en_US",
      theme: "light",
    },
  });
  ```

  You may also explicitly disable the "Pay Modal" UI by setting the `payModal` option to `false`

  ```tsx
  const sendTransaction = useSendTransaction({
    payModal: false,
  });
  ```

- [#2788](https://github.com/thirdweb-dev/js/pull/2788) [`f5abbe8`](https://github.com/thirdweb-dev/js/commit/f5abbe8b54fbd68188c40268ae5707c72f39441f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added `deployPublishedContract`

### Patch Changes

- [#2795](https://github.com/thirdweb-dev/js/pull/2795) [`7c17892`](https://github.com/thirdweb-dev/js/commit/7c178923f9072d8f43b0d23f3888fdedae540005) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix claiming drops with prices and no allowlists

- [#2785](https://github.com/thirdweb-dev/js/pull/2785) [`4c7153c`](https://github.com/thirdweb-dev/js/commit/4c7153c95df1962d1e530a3d8227960cd87f6a61) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#2799](https://github.com/thirdweb-dev/js/pull/2799) [`37bd0e4`](https://github.com/thirdweb-dev/js/commit/37bd0e42a58cdbe5b04a9871b5fd413ec293d96c) Thanks [@jnsdls](https://github.com/jnsdls)! - fix `npx thirdweb` on windows when `thirdweb` is installed locally

## 5.6.0

### Minor Changes

- [#2760](https://github.com/thirdweb-dev/js/pull/2760) [`8197b3c`](https://github.com/thirdweb-dev/js/commit/8197b3ced288597979f27ab88abecadad5dac2cb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds serializeTransaction and updates sign return object to include yParity

- [#2766](https://github.com/thirdweb-dev/js/pull/2766) [`65e4ddc`](https://github.com/thirdweb-dev/js/commit/65e4ddc8e02467c170658d29d71dca53737548b7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added ERC721 extensions:

  - claimTo with allowlist support
  - lazyMint
  - setClaimConditions

- [#2771](https://github.com/thirdweb-dev/js/pull/2771) [`df338f5`](https://github.com/thirdweb-dev/js/commit/df338f5f75545dcf717c39e045e2c7e9f64e5f9d) Thanks [@jnsdls](https://github.com/jnsdls)! - Added ERC20 extensions:

  - claimTo with allowlist support
  - setClaimConditions

- [#2757](https://github.com/thirdweb-dev/js/pull/2757) [`9d46fce`](https://github.com/thirdweb-dev/js/commit/9d46fce50fe7ef5750ddf9fefe8131cf190450db) Thanks [@jnsdls](https://github.com/jnsdls)! - add extensions for contract roles in the `thirdweb/extensions/permissions` namespace

### Patch Changes

- [#2761](https://github.com/thirdweb-dev/js/pull/2761) [`a18fc8e`](https://github.com/thirdweb-dev/js/commit/a18fc8e1b7d7f351e43367f6a6fd77674998e701) Thanks [@MananTank](https://github.com/MananTank)! - Connect UI context code cleanup

## 5.5.0

### Minor Changes

- [#2752](https://github.com/thirdweb-dev/js/pull/2752) [`39c6fbc`](https://github.com/thirdweb-dev/js/commit/39c6fbc5521a816c7d9a23933cb41ad76a925d14) Thanks [@jnsdls](https://github.com/jnsdls)! - add `concatHex` utility function

- [#2744](https://github.com/thirdweb-dev/js/pull/2744) [`db05717`](https://github.com/thirdweb-dev/js/commit/db0571780304a7b631646b046522fa15352b5467) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added 1155 extensions:

  - `claimTo` with allowlist support
  - `lazyMint`
  - `setClaimConditions`

- [#2749](https://github.com/thirdweb-dev/js/pull/2749) [`eb919ed`](https://github.com/thirdweb-dev/js/commit/eb919ed49d57589614ac959cb6cbd7c9c19cac07) Thanks [@jnsdls](https://github.com/jnsdls)! - - storage: `upload` now returns a single `uri` when a single file is passed to the `files` array.
  - extensions: added suport for `royalty`, `platformFee` and `primarySale` extensions

### Patch Changes

- [#2748](https://github.com/thirdweb-dev/js/pull/2748) [`007770c`](https://github.com/thirdweb-dev/js/commit/007770cd635fba5d38eca5efccc55592c85a106f) Thanks [@MananTank](https://github.com/MananTank)! - - Show ENS name and avatar in ConnectButton's Details Modal

  - Add wallet ID alias `"embedded"` for `"inApp"` to avoid breaking change

  ```ts
  createWallet("embedded"); // supported but deprecated

  createWallet("inApp"); // recommended
  ```

- [#2759](https://github.com/thirdweb-dev/js/pull/2759) [`07f98a5`](https://github.com/thirdweb-dev/js/commit/07f98a5b923166f2e16c9f1759970af2032dbb54) Thanks [@MananTank](https://github.com/MananTank)! - - Improved Swap UI in ConnectButton Details Modal

  - Prevent Modal from closing when clicking on "Switch Network" in the Swap UI
  - Fix wrong network name shown in Transaction History

- [#2756](https://github.com/thirdweb-dev/js/pull/2756) [`e6b5d9c`](https://github.com/thirdweb-dev/js/commit/e6b5d9cc5d1907cbce3aaa895239e0f45b7e880c) Thanks [@jnsdls](https://github.com/jnsdls)! - improve `resolveScheme` reliability and handle cases where `getNFT` for ERC1155 was breaking on missing `totalSupply` method

- [#2678](https://github.com/thirdweb-dev/js/pull/2678) [`9453f74`](https://github.com/thirdweb-dev/js/commit/9453f74bbfd53372fcfd942bcce6c6bfc8c00a2c) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Custom gas settings for any evm deployments

## 5.4.2

### Patch Changes

- [#2579](https://github.com/thirdweb-dev/js/pull/2579) [`d836889`](https://github.com/thirdweb-dev/js/commit/d836889f464a4fc9617839f30e2cc780b3bcca78) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Export `resolvePromisedValue` from `thirdweb/utils`

## 5.4.1

### Patch Changes

- [#2741](https://github.com/thirdweb-dev/js/pull/2741) [`900e7d0`](https://github.com/thirdweb-dev/js/commit/900e7d0324f6cd762f5f231096f4ecd4372baccc) Thanks [@MananTank](https://github.com/MananTank)! - Remove duplicated entry for MetaMask in MM browser

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
