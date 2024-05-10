# thirdweb

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
