# thirdweb

## 5.88.1

### Patch Changes

- [#6204](https://github.com/thirdweb-dev/js/pull/6204) [`f1cd253`](https://github.com/thirdweb-dev/js/commit/f1cd2539d1be15eb18807b3f5f2b90509e3d58cf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update coinbase wallet sdk

## 5.88.0

### Minor Changes

- [#6194](https://github.com/thirdweb-dev/js/pull/6194) [`9663079`](https://github.com/thirdweb-dev/js/commit/966307906212ac99dc0a2a9be88e514c920d39c4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added session keys to smart wallet options

  You can now pass a `sessionKey` to the `smartWallet` options function to immediately add a session key to the smart wallet upon connection.

  This is great in combination with an engine backend wallet! Let's you act on behalf of the user from your backend, making executing transactions as easy as a REST API call. Also unblocks automations, like renewing a subscription, or paying for a service.

  ```ts
  const wallet = smartWallet({
    sessionKey: {
      address: "0x...", // the session key address (ex: engine backend wallet)
      permissions: {
        approvedTargets: ["0x..."], // allowed contract addresses (or * for all)
        nativeTokenLimitPerTransaction: 0.1, // max spend per transaction in ETH
        permissionEndTimestamp: new Date(Date.now() + 1000 * 60 * 60), // expiration date
      },
    },
  });

  // this will connect the user wallet and add the session key if not already added
  await wallet.connect({
    client: TEST_CLIENT,
    personalAccount,
  });
  ```

  You can also pass the `sessionKey` to the `ConnectButton`, `ConnectEmbed` components and `useConnect` hook.

  ```tsx
  <ConnectButton
    client={client}
    accountAbstraction={{
      chain,
      sponsorGas: true,
      sessionKey: {
        address: "0x...",
        permissions: {
          approvedTargets: "*",
        },
      },
    }}
  />
  ```

  Also works for the `inAppWallet` `smartAccount` option!

  ```ts
  const wallet = inAppWallet({
    smartAccount: {
      chain,
      sponsorGas: true,
      sessionKey: {
        address: "0x...",
        permissions: {
          approvedTargets: "*",
        },
      },
    },
  });
  ```

### Patch Changes

- [#6193](https://github.com/thirdweb-dev/js/pull/6193) [`1f6bb7c`](https://github.com/thirdweb-dev/js/commit/1f6bb7c3294d70648b120a6a6a6cba13302a84fc) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Show fiat amount in PayEmbed main screen

- [#6192](https://github.com/thirdweb-dev/js/pull/6192) [`30e13e6`](https://github.com/thirdweb-dev/js/commit/30e13e6b9176265a2f4eddfa53578889abbcb750) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow editing pay amount mid flow

- [#6190](https://github.com/thirdweb-dev/js/pull/6190) [`2dfc245`](https://github.com/thirdweb-dev/js/commit/2dfc245d44dde86e42f6c799305db707316432aa) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add fiat provider selection in PayEmbed

- [#6187](https://github.com/thirdweb-dev/js/pull/6187) [`ee57ded`](https://github.com/thirdweb-dev/js/commit/ee57ded902cb69da6fc171599a4a90776e650149) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Requery allowances when getting back to quote screen

- [#6188](https://github.com/thirdweb-dev/js/pull/6188) [`64d7bf3`](https://github.com/thirdweb-dev/js/commit/64d7bf358fe2014b684688d41d525a75e47f1b82) Thanks [@jnsdls](https://github.com/jnsdls)! - when explicitly passing `clientId` to `createThirdwebClient()` prefer it over computing the `clientId` from a passed `secretKey` option

## 5.87.4

### Patch Changes

- [#6182](https://github.com/thirdweb-dev/js/pull/6182) [`f77165e`](https://github.com/thirdweb-dev/js/commit/f77165e2d1dd13a1887604c3431bd49b9bd67f28) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Skip swap approvals if already approved and always calculate gas prices locally

## 5.87.3

### Patch Changes

- [#6137](https://github.com/thirdweb-dev/js/pull/6137) [`a6b7e8d`](https://github.com/thirdweb-dev/js/commit/a6b7e8d81868b5f32f1c8b7ff093bb1f06c734ca) Thanks [@jnsdls](https://github.com/jnsdls)! - updated dependencies

- [#6116](https://github.com/thirdweb-dev/js/pull/6116) [`9d5828e`](https://github.com/thirdweb-dev/js/commit/9d5828eeab201960a720744ca3a59c85a0d8e548) Thanks [@alecananian](https://github.com/alecananian)! - Skip factory entrypoint lookup for ZKsync chains

- [#6119](https://github.com/thirdweb-dev/js/pull/6119) [`b693b78`](https://github.com/thirdweb-dev/js/commit/b693b78645e2b214a5f8be0eec6d335d569ceb8c) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix: Ecosystem smart wallets now properly trigger switch chain on their admin wallets

- [#6093](https://github.com/thirdweb-dev/js/pull/6093) [`08cc489`](https://github.com/thirdweb-dev/js/commit/08cc48910df351d068c1ce224d4102f40cb1dce1) Thanks [@kumaryash90](https://github.com/kumaryash90)! - 7702 delegation designator

## 5.87.2

### Patch Changes

- [#6104](https://github.com/thirdweb-dev/js/pull/6104) [`bf43196`](https://github.com/thirdweb-dev/js/commit/bf431961ec685deefc0089b8d644c35f849fbf86) Thanks [@MananTank](https://github.com/MananTank)! - Fix thirdweb Pay Modal logging react-query error when opened

## 5.87.1

### Patch Changes

- [#6106](https://github.com/thirdweb-dev/js/pull/6106) [`3361140`](https://github.com/thirdweb-dev/js/commit/33611409b0efd58803be4a96194f5872ddf4bde0) Thanks [@jnsdls](https://github.com/jnsdls)! - updated dependencies

- [#6105](https://github.com/thirdweb-dev/js/pull/6105) [`ab55aec`](https://github.com/thirdweb-dev/js/commit/ab55aec10ccb078add40bd774d157bc0f19ab0bf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow connecting wallets without setting them as active with useConnect

## 5.87.0

### Minor Changes

- [#6082](https://github.com/thirdweb-dev/js/pull/6082) [`4550bb2`](https://github.com/thirdweb-dev/js/commit/4550bb26632b88964a298835575af152a355bccd) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support Account and Wallet headless components in react native

  You can now use the Account and Wallet headless components in react native, this lets you build your own UI, styling it however you want, but letting the components handle the logic.

  Example Account components usage:

  ```tsx
  <AccountProvider address={account.address} client={client}>
    /* avatar */
    <AccountAvatar
      loadingComponent={
        <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
      }
      fallbackComponent={
        <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
      }
      style={{
        width: 92,
        height: 92,
        borderRadius: 100,
      }}
    />
    /* address */
    <AccountAddress
      style={{ fontSize: 16, color: Colors.secondary }}
      formatFn={shortenAddress}
    />
    /* balance */
    <AccountBalance
      showBalanceInFiat={"USD"}
      chain={chain}
      loadingComponent={
        <ActivityIndicator size="large" color={Colors.accent} />
      }
      fallbackComponent={
        <Text className="text-primary">Failed to load balance</Text>
      }
      style={{
        color: "white",
        fontSize: 48,
        fontWeight: "bold",
      }}
    />
  </AccountProvider>
  ```

  Example Wallet components usage:

  ```tsx
  <WalletProvider id={"io.metamask"}>
    <WalletIcon width={32} height={32} />
    <WalletName style={{ fontSize: 16, color: Colors.primary }} />
  </WalletProvider>
  ```

### Patch Changes

- [#6079](https://github.com/thirdweb-dev/js/pull/6079) [`1616b7f`](https://github.com/thirdweb-dev/js/commit/1616b7f6198d43fc48a1269b1cca93958cbf7dba) Thanks [@jnsdls](https://github.com/jnsdls)! - export `randomPrivateKey` from `thirdweb/wallets`

- [#6076](https://github.com/thirdweb-dev/js/pull/6076) [`1401f8d`](https://github.com/thirdweb-dev/js/commit/1401f8d0393bbea149e9e09ba686416fc0a7b4f3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix autoconnection of inapp wallets in react native

- [#6079](https://github.com/thirdweb-dev/js/pull/6079) [`1616b7f`](https://github.com/thirdweb-dev/js/commit/1616b7f6198d43fc48a1269b1cca93958cbf7dba) Thanks [@jnsdls](https://github.com/jnsdls)! - updated dependencies

## 5.86.6

### Patch Changes

- [#6074](https://github.com/thirdweb-dev/js/pull/6074) [`94e2d5b`](https://github.com/thirdweb-dev/js/commit/94e2d5b8ddd90c0eaa985d02b08b9afa9f8e6676) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix account linking for ecosystem smart wallets

## 5.86.5

### Patch Changes

- [#6072](https://github.com/thirdweb-dev/js/pull/6072) [`2cebb42`](https://github.com/thirdweb-dev/js/commit/2cebb420e6a381cf41a48e17762f6c655ebe7d8c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix showing link profiles for ecosystem smart wallets

## 5.86.4

### Patch Changes

- [#6068](https://github.com/thirdweb-dev/js/pull/6068) [`6c277ae`](https://github.com/thirdweb-dev/js/commit/6c277ae6764dbf1a9218fbd5d278ffb5e3dbde1f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect passed in chain when connecting to inapp wallet with wallet strategy

## 5.86.3

### Patch Changes

- [#6057](https://github.com/thirdweb-dev/js/pull/6057) [`b6f189c`](https://github.com/thirdweb-dev/js/commit/b6f189c22023154ca3d1db92721b5e2e50b83e94) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updated dependencies

## 5.86.2

### Patch Changes

- [#6046](https://github.com/thirdweb-dev/js/pull/6046) [`5ad442c`](https://github.com/thirdweb-dev/js/commit/5ad442cf0cb28b0799ff9a93fa728348ce9e628a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Simplify in-app wallet login flow

- [#6040](https://github.com/thirdweb-dev/js/pull/6040) [`a67d342`](https://github.com/thirdweb-dev/js/commit/a67d342779e35971fc67e8fd103e47f632928b5a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Always use 712 signature verification if the smart account is already deployed

- [#6042](https://github.com/thirdweb-dev/js/pull/6042) [`60edce4`](https://github.com/thirdweb-dev/js/commit/60edce49c0b8120fdd285017eb1721747eef1721) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix prompting for generic WC connection on mobile

- [#6025](https://github.com/thirdweb-dev/js/pull/6025) [`21cc45a`](https://github.com/thirdweb-dev/js/commit/21cc45adc2bb82bf942bf62767947e5e337fa5f0) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix (in app wallets): error when calling connect for backend strategy due to `document` reference

## 5.86.1

### Patch Changes

- [#6011](https://github.com/thirdweb-dev/js/pull/6011) [`b38604c`](https://github.com/thirdweb-dev/js/commit/b38604cce81832303dcf51ab058f6621045e9aff) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes issue with chain switching breaking after disconnect

- [#6015](https://github.com/thirdweb-dev/js/pull/6015) [`8bbee03`](https://github.com/thirdweb-dev/js/commit/8bbee03c77abe95d2c4a48b46fefa9086de3b749) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes issue with smart wallets used on SiteLink and SiteEmbed

- [#6020](https://github.com/thirdweb-dev/js/pull/6020) [`ab9a148`](https://github.com/thirdweb-dev/js/commit/ab9a148b754da04527d4e49359565b14d5c4f3ca) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Better transaction tracking for smart wallets

## 5.86.0

### Minor Changes

- [#5989](https://github.com/thirdweb-dev/js/pull/5989) [`8b5cb47`](https://github.com/thirdweb-dev/js/commit/8b5cb47339af2d5794d642f484429b19b4d313be) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Adds deployMarketplaceContract

  ```ts
  import { deployMarketplaceContract } from "thirdweb/deploys";

  const address = await deployMarketplaceContract({
    client,
    chain,
    account,
    params: {
      name: "MarketplaceV3",
      description: "MarketplaceV3 deployed using thirdweb SDK",
      platformFeeRecipient: "0x21d514c90ee4E4e4Cd16Ce9185BF01F0F1eE4A04",
      platformFeeBps: 1000,
    },
  });
  ```

### Patch Changes

- [#6004](https://github.com/thirdweb-dev/js/pull/6004) [`bb6c71e`](https://github.com/thirdweb-dev/js/commit/bb6c71e9681606376d3894b94afb4f68c438ae23) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fallback to eip1193 provider chain when switching chain is not supported

## 5.85.0

### Minor Changes

- [#5972](https://github.com/thirdweb-dev/js/pull/5972) [`0b62397`](https://github.com/thirdweb-dev/js/commit/0b6239735ea01b68533784d629a7bd5ab8752b94) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support multiple messages for Nebula API, updated input props.

  Some prop names have been updated:

  `prompt -> messsage`
  `context -> contextFilter`

  ```ts
  Nebula.chat({
    client,
    // prompt is now message
    message:
      "What's the total supply of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
    // contextFilter is now contextFilter
    contextFilter: {
      chains: [sepolia],
    },
  });
  ```

  The Nebula.chat and Nebula.execute functions now support multiple input messages, and the input properties have been updated to match the http API.

  ```ts
  Nebula.chat({
    client,
    // multi message format
    messages: [
      {
        role: "user",
        content:
          "Tell me the name of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
      },
      {
        role: "assistant",
        content: "The name of the contract is My NFT Collection",
      },
      {
        role: "user",
        content: "What's the symbol of this contract?",
      },
    ],
    contextFilter: {
      chains: [sepolia],
    },
  });
  ```

  Same changes apply to Nebula.execute.

  ```ts
  Nebula.execute({
    client,
    account,
    messages: [
      { role: "user", content: "What's the address of vitalik.eth" },
      {
        role: "assistant",
        content:
          "The address of vitalik.eth is 0xd8dA6BF26964aF8E437eEa5e3616511D7G3a3298",
      },
      { role: "user", content: "Send them 0.0001 ETH" },
    ],
    contextFilter: {
      chains: [sepolia],
    },
  });
  ```

### Patch Changes

- [#5966](https://github.com/thirdweb-dev/js/pull/5966) [`4ffcf30`](https://github.com/thirdweb-dev/js/commit/4ffcf305abdced715a76638a3af47d0f91e24e01) Thanks [@MananTank](https://github.com/MananTank)! - Fix NFT components not displaying correct metadata if multiple contracts with same token id is rendered because of incorrect caching

- [#5973](https://github.com/thirdweb-dev/js/pull/5973) [`dbb64ea`](https://github.com/thirdweb-dev/js/commit/dbb64ea190b248c5e4e04c98b0e6bc178fd729a0) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Update implementations

- [#5982](https://github.com/thirdweb-dev/js/pull/5982) [`b6d65cf`](https://github.com/thirdweb-dev/js/commit/b6d65cf1c42a6c6707489e2d3ab3510f137c1b35) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Added `mode` as a predefined chain

- [#5967](https://github.com/thirdweb-dev/js/pull/5967) [`9cbcbe7`](https://github.com/thirdweb-dev/js/commit/9cbcbe776032556717b3d0b30e774323f75c63ee) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Added overrides for Lumia Testnet to use pre-EIP1559 gas values

## 5.84.0

### Minor Changes

- [#5889](https://github.com/thirdweb-dev/js/pull/5889) [`7a3dff0`](https://github.com/thirdweb-dev/js/commit/7a3dff01cd4ef1b20b783312f4cb755dd2fddcbd) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Exposes autoConnect as a standalone function for use outside of react.

  ```tsx
  import { autoConnect } from "thirdweb/wallets";

  const autoConnected = await autoConnect({
    client,
    onConnect: (wallet) => {
      console.log("wallet", wallet); /// wallet that is have been auto connected.
    },
  });
  console.log("isAutoConnected", isAutoConnected); // true or false
  ```

- [#5947](https://github.com/thirdweb-dev/js/pull/5947) [`d1c03b0`](https://github.com/thirdweb-dev/js/commit/d1c03b0cbc524d39d827f1e0d48f3532a837efb0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Introducing `engineAccount()` for backend usage

  You can now use `engineAccount()` on the backend to create an account that can send transactions via your engine instance.

  This lets you use the full catalog of thirdweb SDK functions and extensions on the backend, with the performance, reliability, and monitoring of your engine instance.

  ```ts
  // get your engine url, auth token, and wallet address from your engine instance on the dashboard
  const engine = engineAccount({
    engineUrl: process.env.ENGINE_URL,
    authToken: process.env.ENGINE_AUTH_TOKEN,
    walletAddress: process.env.ENGINE_WALLET_ADDRESS,
  });

  // Now you can use engineAcc to send transactions, deploy contracts, etc.
  // For example, you can prepare extension functions:
  const tx = await claimTo({
    contract: getContract({ client, chain, address: "0x..." }),
    to: "0x...",
    tokenId: 0n,
    quantity: 1n,
  });

  // And then send the transaction via engine
  // this will automatically wait for the transaction to be mined and return the transaction hash
  const result = await sendTransaction({
    account: engine, // forward the transaction to your engine instance
    transaction: tx,
  });

  console.log(result.transactionHash);
  ```

- [#5948](https://github.com/thirdweb-dev/js/pull/5948) [`b10f306`](https://github.com/thirdweb-dev/js/commit/b10f306fba2140cf7a702d4fc5c55c316986a6b6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Introducing Nebula API

  You can now chat with Nebula and ask it to execute transactions with your wallet.

  Ask questions about real time blockchain data.

  ```ts
  import { Nebula } from "thirdweb/ai";

  const response = await Nebula.chat({
    client: TEST_CLIENT,
    prompt:
      "What's the symbol of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
    context: {
      chains: [sepolia],
    },
  });

  console.log("chat response:", response.message);
  ```

  Ask it to execute transactions with your wallet.

  ```ts
  import { Nebula } from "thirdweb/ai";

  const wallet = createWallet("io.metamask");
  const account = await wallet.connect({ client });

  const result = await Nebula.execute({
    client,
    prompt: "send 0.0001 ETH to vitalik.eth",
    account,
    context: {
      chains: [sepolia],
    },
  });

  console.log("executed transaction:", result.transactionHash);
  ```

### Patch Changes

- [#5926](https://github.com/thirdweb-dev/js/pull/5926) [`4b5661b`](https://github.com/thirdweb-dev/js/commit/4b5661b9817d1e0d67a8574d7c5931d3e892a006) Thanks [@MananTank](https://github.com/MananTank)! - Export `toEventSelector` utility function from "thirdweb/utils"

- [#5923](https://github.com/thirdweb-dev/js/pull/5923) [`42a313f`](https://github.com/thirdweb-dev/js/commit/42a313f3b2d89696d5374e5a705e9f144bf46ebe) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Fix deploy version for published contracts

- [#5924](https://github.com/thirdweb-dev/js/pull/5924) [`7fb5ce1`](https://github.com/thirdweb-dev/js/commit/7fb5ce1cc3af8bc9d99fef52018d3e1c7b558eaa) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Ensure resetting deploy flag on bundler errors

- [#5937](https://github.com/thirdweb-dev/js/pull/5937) [`0e2b3df`](https://github.com/thirdweb-dev/js/commit/0e2b3df42aee57f30b7e8c32dbf034f5deb37303) Thanks [@MananTank](https://github.com/MananTank)! - Add `isValidENSName` utility function for checking if a string is a valid ENS name. It does not check if the name is actually registered, it only checks if the string is in a valid format.

  ```ts
  import { isValidENSName } from "thirdweb/utils";

  isValidENSName("thirdweb.eth"); // true
  isValidENSName("foo.bar.com"); // true
  isValidENSName("foo"); // false
  ```

- [#5790](https://github.com/thirdweb-dev/js/pull/5790) [`e331e43`](https://github.com/thirdweb-dev/js/commit/e331e433ac90920fc3bd710d8aa00bc9ec03fa22) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Migrated underlying functionality to Ox

- [#5914](https://github.com/thirdweb-dev/js/pull/5914) [`c5c6f9d`](https://github.com/thirdweb-dev/js/commit/c5c6f9d7415a438ddb0823764884d9c77b687163) Thanks [@MananTank](https://github.com/MananTank)! - Do not prompt user for signing message for SIWE auth in Connect UI for Ecosystem wallets

## 5.83.1

### Patch Changes

- [#5918](https://github.com/thirdweb-dev/js/pull/5918) [`5d71415`](https://github.com/thirdweb-dev/js/commit/5d7141561809525ffc293d8274d422ba0ecb2982) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix PayEmbed purchase success callback and insufficient funds displayed when no metadata is passed in

- [#5915](https://github.com/thirdweb-dev/js/pull/5915) [`bfc4778`](https://github.com/thirdweb-dev/js/commit/bfc477833422995187a92d905dc564219b629974) Thanks [@jnsdls](https://github.com/jnsdls)! - respect custom RPC urls passed directly

## 5.83.0

### Minor Changes

- [#5878](https://github.com/thirdweb-dev/js/pull/5878) [`70b7b5c`](https://github.com/thirdweb-dev/js/commit/70b7b5c5ffc965e4e39fa1ce768a11a2cda5465a) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Add support for backend wallets.

  This is useful is you have a backend that is connected to an that you want to have programmatic access to a wallet without managing private keys.

  Here's how you'd do it:

  ```typescript
  const wallet = inAppWallet();
  const account = await wallet.connect({
    strategy: "backend",
    client: createThirdwebClient({
      secretKey: "...",
    }),
    walletSecret: "...",
  });
  console.log("account.address", account.address);
  ```

  Note that `walletSecret` should be generated by you and securely stored to uniquely authenticate to the given wallet.

### Patch Changes

- [#5904](https://github.com/thirdweb-dev/js/pull/5904) [`5e2eec3`](https://github.com/thirdweb-dev/js/commit/5e2eec3b178bcad0988ba7086e31514a3fb7b5d5) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Fix batch fetch util for marketplace-v3

## 5.82.0

### Minor Changes

- [#5801](https://github.com/thirdweb-dev/js/pull/5801) [`429e112`](https://github.com/thirdweb-dev/js/commit/429e1127b27354386cd2be1838c1b9e25c956117) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Adds beta support for EIP-7702 authorization lists

  ```ts
  import {
    prepareTransaction,
    sendTransaction,
    signAuthorization,
  } from "thirdweb";

  const authorization = await signAuthorization({
    request: {
      address: "0x...",
      chainId: 911867,
      nonce: 100n,
    },
    account: myAccount,
  });

  const transaction = prepareTransaction({
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
    value: 100n,
    to: TEST_WALLET_B,
    authorizationList: [authorization],
  });

  const res = await sendTransaction({
    account,
    transaction,
  });
  ```

- [#5845](https://github.com/thirdweb-dev/js/pull/5845) [`b058f68`](https://github.com/thirdweb-dev/js/commit/b058f688a751486de1cffdcd5db4c846db6bb2ab) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Adds `deploySmartAccount` function to force the deployment of a smart account.

  ```ts
  const account = await deploySmartAccount({
    smartAccount,
    chain,
    client,
    accountContract,
  });
  ```

  Fix: Uses 1271 signatures if the smart account is already deployed.

## 5.81.0

### Minor Changes

- [#5829](https://github.com/thirdweb-dev/js/pull/5829) [`e01193a`](https://github.com/thirdweb-dev/js/commit/e01193a659160fc84fcd54047043b23da56e3a90) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Adds getAdminAccount to inAppWallet interface for AA ecosystem wallets

### Patch Changes

- [#5837](https://github.com/thirdweb-dev/js/pull/5837) [`ce3e850`](https://github.com/thirdweb-dev/js/commit/ce3e850fdbf34911e20919ecc2674e4a63f08fa3) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Update implementations

- [#5865](https://github.com/thirdweb-dev/js/pull/5865) [`a9547c5`](https://github.com/thirdweb-dev/js/commit/a9547c561f885cc343da8c4a018ba95d1dc91179) Thanks [@gregfromstl](https://github.com/gregfromstl)! - SDK: Fix chain switching in smart account transactions

- [#5879](https://github.com/thirdweb-dev/js/pull/5879) [`810f319`](https://github.com/thirdweb-dev/js/commit/810f3195793203446b76f2f6d50ba3e9d8eefc3f) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add onTimeout callback to useAutoConnect

- [#5605](https://github.com/thirdweb-dev/js/pull/5605) [`e9c23ad`](https://github.com/thirdweb-dev/js/commit/e9c23ade6799f2509175dabc3bc077b7a37a961b) Thanks [@kien-ngo](https://github.com/kien-ngo)! - - Add onClose callback to Connect Details modal

  ```tsx
  <ConnectButton
    detailsModal={{
      onClose: (screen: string) => {
        // The last screen name that was being shown when user closed the modal
        console.log({ screen });
      },
    }}
  />
  ```

  - Small fix for ChainIcon: Always resolve IPFS URI
  - Improve test coverage

- [#5869](https://github.com/thirdweb-dev/js/pull/5869) [`273a320`](https://github.com/thirdweb-dev/js/commit/273a320ae8189a76b67de105c1ae66b7dfb618b0) Thanks [@gregfromstl](https://github.com/gregfromstl)! - SDK: Removed co.lobstr from the available wallets (an unsupported non-EVM wallet)

- [#5871](https://github.com/thirdweb-dev/js/pull/5871) [`1e8ddcb`](https://github.com/thirdweb-dev/js/commit/1e8ddcb3998d024cad794a2ee77100bd10a14f20) Thanks [@gregfromstl](https://github.com/gregfromstl)! - SDK: Gracefully ignore chain with no chain ID in `fromEip1193Provider`

## 5.80.0

### Minor Changes

- [#5799](https://github.com/thirdweb-dev/js/pull/5799) [`90e2b97`](https://github.com/thirdweb-dev/js/commit/90e2b9740d1e53f764f569724ea679fe6a373b06) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Allows hiding the "Linked Profiles" button in the `ConnectButton` Details Modal

  ```tsx
  <ConnectButton
    detailsModal={{ manageWallet: { allowLinkingProfiles: false } }}
  />
  ```

### Patch Changes

- [#5693](https://github.com/thirdweb-dev/js/pull/5693) [`7c40fda`](https://github.com/thirdweb-dev/js/commit/7c40fdaf1492f430f238b06481bcf01b42421d8e) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Custom create2 factory deployment for skale chains

- [#5780](https://github.com/thirdweb-dev/js/pull/5780) [`a2a61df`](https://github.com/thirdweb-dev/js/commit/a2a61df0293a29ba9855efea692681dbd530a2bd) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Validate getContract params

- [#5818](https://github.com/thirdweb-dev/js/pull/5818) [`a89f766`](https://github.com/thirdweb-dev/js/commit/a89f766a513d31af245f01df6ae0145f31ab21e6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Only connect wallets on SIWE linking if not already connected

- [#5783](https://github.com/thirdweb-dev/js/pull/5783) [`e818f0e`](https://github.com/thirdweb-dev/js/commit/e818f0ec871298e9c6bb5c24f4b9c9002dd2d939) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds Humanity Testnet as a legacy transaction chain

## 5.79.0

### Minor Changes

- [#5691](https://github.com/thirdweb-dev/js/pull/5691) [`5be197b`](https://github.com/thirdweb-dev/js/commit/5be197bac97393edf39bf7287b5fa258cf83ec06) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add headless components for Wallets: WalletProvider, WalletIcon and WalletName

### Patch Changes

- [#5746](https://github.com/thirdweb-dev/js/pull/5746) [`e42ffc6`](https://github.com/thirdweb-dev/js/commit/e42ffc6a931a8d80492a091d79e2d9b38e4ba1d7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix migration to enclave in react native

## 5.78.0

### Minor Changes

- [#5709](https://github.com/thirdweb-dev/js/pull/5709) [`cd55ada`](https://github.com/thirdweb-dev/js/commit/cd55ada5b2c1924911a0b3c95c07926062447d54) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds a defaultSmsCountryCode configuration option to In-App and Ecosystem Wallets

  ```ts
  createWallet("inApp", {
      auth: {
        options: [
          "email",
          "phone",
        ],
        mode: "redirect",
        defaultSmsCountryCode: "IN", // Default country code for SMS
      },
    }),
  ```

- [#5604](https://github.com/thirdweb-dev/js/pull/5604) [`03b6d0d`](https://github.com/thirdweb-dev/js/commit/03b6d0d516c7fb809ad66f1021281a74b48356e1) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Support the ability to unlink accounts for in app wallet with more than 1 linked account.

  It's supported out of the box in the connect UI.

  For typescript users, the following code snippet is a simple example of how it'd work.

  ```typescript
  import { inAppWallet } from "thirdweb/wallets";

  const wallet = inAppWallet();
  wallet.connect({ strategy: "google" });

  const profiles = await getProfiles({
    client,
  });

  const updatedProfiles = await unlinkProfile({
    client,
    profileToUnlink: profiles[1], // assuming there is more than 1 profile linked to the user.
  });
  ```

## 5.77.0

### Minor Changes

- [#5697](https://github.com/thirdweb-dev/js/pull/5697) [`f778d30`](https://github.com/thirdweb-dev/js/commit/f778d306d6af2d648c0f8268f1d35b9d9f3778b6) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds `getLastAuthProvider` to get the most recently used auth provider for login

### Patch Changes

- [#5657](https://github.com/thirdweb-dev/js/pull/5657) [`2fccfc0`](https://github.com/thirdweb-dev/js/commit/2fccfc01af3c195b5467ff3c5a5fe973cefb9b82) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix caching issues for headless component; improve code coverage

## 5.76.1

### Patch Changes

- [#5688](https://github.com/thirdweb-dev/js/pull/5688) [`da5d8ec`](https://github.com/thirdweb-dev/js/commit/da5d8ec53b4d60dd1ad6ed2cd9d638f466b22b3a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Autoconnect previously linked wallets

- [#5682](https://github.com/thirdweb-dev/js/pull/5682) [`5b24faf`](https://github.com/thirdweb-dev/js/commit/5b24faf1f371a2df21f836ad159a2cf1a6e64ec3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix ecosystem wallet AA detection in Pay modal

- [#5674](https://github.com/thirdweb-dev/js/pull/5674) [`8020bdb`](https://github.com/thirdweb-dev/js/commit/8020bdbf2b811955ba071e4aa59df9153e9ca4e6) Thanks [@devfelipenunes](https://github.com/devfelipenunes)! - This pull request adds the complete Portuguese (Brazil) translation for the wallet connection module. It includes translations for connecting a wallet, sending/receiving funds, network management, and other wallet-related actions. This improves the user experience for Portuguese-speaking users.

## 5.76.0

### Minor Changes

- [#5533](https://github.com/thirdweb-dev/js/pull/5533) [`43fbcac`](https://github.com/thirdweb-dev/js/commit/43fbcac25e9383743f1f42af9da7fe1c1eae12b4) Thanks [@kien-ngo](https://github.com/kien-ngo)! - The Connected-details button now shows USD value next to the token balance.

  ### Breaking change to the AccountBalance

  The formatFn props now takes in an object of type `AccountBalanceInfo`. The old `formatFn` was inflexible because it only allowed you to format the balance value.
  With this new version, you have access to both the balance and symbol.

  ```tsx
  import { AccountBalance, type AccountBalanceInfo } from "thirdweb/react";

  <AccountBalance
    // Show the symbol in lowercase, before the balance
    formatFn={(props: AccountBalanceInfo) =>
      `${props.symbol.toLowerCase()} ${props.balance}`
    }
  />;
  ```

  AccountBalance now supports showing the token balance in fiat value (only USD supported at the moment)

  ```tsx
  <AccountBalance showBalanceInFiat="USD" />
  ```

  The `formatFn` prop now takes in an object of type `AccountBalanceInfo` and outputs a string

  ```tsx
  import { AccountBalance, type AccountBalanceInfo } from "thirdweb/react";

  <AccountBalance
    formatFn={(props: AccountBalanceInfo) =>
      `${props.balance}---${props.symbol.toLowerCase()}`
    }
  />;

  // Result: 11.12---eth
  ```

  ### ConnectButton also supports displaying balance in fiat since it uses AccountBalance internally

  ```tsx
  <ConnectButton
    // Show USD value on the button
    detailsButton={{
      showBalanceInFiat: "USD",
    }}
    // Show USD value on the modal
    detailsModal={{
      showBalanceInFiat: "USD",
    }}
  />
  ```

  ### Export utils functions:

  formatNumber: Round up a number to a certain decimal place

  ```tsx
  import { formatNumber } from "thirdweb/utils";
  const value = formatNumber(12.1214141, 1); // 12.1
  ```

  shortenLargeNumber: Shorten the string for large value. Mainly used for the AccountBalance's `formatFn`

  ```tsx
  import { shortenLargeNumber } from "thirdweb/utils";
  const numStr = shortenLargeNumber(1_000_000_000);
  ```

  ### Fix to ConnectButton

  The social image of the Details button now display correctly for non-square image.

  ### Massive test coverage improvement for the Connected-button components

- [#5655](https://github.com/thirdweb-dev/js/pull/5655) [`f69d1aa`](https://github.com/thirdweb-dev/js/commit/f69d1aad2d154a05ebc61a1d7545bd9e5aab17be) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Improve NFT Components
  - Add custom resolver methods to NFTMedia, NFTName and NFTDescription
  - Add caching for the NFT-info-getter method to improve performance
  - Small fix to handle falsy values for NFT media src, name and description
  - Improve test coverage by extracting internal logics and testing them

### Patch Changes

- [#5660](https://github.com/thirdweb-dev/js/pull/5660) [`d5a68c8`](https://github.com/thirdweb-dev/js/commit/d5a68c85111809bf39e57f5fb39b5458c1f3fe9a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix: Correctly cleans the "Custom Auth" profile type label

- [#5672](https://github.com/thirdweb-dev/js/pull/5672) [`3b53732`](https://github.com/thirdweb-dev/js/commit/3b5373293202b8ff13cc1502bef3cc9dffaa5afa) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix ox hardset version

- [#5653](https://github.com/thirdweb-dev/js/pull/5653) [`df734ba`](https://github.com/thirdweb-dev/js/commit/df734baf97ec2e976fedb124ecfbac7119c0bc5f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - More helpful error messages for enclave and userop errors

- [#5656](https://github.com/thirdweb-dev/js/pull/5656) [`f680496`](https://github.com/thirdweb-dev/js/commit/f680496ccb1c639fab644fb54e9a962627cf3228) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix connecting to cb wallet browser extension when already on the same chain

- [#5671](https://github.com/thirdweb-dev/js/pull/5671) [`dcd5822`](https://github.com/thirdweb-dev/js/commit/dcd5822ee707fa52f1c3e02c75992485f83922f0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow signature minting for LoyaltyCard contracts by passing the contractType

- [#5673](https://github.com/thirdweb-dev/js/pull/5673) [`c55f02f`](https://github.com/thirdweb-dev/js/commit/c55f02fa75a7f8959bbe69eac6cebfc7927ed865) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - always include gas price information even if it's 0 for enclave wallets

- [#5617](https://github.com/thirdweb-dev/js/pull/5617) [`c48e0c9`](https://github.com/thirdweb-dev/js/commit/c48e0c9320830aa69c0e9567d985ed8a94eeaaf1) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix: Disconnect smart account when account signer is disconnected

- [#5668](https://github.com/thirdweb-dev/js/pull/5668) [`485dcc6`](https://github.com/thirdweb-dev/js/commit/485dcc6020089a80d994c24882f389c24a0af039) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix add chain not triggering for certain wallets

## 5.75.0

### Minor Changes

- [#5598](https://github.com/thirdweb-dev/js/pull/5598) [`16e5347`](https://github.com/thirdweb-dev/js/commit/16e534714e65af831553d47496d9018dfc73995c) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Update underlying APIs to use Ox for transaction serialization

### Patch Changes

- [#5639](https://github.com/thirdweb-dev/js/pull/5639) [`ed0886a`](https://github.com/thirdweb-dev/js/commit/ed0886a89f06f4c4065e37aa791d99eff2ce59d1) Thanks [@jnsdls](https://github.com/jnsdls)! - default account components to not retry on failure

- [#5640](https://github.com/thirdweb-dev/js/pull/5640) [`5070e76`](https://github.com/thirdweb-dev/js/commit/5070e76d35d88868c56df86ab673527b159b0d9c) Thanks [@jnsdls](https://github.com/jnsdls)! - accept `react 19` as peer explicitly

- [#5487](https://github.com/thirdweb-dev/js/pull/5487) [`5574c15`](https://github.com/thirdweb-dev/js/commit/5574c15ec887c963a148cb54f04e5c0b5d3cff8e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - BETA support for 7579 modular smart accounts

  You can now create modular smart wallets using the 7579 preset.

  Keep in mind that this is in BETA, and there might be breaking API changes.

  ```typescript
  import { sepolia } from "thirdweb/chains";
  import { smartWallet, Config } from "thirdweb/wallets/smart";
   const modularSmartWallet = smartWallet(
    Config.erc7579({
      chain: sepolia,
      sponsorGas: true,
      factoryAddress: "0x...", // the 7579 factory address
      validatorAddress: "0x...", // the default validator module address
    }),
  });
  ```

- [#5630](https://github.com/thirdweb-dev/js/pull/5630) [`0aa2416`](https://github.com/thirdweb-dev/js/commit/0aa24165ce66f837d3c22d6e1841de984e335863) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add erc20Value to buyFromListing transaction

- [#5641](https://github.com/thirdweb-dev/js/pull/5641) [`d1716fc`](https://github.com/thirdweb-dev/js/commit/d1716fc793d8cc57908192674f3aefe8ee66a5f8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support ERC6492 for smart account signatures

## 5.74.0

### Minor Changes

- [#5634](https://github.com/thirdweb-dev/js/pull/5634) [`d1aa380`](https://github.com/thirdweb-dev/js/commit/d1aa3805bfbf22b6a01404c3a01fe1ad02cd9815) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - ERC20 Token Paymaster support

  You can now use ERC20 Token Paymasters with Smart Wallets.

  ```typescript
  import { base } from "thirdweb/chains";
  import { TokenPaymaster, smartWallet } from "thirdweb/wallets";

  const wallet = smartWallet({
    chain: base,
    sponsorGas: true, // only sponsor gas for the first ERC20 approval
    overrides: {
      tokenPaymaster: TokenPaymaster.BASE_USDC,
    },
  });
  ```

### Patch Changes

- [#5593](https://github.com/thirdweb-dev/js/pull/5593) [`68ad62f`](https://github.com/thirdweb-dev/js/commit/68ad62f1d5c319392a7598d747a1400341bcc170) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - update `type` in `getUser` `Profiles` to match tyepscript types

- [#5621](https://github.com/thirdweb-dev/js/pull/5621) [`279cb6f`](https://github.com/thirdweb-dev/js/commit/279cb6f9a737107b49d2ddcdb465e5941cbf9b42) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Feature: Propagate failed sign in error message to the UI

- [#5596](https://github.com/thirdweb-dev/js/pull/5596) [`c893239`](https://github.com/thirdweb-dev/js/commit/c893239582d3362716f3daa7511f35b34b3cf790) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - add fallback chain for ecosystem smart accounts

- [#5620](https://github.com/thirdweb-dev/js/pull/5620) [`13d63ab`](https://github.com/thirdweb-dev/js/commit/13d63ab06221cf9d7030779e54186b6925362356) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix: Hides Sign in with Wallet button when linking a profile

- [#5618](https://github.com/thirdweb-dev/js/pull/5618) [`33c23e7`](https://github.com/thirdweb-dev/js/commit/33c23e789e577bd6463e135cec4e25cfcfc9964a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix: Removed the auth prop from useConnectModal as it is currently not supported

## 5.73.0

### Minor Changes

- [#5457](https://github.com/thirdweb-dev/js/pull/5457) [`57fa96b`](https://github.com/thirdweb-dev/js/commit/57fa96b268671f19c7f57fa2208fb83e2b0e75b5) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add 2 new Pay functions: convertFiatToCrypto and convertCryptoToFiat

  Examples:

  ### Convert fiat (USD) to crypto

  ```ts
  import { convertFiatToCrypto } from "thirdweb/pay";
  import { ethereum } from "thirdweb/chains";

  // Convert 2 cents to ETH
  const result = await convertFiatToCrypto({
    from: "USD",
    // the token address. For native token, use NATIVE_TOKEN_ADDRESS
    to: "0x...",
    // the chain (of the chain where the token belong to)
    chain: ethereum,
    // 2 cents
    fromAmount: 0.02,
  });
  // Result: 0.0000057 (a number)
  ```

  ### Convert crypto to fiat (USD)

  ```ts
  import { convertCryptoToFiat } from "thirdweb/pay";

  // Get Ethereum price
  const result = convertCryptoToFiat({
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    to: "USD",
    chain: ethereum,
    fromAmount: 1,
  });

  // Result: 3404.11 (number)
  ```

### Patch Changes

- [#5594](https://github.com/thirdweb-dev/js/pull/5594) [`b7c8854`](https://github.com/thirdweb-dev/js/commit/b7c885432726eeaf3401217573f2cff0f5247ff7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for Expo 52 and React Native 0.76

- [#5595](https://github.com/thirdweb-dev/js/pull/5595) [`9b45aae`](https://github.com/thirdweb-dev/js/commit/9b45aae699c6f927816a415cabd61bb30bef72b1) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Display error message when failing to fetch account status from endpoint outside of unauthorized requests

- [#5592](https://github.com/thirdweb-dev/js/pull/5592) [`c3d7b66`](https://github.com/thirdweb-dev/js/commit/c3d7b662c402f96696141070ea42b2e10d94e1f8) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Properly updates active smart wallet when switching signer account on EOA wallet

- [#5577](https://github.com/thirdweb-dev/js/pull/5577) [`b117cb1`](https://github.com/thirdweb-dev/js/commit/b117cb19279a7807fc956e77ae144788112eec7f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Show warning when sponsorship policy rejects a transaction

- [#5531](https://github.com/thirdweb-dev/js/pull/5531) [`1e9a6c7`](https://github.com/thirdweb-dev/js/commit/1e9a6c7d8ae28012956b688f6e0af6f94c075181) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle 0 value for maxPriorityFeePerGas in 712 transactions

## 5.72.0

### Minor Changes

- [#5495](https://github.com/thirdweb-dev/js/pull/5495) [`d1845f3`](https://github.com/thirdweb-dev/js/commit/d1845f3d6096d81e24bdb3cff38d19efd652ada1) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add headless components: ChainProvider, ChainIcon & ChainName

- [#5529](https://github.com/thirdweb-dev/js/pull/5529) [`7488102`](https://github.com/thirdweb-dev/js/commit/7488102d20604a1d8cfd4653a34aa9a975f5c7f1) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds LoyaltyCard extensions and support for ERC721 deployment.

  ```ts
  import { deployERC721Contract } from "thirdweb/deploys";

  const loyaltyCardContractAddress = await deployERC721Contract({
    chain: "your-chain-id", // replace with your chain ID
    client: yourThirdwebClient, // replace with your Thirdweb client instance
    account: yourAccount, // replace with your account details
    type: "LoyaltyCard",
    params: {
      name: "MyLoyaltyCard",
      symbol: "LOYAL",
      description: "A loyalty card NFT contract",
      image: "path/to/image.png", // replace with your image path
      defaultAdmin: "0xYourAdminAddress", // replace with your admin address
      royaltyRecipient: "0xYourRoyaltyRecipient", // replace with your royalty recipient address
      royaltyBps: 500n, // 5% royalty
      trustedForwarders: ["0xTrustedForwarderAddress"], // replace with your trusted forwarder addresses
      saleRecipient: "0xYourSaleRecipient", // replace with your sale recipient address
      platformFeeBps: 200n, // 2% platform fee
      platformFeeRecipient: "0xYourPlatformFeeRecipient", // replace with your platform fee recipient address
    },
  });
  ```

### Patch Changes

- [#5517](https://github.com/thirdweb-dev/js/pull/5517) [`480fb4e`](https://github.com/thirdweb-dev/js/commit/480fb4e8ec02b79fdb8b00d709994c50ef929a28) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix UI issue when assetTabs is set to an empty array

- [#5548](https://github.com/thirdweb-dev/js/pull/5548) [`9337925`](https://github.com/thirdweb-dev/js/commit/93379251b79375784c1aac292dcaa209a1580b5e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix tx cost estimation for pay transaction modal

## 5.71.0

### Minor Changes

- [#5501](https://github.com/thirdweb-dev/js/pull/5501) [`ac42c45`](https://github.com/thirdweb-dev/js/commit/ac42c4538ef41cc842d2fd723471c21d865ee411) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Added new deployment utility functions to help manage infrastructure contracts and initialization:

  - `getInitializeTransaction`: Prepare initialization transaction for contract deployment
  - `getOrDeployInfraForPublishedContract`: Get or deploy required infrastructure for published contracts

  ```typescript
  import {
    getInitializeTransaction,
    getOrDeployInfraForPublishedContract,
  } from "thirdweb";

  // Get initialization transaction
  const initTx = await getInitializeTransaction({
    client,
    chain,
    account,
    implementationContract,
    deployMetadata,
    initializeParams: {
      name: "My Contract",
      symbol: "CNTRCT",
    },
  });

  // Get or deploy infrastructure
  const infra = await getOrDeployInfraForPublishedContract({
    chain,
    client,
    account,
    contractId: "MyContract",
    constructorParams: params,
  });
  ```

## 5.70.1

### Patch Changes

- [#5482](https://github.com/thirdweb-dev/js/pull/5482) [`b5baeae`](https://github.com/thirdweb-dev/js/commit/b5baeae821fffeb2dfb23269715066a0110b00c2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose utilities to decode errors and function data

- [#5493](https://github.com/thirdweb-dev/js/pull/5493) [`d9a63a6`](https://github.com/thirdweb-dev/js/commit/d9a63a6d351459e1cae9c1e3cb9d005ac165a5d9) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix props not getting passed to TokenIcon

- [#5498](https://github.com/thirdweb-dev/js/pull/5498) [`6b6f617`](https://github.com/thirdweb-dev/js/commit/6b6f61705d4561f44338d08e379c71e64a05ed6b) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - enable private key export for enclave wallets upon initial login

## 5.70.0

### Minor Changes

- [#5388](https://github.com/thirdweb-dev/js/pull/5388) [`901c3a1`](https://github.com/thirdweb-dev/js/commit/901c3a102b81d52297b25a72600f4a3a22dabc14) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add headless UI component: Account (Name, Image, Address, Balance)

- [#5374](https://github.com/thirdweb-dev/js/pull/5374) [`0e5d120`](https://github.com/thirdweb-dev/js/commit/0e5d120909c19398b8ce3cc73d11a5fb2fd85782) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - # Breaking change

  We are making the following changes to the NFT component to provide better performance and fine-grain control over their internal fetching logic.
  Moreover, you no longer have to wrap React.Suspense around said components!

  ### Old

  ```tsx
  <NFT>
    <React.Suspense fallback={"Loading stuff..."}>
      <NFT.Media />
      <NFT.Name />
      <NFT.Description />
    </React.Suspense>
  </NFT>
  ```

  ### New

  The new version comes with 2 new props: `loadingComponent` and `fallbackComponent`.
  Basically, `loadingComponent` takes in a component and show it _while the internal fetching is being done_
  `fallbackComponent` takes in a component and show it _once the data is failed to be resolved_

  ```tsx
  <NFTProvider contract={contract} tokenId={0n}>
      <NFTMedia
        loadingComponent={<span>Loading NFT Image</span>}
        fallbackComponent={<span>Failed to load NFT</span>}
      />
      <NFTDescription
        loadingComponent={<span>Loading NFT Description</span>}
        fallbackComponent={<span>Failed to load NFT Description</span>}
      />
  </NFT>
  ```

### Patch Changes

- [#5463](https://github.com/thirdweb-dev/js/pull/5463) [`f368793`](https://github.com/thirdweb-dev/js/commit/f368793375d099eec53569330af7a083e558e483) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes PayEmbed error state appearing on certain errors

- [#5464](https://github.com/thirdweb-dev/js/pull/5464) [`b5227c9`](https://github.com/thirdweb-dev/js/commit/b5227c9a8fb4b4b4114c79077c2c1ba38fbad55f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to override transaction values in createNewPack

## 5.69.0

### Minor Changes

- [#5415](https://github.com/thirdweb-dev/js/pull/5415) [`7b21f1b`](https://github.com/thirdweb-dev/js/commit/7b21f1b632d65a2bc9bc38656e18d220c6201ed9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds steam auth

- [#5415](https://github.com/thirdweb-dev/js/pull/5415) [`7b21f1b`](https://github.com/thirdweb-dev/js/commit/7b21f1b632d65a2bc9bc38656e18d220c6201ed9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds Steam as an authentication option

### Patch Changes

- [#5397](https://github.com/thirdweb-dev/js/pull/5397) [`895b4d1`](https://github.com/thirdweb-dev/js/commit/895b4d145fb0519febdb399abffea36208692d95) Thanks [@MananTank](https://github.com/MananTank)! - Catch localStorage getItem and setItem unhandled errors

- [#5440](https://github.com/thirdweb-dev/js/pull/5440) [`f01de73`](https://github.com/thirdweb-dev/js/commit/f01de732fbf726cc0114dc645414f0ee6a37eb8e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support erc6492 signature verification on zksync

## 5.68.0

### Minor Changes

- [#5354](https://github.com/thirdweb-dev/js/pull/5354) [`a1fc436`](https://github.com/thirdweb-dev/js/commit/a1fc436a92eb5fccbbcf5b3e8b8fbea3343d14e0) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Adds EIP1193 adapters that allow conversion between Thirdweb wallets and EIP-1193 providers:

  - `EIP1193.fromProvider()`: Creates a Thirdweb wallet from any EIP-1193 compatible provider (like MetaMask, WalletConnect)
  - `EIP1193.toProvider()`: Converts a Thirdweb wallet into an EIP-1193 provider that can be used with any web3 library

  Key features:

  - Full EIP-1193 compliance for seamless integration
  - Handles account management (connect, disconnect, chain switching)
  - Supports all standard Ethereum JSON-RPC methods
  - Comprehensive event system for state changes
  - Type-safe interfaces with full TypeScript support

  Examples:

  ```ts
  // Convert MetaMask's provider to a Thirdweb wallet
  const wallet = EIP1193.fromProvider({
    provider: window.ethereum,
    walletId: "io.metamask",
  });

  // Use like any other Thirdweb wallet
  const account = await wallet.connect({
    client: createThirdwebClient({ clientId: "..." }),
  });

  // Convert a Thirdweb wallet to an EIP-1193 provider
  const provider = EIP1193.toProvider({
    wallet,
    chain: ethereum,
    client: createThirdwebClient({ clientId: "..." }),
  });

  // Use with any EIP-1193 compatible library
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });

  // Listen for events
  provider.on("accountsChanged", (accounts) => {
    console.log("Active accounts:", accounts);
  });
  ```

### Patch Changes

- [#5335](https://github.com/thirdweb-dev/js/pull/5335) [`1e7e32f`](https://github.com/thirdweb-dev/js/commit/1e7e32f2cbb23dad48eda6e1224c09df89fc249d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Added global transaction decorator, better eip712 transaction support

- [#5349](https://github.com/thirdweb-dev/js/pull/5349) [`46d0b4b`](https://github.com/thirdweb-dev/js/commit/46d0b4bdc050b92886cfea5623a08aa8f7272006) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Use maxFeePerGas for Pay gas cost estimations in transaction flow

- [#5366](https://github.com/thirdweb-dev/js/pull/5366) [`ef56304`](https://github.com/thirdweb-dev/js/commit/ef563041954958a6ae6fa58a4e2c1edd7ea88940) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds ox for internal utilities

- [#5390](https://github.com/thirdweb-dev/js/pull/5390) [`6771cfe`](https://github.com/thirdweb-dev/js/commit/6771cfed62aedce6ccb22e3c092f117a1b7e4242) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix enclave transaction signing for transactions with 0 maxPriorityFeePerGas

- [#5343](https://github.com/thirdweb-dev/js/pull/5343) [`5de5418`](https://github.com/thirdweb-dev/js/commit/5de541878cfd4102baa049a0d84ce9911746ac6c) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds chain ID to tracked analytics

## 5.67.0

### Minor Changes

- [#5326](https://github.com/thirdweb-dev/js/pull/5326) [`f5f5ae6`](https://github.com/thirdweb-dev/js/commit/f5f5ae63b441e0c0848c8ec88e0d1a81638b852b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Add SiteLink component for creating wallet-aware links between thirdweb-enabled sites. This component automatically adds wallet connection parameters to the target URL when a wallet is connected, enabling seamless wallet state sharing between sites.

  Example:

  ```tsx
  import { SiteLink } from "thirdweb/react";

  function App() {
    return (
      <SiteLink
        href="https://thirdweb.com"
        client={thirdwebClient}
        ecosystem={{ id: "ecosystem.thirdweb" }}
      >
        Visit thirdweb.com with connected wallet
      </SiteLink>
    );
  }
  ```

### Patch Changes

- [#5341](https://github.com/thirdweb-dev/js/pull/5341) [`1db950e`](https://github.com/thirdweb-dev/js/commit/1db950e678332eb151b647bfe158f35d565fbc10) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Make encryption key optional for in-app and ecosystem wallets custom auth

## 5.66.0

### Minor Changes

- [#5298](https://github.com/thirdweb-dev/js/pull/5298) [`5cc5c93`](https://github.com/thirdweb-dev/js/commit/5cc5c9327f5a38e1cfe1116cbff8842380cea06b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Added new `SiteEmbed` React component for embedding thirdweb-supported sites with seamless wallet connection support.

  The component allows you to embed other thirdweb-enabled sites while maintaining wallet connection state, supporting both in-app and ecosystem wallets.

  Example usage:

  ```tsx
  import { SiteEmbed } from "thirdweb/react";

  <SiteEmbed
    src="https://thirdweb.com"
    client={client}
    ecosystem={ecosystem}
  />;
  ```

  Note: Embedded sites must include `<AutoConnect />` and support frame-ancestors in their Content Security Policy.

### Patch Changes

- [#5217](https://github.com/thirdweb-dev/js/pull/5217) [`b633293`](https://github.com/thirdweb-dev/js/commit/b633293ef1cccde61fc5eb4d536bf117eda29535) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Automatically migrate in-app wallets to the new enclave system

- [#5315](https://github.com/thirdweb-dev/js/pull/5315) [`87e736d`](https://github.com/thirdweb-dev/js/commit/87e736daccba3827edeb8cd3524bfe25bf98e61f) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix ecosystem signing with data error

## 5.65.2

### Patch Changes

- [#5302](https://github.com/thirdweb-dev/js/pull/5302) [`75cbe64`](https://github.com/thirdweb-dev/js/commit/75cbe64a86db848047abd619b11cac06ac9d5a04) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix Pay UI not force switching connected wallet chain

- [#5256](https://github.com/thirdweb-dev/js/pull/5256) [`f98059c`](https://github.com/thirdweb-dev/js/commit/f98059c426d9be6727e7c1086737539f3b7d11d9) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Optimize ERC20 transferBatch

## 5.65.1

### Patch Changes

- [#5277](https://github.com/thirdweb-dev/js/pull/5277) [`58fb28d`](https://github.com/thirdweb-dev/js/commit/58fb28de297e5a81be18a185d495425e29913a0b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect bundlerUrl in waitForUserReceipt

## 5.65.0

### Minor Changes

- [#5126](https://github.com/thirdweb-dev/js/pull/5126) [`c621c13`](https://github.com/thirdweb-dev/js/commit/c621c13f11166a5ff8aa1fbd9e5e78dd83cbaef5) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Allow to customize the display order of Asset tabs

  When you click on "View Assets", by default the "Tokens" tab is shown first.

  If you want to show the "NFTs" tab first, change the order of the asset tabs to: ["nft", "token"]

  Note: If an empty array is passed, the [View Funds] button will be hidden

  ```tsx
  <ConnectButton
    client={client}
    detailsModal={{
      assetTabs: ["nft", "token"],
    }}
  />
  ```

### Patch Changes

- [#5253](https://github.com/thirdweb-dev/js/pull/5253) [`baf2198`](https://github.com/thirdweb-dev/js/commit/baf21980be291d037797ce17fcd2e8a64e3b7814) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Use stringify instead of JSON.stringify in most places to handle bigint serialization

- [#5272](https://github.com/thirdweb-dev/js/pull/5272) [`e3c0af2`](https://github.com/thirdweb-dev/js/commit/e3c0af28f7531bccbcc38f3f4ffb3516151636de) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Tracks transaction chain IDs

- [#5250](https://github.com/thirdweb-dev/js/pull/5250) [`f40d247`](https://github.com/thirdweb-dev/js/commit/f40d2474e6cc1227a8d05151210ef4793beb6142) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow smart accounts to switch chains between zk and non zk chains

- [#5270](https://github.com/thirdweb-dev/js/pull/5270) [`0660416`](https://github.com/thirdweb-dev/js/commit/06604162a11d99ff119bbf427a24b9a7d82c1575) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Enable configuring the analytics endpoint

## 5.64.5

### Patch Changes

- [#5246](https://github.com/thirdweb-dev/js/pull/5246) [`82c8726`](https://github.com/thirdweb-dev/js/commit/82c8726c10c0186b82cc740e2131179aff7905c9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix custom paymaster callback not being respected

## 5.64.4

### Patch Changes

- [#5237](https://github.com/thirdweb-dev/js/pull/5237) [`802d3bf`](https://github.com/thirdweb-dev/js/commit/802d3bfd4bbf211ba2477c8c2a44a2f1c7b79967) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Sanitize block explorer URLs

- [#5231](https://github.com/thirdweb-dev/js/pull/5231) [`686d0c3`](https://github.com/thirdweb-dev/js/commit/686d0c3c051ac0f36fcec7412948cbc41e303388) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect custom bundler URL for getting gas fees + better DX for `predictSmartAccountAddress()`

- [#5187](https://github.com/thirdweb-dev/js/pull/5187) [`68ce724`](https://github.com/thirdweb-dev/js/commit/68ce724ff646e4992e33c025e12f4bf083e1ca7a) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - expose WalletUser type for in app / ecosystem wallets

- [#5214](https://github.com/thirdweb-dev/js/pull/5214) [`ad4af68`](https://github.com/thirdweb-dev/js/commit/ad4af68d1d96859e8dedcdcb22ebbc6c6cc29f1f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Reduce async calls before requesting webauthn credentials for ios 15

- [#5229](https://github.com/thirdweb-dev/js/pull/5229) [`9425e9e`](https://github.com/thirdweb-dev/js/commit/9425e9ef429a98119fc0648eb43850c7b9fa8571) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Consolidate custom jwt and custom auth endpoint through common endpoint

- [#5244](https://github.com/thirdweb-dev/js/pull/5244) [`178d407`](https://github.com/thirdweb-dev/js/commit/178d407e6f20fb44ab32977c95912f56b2f1bc51) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add support for custom singlePhase drops

  If you are using a custom drop contract, you can now set claim conditions and claim by passing the `singlePhaseDrop` option to the `setClaimConditions` and `claimTo` functions.

  ```ts
  setClaimConditions({
    contract,
    phases: [
      {
        startTime: new Date(0),
        maxClaimableSupply: 10n,
      },
    ],
    tokenId: 0n,
    singlePhaseDrop: true, // <--- for custom drop contracts
  });
  ```

## 5.64.3

### Patch Changes

- [#5207](https://github.com/thirdweb-dev/js/pull/5207) [`adeda1e`](https://github.com/thirdweb-dev/js/commit/adeda1ef7629bb31fe5280c26f4d53218d7bea82) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle unsupported Pay chains properly for sending paid transactions

- [#5176](https://github.com/thirdweb-dev/js/pull/5176) [`84571ef`](https://github.com/thirdweb-dev/js/commit/84571efaf80bc7b9054a375233beb8789326255d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Redesigned Pay payment selection flow

- [#5212](https://github.com/thirdweb-dev/js/pull/5212) [`07ea65b`](https://github.com/thirdweb-dev/js/commit/07ea65bcd8141076c8b557628df3da7823455324) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Better handling of ecosystem smart accounts

## 5.64.2

### Patch Changes

- [#5172](https://github.com/thirdweb-dev/js/pull/5172) [`e8f952a`](https://github.com/thirdweb-dev/js/commit/e8f952a191d9180926d8d6b4e1317c683fe8a1e3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Always add URI to SIWE payload

## 5.64.1

### Patch Changes

- [#5163](https://github.com/thirdweb-dev/js/pull/5163) [`158c2b6`](https://github.com/thirdweb-dev/js/commit/158c2b6e8e41a88233fc819af54f4e0848604d0a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect theme accentColor for default icons in connect UI

## 5.64.0

### Minor Changes

- [#5062](https://github.com/thirdweb-dev/js/pull/5062) [`0cafa33`](https://github.com/thirdweb-dev/js/commit/0cafa33a1886a7d813d78b8fcb77cf0e2e638594) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds GitHub authentication

- [#5036](https://github.com/thirdweb-dev/js/pull/5036) [`f8c981c`](https://github.com/thirdweb-dev/js/commit/f8c981c0ca3dd34505f77fab6e4d3aba3f2bf852) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add new ERC1155 extension: mintAdditionalSupplyToBatch

### Patch Changes

- [#5125](https://github.com/thirdweb-dev/js/pull/5125) [`d522343`](https://github.com/thirdweb-dev/js/commit/d522343e04fad4c8561e1183b02a5f04b6f1e7b2) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Optimize mintAdditionalSupplyToBatch extension

- [#5153](https://github.com/thirdweb-dev/js/pull/5153) [`47b1bbb`](https://github.com/thirdweb-dev/js/commit/47b1bbbd7c93d758829ea30fa830b4f4eb9ee390) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Enable Sign in with Wallet for ecosystems

- [#5150](https://github.com/thirdweb-dev/js/pull/5150) [`9fadbcc`](https://github.com/thirdweb-dev/js/commit/9fadbcc17abfe302933f7b860ab7c3b4fb577789) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#5123](https://github.com/thirdweb-dev/js/pull/5123) [`364d97e`](https://github.com/thirdweb-dev/js/commit/364d97e97ef4a410383db497ab8efe43e7970dda) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Auto resolve entrypoint address from factory when available

- [#5129](https://github.com/thirdweb-dev/js/pull/5129) [`319a203`](https://github.com/thirdweb-dev/js/commit/319a203a4e0ef2632fb6221bec0ab2ba97ba91ad) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes Brave Wallet Metadata

- [#5148](https://github.com/thirdweb-dev/js/pull/5148) [`2fdb69d`](https://github.com/thirdweb-dev/js/commit/2fdb69dd445a8a8858b1f8869d31acd425ed245f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Optimize mintAdditionalSupplyTo

- [#5091](https://github.com/thirdweb-dev/js/pull/5091) [`45fcfb1`](https://github.com/thirdweb-dev/js/commit/45fcfb1daefeb30440650aae2febb67212576b7f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support smart account options for ecosystem wallets

- [#5090](https://github.com/thirdweb-dev/js/pull/5090) [`50f98d7`](https://github.com/thirdweb-dev/js/commit/50f98d7486809c541252a9cfc6979d102960366b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix useProfiles not updating when connecting to a different account

## 5.63.2

### Patch Changes

- [#5092](https://github.com/thirdweb-dev/js/pull/5092) [`223c497`](https://github.com/thirdweb-dev/js/commit/223c497f491de83078b455090d0e191bec255169) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Ensure smart accounts are deployed before validating signatures

- [#5089](https://github.com/thirdweb-dev/js/pull/5089) [`541bee5`](https://github.com/thirdweb-dev/js/commit/541bee5b34d36a6abc7edab9c143dc93fa71d558) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix useProfiles not updating when connecting to a different account

## 5.63.1

### Patch Changes

- [#5065](https://github.com/thirdweb-dev/js/pull/5065) [`b01faac`](https://github.com/thirdweb-dev/js/commit/b01faacd999a6b5d88d273531cea67c97c84d5ae) Thanks [@MananTank](https://github.com/MananTank)! - Catch failed to post tracking errors to avoid exposing them to error report services

- [#5063](https://github.com/thirdweb-dev/js/pull/5063) [`ef6b4f4`](https://github.com/thirdweb-dev/js/commit/ef6b4f48ef94f1196912906a2adfdc8a997ff2af) Thanks [@MananTank](https://github.com/MananTank)! - Add reason string on abort controller's `abort` method to avoid `AbortError: signal is aborted without reason` errors

- [#5080](https://github.com/thirdweb-dev/js/pull/5080) [`67a363f`](https://github.com/thirdweb-dev/js/commit/67a363f624b935e02718e6cb205856e8b568477b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix revalidation with siwe auth in ConnectEmbed

## 5.63.0

### Minor Changes

- [#5047](https://github.com/thirdweb-dev/js/pull/5047) [`3a141e7`](https://github.com/thirdweb-dev/js/commit/3a141e742c19eeeecf031a3014cb476ee69d4c0c) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds twitch auth strategy

### Patch Changes

- [#5059](https://github.com/thirdweb-dev/js/pull/5059) [`cb6a053`](https://github.com/thirdweb-dev/js/commit/cb6a0537d8fbec5d8e07a530caf501f94d30ae0e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update default zk chains

- [#5053](https://github.com/thirdweb-dev/js/pull/5053) [`772604e`](https://github.com/thirdweb-dev/js/commit/772604eee2bb20265826846f3953a2add99f35b3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix flaky auth state in PWAs

## 5.62.0

### Minor Changes

- [#5032](https://github.com/thirdweb-dev/js/pull/5032) [`3fe33a6`](https://github.com/thirdweb-dev/js/commit/3fe33a6ca062acf08e3590619ebfe9748cdd79f6) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add ERC1155 extension: mintToBatch

- [#4992](https://github.com/thirdweb-dev/js/pull/4992) [`1994d9e`](https://github.com/thirdweb-dev/js/commit/1994d9e52d3a3874e6111ff7bc688f95618fbc25) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for enclave wallet migration in React Native

  this change requires the latest version of the `@thirdweb-dev/react-native-adapter` package to be installed.

### Patch Changes

- [#5045](https://github.com/thirdweb-dev/js/pull/5045) [`ec10e81`](https://github.com/thirdweb-dev/js/commit/ec10e81624bb4389e5efc6570133f19d3df5368a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix linking wallets for ecosystems

- [#5029](https://github.com/thirdweb-dev/js/pull/5029) [`da9f196`](https://github.com/thirdweb-dev/js/commit/da9f1964e4ae74ed5d33666788e2d16e4d56614d) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#5009](https://github.com/thirdweb-dev/js/pull/5009) [`6faf63f`](https://github.com/thirdweb-dev/js/commit/6faf63ff9597926f855263008014acfd4c349e5e) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix upload logic for delayed reveal batch

## 5.61.6

### Patch Changes

- [#4962](https://github.com/thirdweb-dev/js/pull/4962) [`9685a85`](https://github.com/thirdweb-dev/js/commit/9685a85274ac3ac1f999e8f552eff78fe2027b45) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose UnstoppableDomains extensions: namehash and reverseNameOf

- [#5004](https://github.com/thirdweb-dev/js/pull/5004) [`df0388d`](https://github.com/thirdweb-dev/js/commit/df0388d83b9c413b593f64ed5fe6c3c707a634d6) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose auth options on `useConnectModal`

- [#4961](https://github.com/thirdweb-dev/js/pull/4961) [`98f358d`](https://github.com/thirdweb-dev/js/commit/98f358d63a5c33a72cfe52bcbd910ea39fb2f33e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Throw an error if an expected auth token is missing

- [#5002](https://github.com/thirdweb-dev/js/pull/5002) [`cd2c0f3`](https://github.com/thirdweb-dev/js/commit/cd2c0f3868bc9d0509130cc7664e6825759e9e78) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle zk sync direct deploys in `deployContract`

## 5.61.5

### Patch Changes

- [#4979](https://github.com/thirdweb-dev/js/pull/4979) [`ccd4cd6`](https://github.com/thirdweb-dev/js/commit/ccd4cd6f59423d417757e86bf04a5a07b061e2f9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Overestimate zksync gas limit to account for paymaster extra gas

- [#4974](https://github.com/thirdweb-dev/js/pull/4974) [`6a4b776`](https://github.com/thirdweb-dev/js/commit/6a4b776eccc16203795786d44c4b80c011c2af37) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix: allow account linking on thirdweb dashboard

- [#4977](https://github.com/thirdweb-dev/js/pull/4977) [`7c10343`](https://github.com/thirdweb-dev/js/commit/7c103431c4e4788277086db1f21e32833b6dfd2b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add soneiumMinato chain definition

## 5.61.4

### Patch Changes

- [#4969](https://github.com/thirdweb-dev/js/pull/4969) [`3446b4c`](https://github.com/thirdweb-dev/js/commit/3446b4cabf0a8b877c344d810f97fd571753df2e) Thanks [@MananTank](https://github.com/MananTank)! - Remove extra text shown in Error Message in Pay UI

## 5.61.3

### Patch Changes

- [#4965](https://github.com/thirdweb-dev/js/pull/4965) [`24981a7`](https://github.com/thirdweb-dev/js/commit/24981a7f60c2a45976c748826339822d81154ce3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Respect raw accountSalt passed as hex

## 5.61.2

### Patch Changes

- [#4948](https://github.com/thirdweb-dev/js/pull/4948) [`ea36c54`](https://github.com/thirdweb-dev/js/commit/ea36c541185a4a333b0689bf7de6b9ae92f85cac) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow overriding callGasLimit for userops

## 5.61.1

### Patch Changes

- [#4933](https://github.com/thirdweb-dev/js/pull/4933) [`506764d`](https://github.com/thirdweb-dev/js/commit/506764dabdbfa4910416e7a1347a92f0ef0d5e8e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support show all wallets option in React Native Connect UI

- [#4944](https://github.com/thirdweb-dev/js/pull/4944) [`822ece4`](https://github.com/thirdweb-dev/js/commit/822ece45ece94329c5da2b070da6e7ded09f34c2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Option to disable storing last stored passkey credentials

## 5.61.0

### Minor Changes

- [#4906](https://github.com/thirdweb-dev/js/pull/4906) [`63d0777`](https://github.com/thirdweb-dev/js/commit/63d0777e6f8effbf02cd773a3f7f03f42b85c781) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New `useLinkProfile()` hook to link profiles to inapp and ecosystem accounts

- [#4905](https://github.com/thirdweb-dev/js/pull/4905) [`a453d96`](https://github.com/thirdweb-dev/js/commit/a453d96aed12e53561a239f361be1d59a53172db) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add name & address resolvers for Unstoppable Domains

### Patch Changes

- [#4919](https://github.com/thirdweb-dev/js/pull/4919) [`d4c423c`](https://github.com/thirdweb-dev/js/commit/d4c423cd971f8d79843f3bf0ac461ad88da611e5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix passing 0n as from/to blocks in getContractEvents

- [#4918](https://github.com/thirdweb-dev/js/pull/4918) [`0f6b881`](https://github.com/thirdweb-dev/js/commit/0f6b881bcaf45c08d1aa7b7c117960e688e1ac42) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Add querying for in app wallet user details via externally linked wallet address:

  ```ts
  import { getUser } from "thirdweb";

  // this is the wallet address that the user used to connect via SIWE to their in app wallet
  const user = await getUser({
    client,
    externalWalletAddress: "0x123...",
  });
  ```

  Add querying for ecosystem wallet user details:

  ```ts
  import { getUser } from "thirdweb";

  const user = await getUser({
    client,
    ecosystem: {
      id: "ecosystem.YOUR_ID",
      partnerId: "OPTIONAL_PARTNER_ID"
    }
    email: "user@example.com",
  });
  ```

## 5.60.1

### Patch Changes

- [#4884](https://github.com/thirdweb-dev/js/pull/4884) [`e548675`](https://github.com/thirdweb-dev/js/commit/e54867550eac5519272d9361a0db0c49f5bea4f4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Switch to v2 bundler for all user operations for better performance

- [#4886](https://github.com/thirdweb-dev/js/pull/4886) [`985c4b0`](https://github.com/thirdweb-dev/js/commit/985c4b08048c3676dc9be0c2069fefc73a742a3a) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix missing partner id when creating ecosystem wallet

- [#4883](https://github.com/thirdweb-dev/js/pull/4883) [`454f063`](https://github.com/thirdweb-dev/js/commit/454f063f98ce177951501612e916665c63825baa) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Auto resolve zksync bytecode

- [#4874](https://github.com/thirdweb-dev/js/pull/4874) [`783d844`](https://github.com/thirdweb-dev/js/commit/783d84467d81db856a1f0b3509036bbc612ba7e5) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

## 5.60.0

### Minor Changes

- [#4579](https://github.com/thirdweb-dev/js/pull/4579) [`90b5495`](https://github.com/thirdweb-dev/js/commit/90b5495efb84b8220e7ba352416601c2f239d110) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Pack extensions

  ### Deploy Pack

  ```ts
  import { deployPackContract } from "thirdweb/extensions/deploy";

  const packAddress = await deployPackContract({
    account,
    client,
    chain,
    params: {
      name: "Pack contract name",
      symbol: "PACK1155",
    },
  });
  ```

  ### Create a Pack

  ```ts
  import { createPack } from "thirdweb/extensions/pack";

  const transaction = createPack({
    contract: packContract,
    client,
    recipient: "0x...",
    tokenOwner: "0x...",
    packMetadata: {
      name: "Pack #1",
      image: "image-of-pack-1",
    },
    openStartTimestamp: new Date(),
    erc20Rewards: [
      {
        contractAddress: "0x...",
        quantityPerReward: 1,
        totalRewards: 1,
      },
    ],
    erc721Rewards: [
      {
        contractAddress: "0x...",
        tokenId: 0n,
      },
    ],
    erc1155Rewards: [
      {
        contractAddress: "0x...",
        tokenId: 0n,
        quantityPerReward: 1,
        totalRewards: 1,
      },
    ],
  });
  ```

### Patch Changes

- [#4820](https://github.com/thirdweb-dev/js/pull/4820) [`80729e9`](https://github.com/thirdweb-dev/js/commit/80729e974808be1b2abd715af8e003b228d6da1b) Thanks [@MananTank](https://github.com/MananTank)! - Added "use client" directives on various client side hooks

- [#4871](https://github.com/thirdweb-dev/js/pull/4871) [`5d0505c`](https://github.com/thirdweb-dev/js/commit/5d0505c43cdb484504c252f6a45cf7dfbf4a2e57) Thanks [@edwardysun](https://github.com/edwardysun)! - Add purchaseData to direct transfer pay transactions

## 5.59.2

### Patch Changes

- [#4839](https://github.com/thirdweb-dev/js/pull/4839) [`fc56142`](https://github.com/thirdweb-dev/js/commit/fc561428807899f165ac2e9bd2145beb7a218f8c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix createAndSignUserOp with multiple transactions

- [#4838](https://github.com/thirdweb-dev/js/pull/4838) [`842baa0`](https://github.com/thirdweb-dev/js/commit/842baa051353ea5d4f4f70098289704856a34fa8) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Ensure optional chains are passed to wallet connect request

## 5.59.1

### Patch Changes

- [#4832](https://github.com/thirdweb-dev/js/pull/4832) [`bbe75b0`](https://github.com/thirdweb-dev/js/commit/bbe75b0bc8ef989e94066eaeaecd36c26921d60d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes WC connections with wallets that have limited chain support

- [#4815](https://github.com/thirdweb-dev/js/pull/4815) [`d0616c4`](https://github.com/thirdweb-dev/js/commit/d0616c4486b62d8c39e496cb61698a1497f359d6) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Add cronos zkevm to isZkSyncChain check

- [#4823](https://github.com/thirdweb-dev/js/pull/4823) [`21b032d`](https://github.com/thirdweb-dev/js/commit/21b032d1b845276817c2f8ada5566f4719a41ad0) Thanks [@edwardysun](https://github.com/edwardysun)! - Remove unnecessary text in UI

## 5.59.0

### Minor Changes

- [#4783](https://github.com/thirdweb-dev/js/pull/4783) [`944d56f`](https://github.com/thirdweb-dev/js/commit/944d56f6d8efa1d76a5590b34e2f3a0bc2d3d552) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Enable ecosystem wallets in React Native

- [#4755](https://github.com/thirdweb-dev/js/pull/4755) [`e02d87b`](https://github.com/thirdweb-dev/js/commit/e02d87b83155a4a77ac8ff77807ee22e7ec865b2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Refactor linkProfile and getProfile API

### Patch Changes

- [#4568](https://github.com/thirdweb-dev/js/pull/4568) [`3f83a37`](https://github.com/thirdweb-dev/js/commit/3f83a377bcf3db24bd1219af5ac7404a2c670254) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Handle new zksolc metadata format

- [#4809](https://github.com/thirdweb-dev/js/pull/4809) [`500970e`](https://github.com/thirdweb-dev/js/commit/500970e001e60be21b00e6f5cb5b1f170165f274) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes account logout state

- [#4789](https://github.com/thirdweb-dev/js/pull/4789) [`e384001`](https://github.com/thirdweb-dev/js/commit/e38400195f2644ef8dfcfbce5fa127a9a218247d) Thanks [@MananTank](https://github.com/MananTank)! - Fix whitespaces in UI components

- [#4793](https://github.com/thirdweb-dev/js/pull/4793) [`c0d81dc`](https://github.com/thirdweb-dev/js/commit/c0d81dcacadfcb8522a8a85dc365637af87af8cf) Thanks [@jnsdls](https://github.com/jnsdls)! - add optional Headers param to `fetchChain`

## 5.58.5

### Patch Changes

- [#4759](https://github.com/thirdweb-dev/js/pull/4759) [`2d34771`](https://github.com/thirdweb-dev/js/commit/2d34771e189146e4c2619f7585f9cbfa3e190bac) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Fix guest account creation uniqueness

- [#4763](https://github.com/thirdweb-dev/js/pull/4763) [`399ba2e`](https://github.com/thirdweb-dev/js/commit/399ba2efd075bb0a62ff83e30779ab1aa535e203) Thanks [@jnsdls](https://github.com/jnsdls)! - improve error handling for 402 and 403 error codes in storage upload

## 5.58.4

### Patch Changes

- [#4752](https://github.com/thirdweb-dev/js/pull/4752) [`e9ae980`](https://github.com/thirdweb-dev/js/commit/e9ae98084af24199155f997f724c7ea8ff860876) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [ReactNative] Respect icon theme color in connect button and detail modal

- [#4738](https://github.com/thirdweb-dev/js/pull/4738) [`a4dac95`](https://github.com/thirdweb-dev/js/commit/a4dac9563002a2909902b84aa5b764e3fae27b6b) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix jsdoc for getClaimParams

- [#4753](https://github.com/thirdweb-dev/js/pull/4753) [`1133ccc`](https://github.com/thirdweb-dev/js/commit/1133ccc23931f1984e400ee83f1641bdb56f0d90) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix abi resolution fallback

- [#4756](https://github.com/thirdweb-dev/js/pull/4756) [`33936b3`](https://github.com/thirdweb-dev/js/commit/33936b3a86be85427f01f8974af5c3e530f7bdaf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle biging serialization for ecosystem wallets

- [#4687](https://github.com/thirdweb-dev/js/pull/4687) [`fc2ecdf`](https://github.com/thirdweb-dev/js/commit/fc2ecdfd9868496c4dca0cf980fae68d6209edce) Thanks [@gregfromstl](https://github.com/gregfromstl)! - React: Hides guest accounts from linked profiles screen

## 5.58.3

### Patch Changes

- [#4740](https://github.com/thirdweb-dev/js/pull/4740) [`915442e`](https://github.com/thirdweb-dev/js/commit/915442e1c4e769b56187311420c7e762325c4872) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Enable wallet linking and guest mode for ecosystem wallets

## 5.58.2

### Patch Changes

- [#4737](https://github.com/thirdweb-dev/js/pull/4737) [`2707db1`](https://github.com/thirdweb-dev/js/commit/2707db136ed98ed1c39dd5da20f0ebd41dcaf5b9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow linking accounts when using in-app + smart wallets

## 5.58.1

### Patch Changes

- [#4733](https://github.com/thirdweb-dev/js/pull/4733) [`824b1bd`](https://github.com/thirdweb-dev/js/commit/824b1bdb69cb02644dbe9d77f965bdab6e046ab5) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Enable account linking for ecosystem wallets

## 5.58.0

### Minor Changes

- [#4692](https://github.com/thirdweb-dev/js/pull/4692) [`0a7448c`](https://github.com/thirdweb-dev/js/commit/0a7448cb2b739b3882824fc98ef075a0416d6434) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Login to an in-app wallet with your Coinbase account

  ```ts
  import { inAppWallet } from "thirdweb/react";

  const wallet = inAppWallet();

  const account = await wallet.connect({
    strategy: "coinbase",
    chain: mainnet,
    client: thirdwebClient,
  });
  ```

### Patch Changes

- [#4709](https://github.com/thirdweb-dev/js/pull/4709) [`b033784`](https://github.com/thirdweb-dev/js/commit/b0337849a5f7f6542eb48eed013236ec14ce189a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Displays the social login provider in the details modal

- [#4684](https://github.com/thirdweb-dev/js/pull/4684) [`c1008a5`](https://github.com/thirdweb-dev/js/commit/c1008a5314616c2e0ffa33af0fcfa9dd58855e9a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Migrates existing sharded ecosystem wallets to enclaves

- [#4716](https://github.com/thirdweb-dev/js/pull/4716) [`3229e1f`](https://github.com/thirdweb-dev/js/commit/3229e1f03c3cbb62ddc8dccf22ad8a8feb0a95f0) Thanks [@MananTank](https://github.com/MananTank)! - Export `isGetNFTSupported` extension from "thirdweb/erc1155/extensions"

- [#4715](https://github.com/thirdweb-dev/js/pull/4715) [`7d547a4`](https://github.com/thirdweb-dev/js/commit/7d547a4e336ae7c1e43c8413a1640452d1e1f8f9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix showing user info for ecosystem wallets

- [#4718](https://github.com/thirdweb-dev/js/pull/4718) [`11a833e`](https://github.com/thirdweb-dev/js/commit/11a833e1dce3cfa51745e2ddee9354a1c2003905) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improve arrangement of social icons in Connect UI

## 5.57.3

### Patch Changes

- [#4696](https://github.com/thirdweb-dev/js/pull/4696) [`0c97d79`](https://github.com/thirdweb-dev/js/commit/0c97d7965e3f681cd1fe2e1c79ecc6897ad52b9c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix default chain when using redirect mode + default to first passed chains if available

- [#4693](https://github.com/thirdweb-dev/js/pull/4693) [`4a87109`](https://github.com/thirdweb-dev/js/commit/4a87109289e6ece5f6f08c55160e5d4e11e034e4) Thanks [@jnsdls](https://github.com/jnsdls)! - fix `getClaimConditions` extension for erc20, erc721 and erc1155

## 5.57.2

### Patch Changes

- [#4686](https://github.com/thirdweb-dev/js/pull/4686) [`1b89464`](https://github.com/thirdweb-dev/js/commit/1b8946408cb903171acd9d5233dcddfa45e235fc) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Force legacy transactions on polygon zkevm cardona testnet

## 5.57.1

### Patch Changes

- [#4665](https://github.com/thirdweb-dev/js/pull/4665) [`6ce7c83`](https://github.com/thirdweb-dev/js/commit/6ce7c83a3b9eb2374ad2f8163d9c6a68bba4bc42) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update @mobile-wallet-protocol/client to 0.0.3

- [#4659](https://github.com/thirdweb-dev/js/pull/4659) [`406de39`](https://github.com/thirdweb-dev/js/commit/406de39ecdd4e901cc1fe163cc833fe9fd656d3e) Thanks [@jnsdls](https://github.com/jnsdls)! - - Allow using valid JWTs for authorization
  - update dependencies
  - simplify updateMetadata extension params for ERC721 and ERC1155

## 5.57.0

### Minor Changes

- [#4631](https://github.com/thirdweb-dev/js/pull/4631) [`a468439`](https://github.com/thirdweb-dev/js/commit/a46843992ba6acff6023af63b66b91c9e7f9ec6d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds guest account option. These accounts will only persist for the duration of the user's session unless they link an additionaly auth method to recover the account with.

  ```ts
  import { inAppWallet } from "thirdweb/wallets";

  const wallet = inAppWallet();

  const account = await wallet.connect({
    client,
    strategy: "guest",
  });
  ```

### Patch Changes

- [#4644](https://github.com/thirdweb-dev/js/pull/4644) [`e89ffd4`](https://github.com/thirdweb-dev/js/commit/e89ffd4aa2c0710a565c72ec4dc1038fdbd74029) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Handle custom id for published contract

- [#4653](https://github.com/thirdweb-dev/js/pull/4653) [`00ce74a`](https://github.com/thirdweb-dev/js/commit/00ce74a060b7ef214293b2562f4e761481e6d319) Thanks [@jnsdls](https://github.com/jnsdls)! - make getNFTs work for more ERC1155 contracts

## 5.56.0

### Minor Changes

- [#4607](https://github.com/thirdweb-dev/js/pull/4607) [`7b94bf5`](https://github.com/thirdweb-dev/js/commit/7b94bf55fd236cbebf365ab11821b5117b59942b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose `checkModulesCompatibility` function

- [#4601](https://github.com/thirdweb-dev/js/pull/4601) [`a4a4136`](https://github.com/thirdweb-dev/js/commit/a4a41364cd2f1b7b52717f619d70e005edc74edc) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - `useAdminWallet()` Hook + automatically auth when using inapp + smart accounts

  ### Add `useAdminWallet()` hook to get the admin wallet for a smart wallet

  ```ts
  const activeWallet = useActiveWallet(); // smart wallet
  const adminWallet = useAdminWallet(); // the personal wallet that controls the smart wallet
  ```

  ### Automatically auth when using inapp + smart accounts

  When using auth with an inapp + smart wallet, ConnectButton and ConnectEmebed will automatically auth without having to click sign in.

- [#4604](https://github.com/thirdweb-dev/js/pull/4604) [`3009a0f`](https://github.com/thirdweb-dev/js/commit/3009a0f6e5924f08b7b320baa303fbae948ef9b7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose publishContract extension

### Patch Changes

- [#4628](https://github.com/thirdweb-dev/js/pull/4628) [`3961ef4`](https://github.com/thirdweb-dev/js/commit/3961ef477eb819ef6b51c0817ea37dfce45b4f3f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle function sigantures and contract ABIs in resolveMethod

- [#4602](https://github.com/thirdweb-dev/js/pull/4602) [`07b949d`](https://github.com/thirdweb-dev/js/commit/07b949dd8c07ffdeda40a5549c31ad4b09abbbf1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow topping up from a different wallet with the same currency

- [#4603](https://github.com/thirdweb-dev/js/pull/4603) [`b837b69`](https://github.com/thirdweb-dev/js/commit/b837b690ae27fb8bf45f6cd51820f7591e94dab0) Thanks [@jnsdls](https://github.com/jnsdls)! - bump various dependencies

- [#4639](https://github.com/thirdweb-dev/js/pull/4639) [`c320b18`](https://github.com/thirdweb-dev/js/commit/c320b189f664cdf4b77c8ebef377abdf230f303a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Export Abi types

- [#4557](https://github.com/thirdweb-dev/js/pull/4557) [`fb0daab`](https://github.com/thirdweb-dev/js/commit/fb0daabbf612be5c844de5f66d3cd49f383b7fe5) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose some Marketplace extensions for detecting supported features

- [#4630](https://github.com/thirdweb-dev/js/pull/4630) [`2b6a2fd`](https://github.com/thirdweb-dev/js/commit/2b6a2fda3d07b708f503f36205e68bd8b9fe1f20) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Invalidate balances on Pay success

- [#4621](https://github.com/thirdweb-dev/js/pull/4621) [`5bde075`](https://github.com/thirdweb-dev/js/commit/5bde07508ae0c0438d7da076a7b3233a224e0c2f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow customizing PayEmbed metadata for top-up flow

## 5.55.0

### Minor Changes

- [#4571](https://github.com/thirdweb-dev/js/pull/4571) [`5058fdb`](https://github.com/thirdweb-dev/js/commit/5058fdb4707c18a3b22895f90b3682a3c91db52f) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds X authentication

- [#4565](https://github.com/thirdweb-dev/js/pull/4565) [`c0778cb`](https://github.com/thirdweb-dev/js/commit/c0778cb9305476025b07bb39b8159f749d15359a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds parseAvatarRecord and parseNftUri utilities

  ```ts
  import { parseAvatarRecord } from "thirdweb/extensions/ens";
  import { parseNftUri } from "thirdweb/extensions/common";

  const avatarUrl = await parseAvatarRecord({
    client,
    uri: "...",
  });

  const nftUri = await parseNftUri({
    client,
    uri: "...",
  });
  ```

### Patch Changes

- [#4582](https://github.com/thirdweb-dev/js/pull/4582) [`5d3b395`](https://github.com/thirdweb-dev/js/commit/5d3b39587b56a7b1ad49accf26a4c9a311b12795) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to hide certain wallets in the wallet switcher

  ```tsx
  <ConnectButton
    client={client}
    detailsModal={{
      // We hide the in-app wallet so they can't switch to it
      hiddenWallets: ["inApp"],
    }}
    accountAbstraction={{
      chain: baseSepolia,
      sponsorGas: true,
    }}
  />
  ```

- [#4546](https://github.com/thirdweb-dev/js/pull/4546) [`3901805`](https://github.com/thirdweb-dev/js/commit/390180592a6d71591c43bcbe3c94da2eeaa5b0d6) Thanks [@edwardysun](https://github.com/edwardysun)! - Add preferredProvider to buyWithFiat

## 5.54.0

### Minor Changes

- [#4527](https://github.com/thirdweb-dev/js/pull/4527) [`b76a82c`](https://github.com/thirdweb-dev/js/commit/b76a82c30345e06d7b2c203c1e20bf7ec7e0dd9d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update React Native dependencies and add support for React Native 0.75

- [#4499](https://github.com/thirdweb-dev/js/pull/4499) [`fe1ff63`](https://github.com/thirdweb-dev/js/commit/fe1ff63bf98d0a1e92a8bafc9f0f8c0d0da3524a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Breaking Change in `deployPublishedContract`

  Contract constructor/ initializer params are now passed as a single object instead of an array. The object should have the same shape as the params defined in the contract's ABI.

  Example of old way (using `constructorParams` or `initializeParams`):

  ```ts
  const address = await deployPublishedContract({
    account,
    chain,
    client,
    contractId: "Airdrop",
    contractParams: [TEST_ACCOUNT_A.address, ""],
  });
  ```

  New way (using `contractParams`):

  ```ts
  const address = await deployPublishedContract({
    account,
    chain,
    client,
    contractId: "Airdrop",
    contractParams: {
      defaultAdmin: TEST_ACCOUNT_A.address,
      contractURI: "",
    },
  });
  ```

- [#4528](https://github.com/thirdweb-dev/js/pull/4528) [`c96e2d9`](https://github.com/thirdweb-dev/js/commit/c96e2d977731836db1a1618d67c5f808e7634d05) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle salt parameter for deterministic deploys of published contracts

  You can now pass a salt parameter to the `deployPublishedContract` function to deploy a contract deterministically.

  ```ts
  const address = await deployPublishedContract({
    client,
    chain,
    account,
    contractId: "Airdrop",
    contractParams: {
      defaultAdmin: "0x...",
      contractURI: "ipfs://...",
    },
    salt: "test", // <--- deterministic deploy
  });
  ```

  This also works for unpublished contracts, via the `deployContract` function.

  ```ts
  const address = await deployContract({
    client,
    chain,
    account,
    bytecode: "0x...",
    abi: contractAbi,
    constructorParams: {
      param1: "value1",
      param2: 123,
    },
    salt: "test", // <--- deterministic deploy
  });
  ```

- [#4541](https://github.com/thirdweb-dev/js/pull/4541) [`0596fa2`](https://github.com/thirdweb-dev/js/commit/0596fa24c2c0d53d8d87740a56ce56b4e3bd363a) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds getUsers function to query users on the server

  ```ts
  import { getUser } from "thirdweb/wallets";

  const user = await getUser({
    client,
    walletAddress: "0x123...",
  });
  ```

### Patch Changes

- [#4503](https://github.com/thirdweb-dev/js/pull/4503) [`8636c28`](https://github.com/thirdweb-dev/js/commit/8636c28d0fb68e42ff1d71cb2a9f136c98822c21) Thanks [@jnsdls](https://github.com/jnsdls)! - fix erc721 delayed reveal detection

- [#4544](https://github.com/thirdweb-dev/js/pull/4544) [`40f01e5`](https://github.com/thirdweb-dev/js/commit/40f01e5e89697759099e385490047786d5f0637e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow smart wallet transactions to be sent in parallel

- [#4324](https://github.com/thirdweb-dev/js/pull/4324) [`d6e9def`](https://github.com/thirdweb-dev/js/commit/d6e9def57738458d0a228bb33e436e11cbc8847c) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose toFunctionSelector

- [#4543](https://github.com/thirdweb-dev/js/pull/4543) [`b4e1491`](https://github.com/thirdweb-dev/js/commit/b4e149101d70da4d65c3206dc83e3a7227028425) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Display social profiles for linked accounts

- [#4507](https://github.com/thirdweb-dev/js/pull/4507) [`6353cb7`](https://github.com/thirdweb-dev/js/commit/6353cb73318df3eaed558a6b4fbd1884b9bd6e23) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix erc721 delayed reveal simulation error

- [#4524](https://github.com/thirdweb-dev/js/pull/4524) [`beb894a`](https://github.com/thirdweb-dev/js/commit/beb894a355bf1db7945882bbaea4e318e584ec28) Thanks [@jnsdls](https://github.com/jnsdls)! - Polygon Matic is now POL

## 5.53.0

### Minor Changes

- [#4094](https://github.com/thirdweb-dev/js/pull/4094) [`f1d087e`](https://github.com/thirdweb-dev/js/commit/f1d087e24e8ad74948c0cdfa85d3705319753850) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for Coinbase Smart Wallet in React Native

  You can now use the Coinbase Smart Wallet in your React Native apps.

  ```ts
  const wallet = createWallet("com.coinbase.wallet", {
    appMetadata: {
      name: "My app name",
    },
    mobileConfig: {
      callbackURL: "https://example.com",
    },
    walletConfig: {
      options: "smartWalletOnly",
    },
  });

  await wallet.connect({
    client,
  });
  ```

- [#4454](https://github.com/thirdweb-dev/js/pull/4454) [`c546b65`](https://github.com/thirdweb-dev/js/commit/c546b65e172623c0079efafbfce167c79e29a2ce) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose `createAndSignUserOp` utility function

### Patch Changes

- [#4466](https://github.com/thirdweb-dev/js/pull/4466) [`763e439`](https://github.com/thirdweb-dev/js/commit/763e4390f73b1a507398890396364cc52f12fa8e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Export thirdweb/social functions and types

- [#4477](https://github.com/thirdweb-dev/js/pull/4477) [`42feff3`](https://github.com/thirdweb-dev/js/commit/42feff3a3a0ef1d384e2f0ab776c3e8ff3152085) Thanks [@kumaryash90](https://github.com/kumaryash90)! - More storage slots for proxy resolution

- [#4462](https://github.com/thirdweb-dev/js/pull/4462) [`f3a6179`](https://github.com/thirdweb-dev/js/commit/f3a6179e373c8e06fade56b1eff48c2261247c0e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix common icons theme in React Native

- [#4473](https://github.com/thirdweb-dev/js/pull/4473) [`baf1a21`](https://github.com/thirdweb-dev/js/commit/baf1a21d697b51496c21def4d43be68a7d7c626e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Updated SocialProfiles type to be SocialProfile[]

- [#4478](https://github.com/thirdweb-dev/js/pull/4478) [`80e0bfe`](https://github.com/thirdweb-dev/js/commit/80e0bfe4c5f14d1629b3c24bb921b66eeb99bd38) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix ERC20 balance read when showing pay modal

## 5.52.0

### Minor Changes

- [#4349](https://github.com/thirdweb-dev/js/pull/4349) [`a2d2291`](https://github.com/thirdweb-dev/js/commit/a2d22911bc8d5119e18a1f88f1929e39f449fc55) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds social profile retrieval for Farcaster, Lens, and ENS.

  ```ts
  import { getSocialProfiles } from "thirdweb/social";
  const profiles = await getSocialProfiles({
    address: "0x...",
    client,
  });
  ```

  ```json
  [
    {
      "type": "ens",
      "name": "joenrv.eth",
      "avatar": "ipfs://bafybeic2wvtpv5hpdyeuy6o77yd5fp2ndfygppd6drdxvtfd2jouijn72m",
      "metadata": {
        "name": "joenrv.eth"
      }
    },
    {
      "type": "farcaster",
      "name": "joaquim",
      "bio": "Eng Lead @ thirdweb",
      "avatar": "https://lh3.googleusercontent.com/EUELPFJzdDNcc3qSaEMekh0_W16acnS8MSvWizt-7HPaQhfJsNFC5HA0W4NKcy6CN9zmV7d4Crqg2B8qM9BpiveqVTl2GPBQ16Ax2IQ",
      "metadata": {
        "fid": 2735,
        "bio": "Eng Lead @ thirdweb",
        "pfp": "https://lh3.googleusercontent.com/EUELPFJzdDNcc3qSaEMekh0_W16acnS8MSvWizt-7HPaQhfJsNFC5HA0W4NKcy6CN9zmV7d4Crqg2B8qM9BpiveqVTl2GPBQ16Ax2IQ",
        "username": "joaquim",
        "addresses": [
          "0x2247d5d238d0f9d37184d8332ae0289d1ad9991b",
          "0xf7970369310b541b8a84086c8c1c81d3beb85e0e"
        ]
      }
    },
    {
      "type": "lens",
      "name": "joaquim",
      "bio": "Lead engineer @thirdweb",
      "avatar": "https://ik.imagekit.io/lens/media-snapshot/557708cc7581172234133c10d473058ace362c5f547fa86cee5be2abe1478e5b.png",
      "metadata": {
        "name": "joaquim",
        "bio": "Lead engineer @thirdweb",
        "picture": "https://ik.imagekit.io/lens/media-snapshot/557708cc7581172234133c10d473058ace362c5f547fa86cee5be2abe1478e5b.png"
      }
    }
  ]
  ```

  ```tsx
  import { useSocialProfiles } from "thirdweb/react";
  const { data: profiles } = useSocialProfiles({
    client,
    address: "0x...",
  });
  ```

- [#3413](https://github.com/thirdweb-dev/js/pull/3413) [`87d6b6a`](https://github.com/thirdweb-dev/js/commit/87d6b6a5b5ba4a51a852829446b730e4bf09e264) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for modular contracts

  # Deploy and Interact with modular contracts programmatically

  ### Deploy a modular contract

  ```ts
  import {
    ClaimableERC721,
    BatchMetadataERC721,
    deployModularContract,
  } from "thirdweb/modules";

  const deployed = deployModularContract({
     client,
     chain,
     account,
     core: "ERC721",
     params: {
       name: "My Modular NFT Contract",
     },
     modules: [
       ClaimableERC721.module({
          primarySaleRecipient: ...,
       }),
       BatchMetadataERC721.module(),
     ],
  });
  ```

  ### Interact with a modular contract

  ```ts
  import { ClaimableERC721 } from "thirdweb/modules";

  const contract = getContract({
    client,
    chain,
    address,
  });

  const transaction = ClaimableERC721.mint({
    contract,
    to: account.address,
    quantity: 1,
  });

  await sendTransaction({
    transaction,
    account,
  });
  ```

### Patch Changes

- [#4444](https://github.com/thirdweb-dev/js/pull/4444) [`9cefe5f`](https://github.com/thirdweb-dev/js/commit/9cefe5f2df9a4cc2eb01a2f5f3d08c610a8c7783) Thanks [@edwardysun](https://github.com/edwardysun)! - Add buyWithCrypto testMode in useSendTransaction

- [#4447](https://github.com/thirdweb-dev/js/pull/4447) [`f0d0f37`](https://github.com/thirdweb-dev/js/commit/f0d0f377dcad1e0a30d0d41515084acda86870af) Thanks [@jnsdls](https://github.com/jnsdls)! - fix baseURI extraction logic

- [#4435](https://github.com/thirdweb-dev/js/pull/4435) [`e7bf498`](https://github.com/thirdweb-dev/js/commit/e7bf4989959f8d1aad17d20a18be1d0f8cffbdf2) Thanks [@edwardysun](https://github.com/edwardysun)! - Add testMode to buyWithCrypto pay options

- [#4345](https://github.com/thirdweb-dev/js/pull/4345) [`fa6809d`](https://github.com/thirdweb-dev/js/commit/fa6809d5003d63edf34cab4a1840cb57b3b8931d) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add ERC1155 getOwnedTokenIds + more tests

- [#4450](https://github.com/thirdweb-dev/js/pull/4450) [`775ab6d`](https://github.com/thirdweb-dev/js/commit/775ab6d5c3e18affd726ac4f9a6f1728537ed463) Thanks [@MananTank](https://github.com/MananTank)! - Add options for hiding buttons on details modal on useWalletDetailsModal

- [#4443](https://github.com/thirdweb-dev/js/pull/4443) [`498d543`](https://github.com/thirdweb-dev/js/commit/498d543bdc921da91e92ceb880844bd5ced2371c) Thanks [@MananTank](https://github.com/MananTank)! - Fix getFunctionId

- [#4446](https://github.com/thirdweb-dev/js/pull/4446) [`f39e1ba`](https://github.com/thirdweb-dev/js/commit/f39e1bab8f7a9089f709b5094502e3f802af5c4e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improve React Query caching performance

## 5.51.0

### Minor Changes

- [#4392](https://github.com/thirdweb-dev/js/pull/4392) [`c5b9d1c`](https://github.com/thirdweb-dev/js/commit/c5b9d1c5dd592b2334d01f2c5036dd5850984041) Thanks [@jnsdls](https://github.com/jnsdls)! - [Extensions] Erc20 Drop ClaimCondition enhancements

- [#4391](https://github.com/thirdweb-dev/js/pull/4391) [`f9c351c`](https://github.com/thirdweb-dev/js/commit/f9c351c22d9c869770dad13332f9c23d8cb84ed7) Thanks [@jnsdls](https://github.com/jnsdls)! - [Extensions] Erc721 Drop ClaimCondition enhancements

- [`54f0294`](https://github.com/thirdweb-dev/js/commit/54f0294e5edd9940fe2b412c6cfed4fb97c02b87) Thanks [@jnsdls](https://github.com/jnsdls)! - [Extensions] Erc1155 Drop ClaimCondition enhancements

### Patch Changes

- [#4393](https://github.com/thirdweb-dev/js/pull/4393) [`f383fc7`](https://github.com/thirdweb-dev/js/commit/f383fc74842cfe642cd05d8f33b68139ba9f4f2b) Thanks [@kumaryash90](https://github.com/kumaryash90)! - resolve implementation for matic proxy implementation slot

- [`a098224`](https://github.com/thirdweb-dev/js/commit/a09822429b0ac2f6bd2cf716f44d784fe7a0b7ab) Thanks [@jnsdls](https://github.com/jnsdls)! - remove unusable singlephase claim condition extension

## 5.50.1

### Patch Changes

- [#4388](https://github.com/thirdweb-dev/js/pull/4388) [`82a30af`](https://github.com/thirdweb-dev/js/commit/82a30afd4bced6071d87c5c018a33ecf22c0449e) Thanks [@edwardysun](https://github.com/edwardysun)! - Update setting default source chain and token

- [#4375](https://github.com/thirdweb-dev/js/pull/4375) [`edb95d0`](https://github.com/thirdweb-dev/js/commit/edb95d00ca71385459181ced58117dec6619f6e7) Thanks [@jnsdls](https://github.com/jnsdls)! - [Extensions] expose permission detection logic

- [#4390](https://github.com/thirdweb-dev/js/pull/4390) [`d74e61b`](https://github.com/thirdweb-dev/js/commit/d74e61b58162e97327928f6b5117bed2ec09c1b4) Thanks [@MananTank](https://github.com/MananTank)! - Fix Swap Fees layout in fees drawer in pay UI

- [#4319](https://github.com/thirdweb-dev/js/pull/4319) [`73e5dc7`](https://github.com/thirdweb-dev/js/commit/73e5dc727668fb9c6cf185f16d28d28ab248558a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix direct payments to the same wallet

- [#4382](https://github.com/thirdweb-dev/js/pull/4382) [`9e8d3e6`](https://github.com/thirdweb-dev/js/commit/9e8d3e66393acb70fb2209c04628aad663e93e03) Thanks [@MananTank](https://github.com/MananTank)! - Add props for hiding "Send", "Receive" and "Send" buttons in Connect Details Modal UI for `ConnectButton` component. By default, all buttons are visible in the modal.

  ```tsx
  <ConnectButton
    detailsModal={{
      hideSendFunds: false,
      hideReceiveFunds: true,
      hideBuyFunds: false,
    }}
  />
  ```

- [#4363](https://github.com/thirdweb-dev/js/pull/4363) [`066aede`](https://github.com/thirdweb-dev/js/commit/066aede2d1bf42201c181a1cd12e1655131d1212) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Allow to specify "from" and "to" props for the ClaimButton

## 5.50.0

### Minor Changes

- [#4334](https://github.com/thirdweb-dev/js/pull/4334) [`6432e8d`](https://github.com/thirdweb-dev/js/commit/6432e8dc6bdd0ed985fe0d76e47b36601bfa8be3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds L2 ENS name resolution

### Patch Changes

- [#4270](https://github.com/thirdweb-dev/js/pull/4270) [`5475551`](https://github.com/thirdweb-dev/js/commit/5475551e5de0750ff1b780522cb01e974a828dd2) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Allow accepting a string for signature mint UIDs

- [#4336](https://github.com/thirdweb-dev/js/pull/4336) [`8b137f0`](https://github.com/thirdweb-dev/js/commit/8b137f0fe2acd1ccd0a2d2e217493f018a603de3) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Hide in-app wallet connection in Pay Embed

- [#4344](https://github.com/thirdweb-dev/js/pull/4344) [`915e7fb`](https://github.com/thirdweb-dev/js/commit/915e7fb8795e359c7907d4f13351536ea71ad566) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix merkletree proof for Drop contracts

- [#4343](https://github.com/thirdweb-dev/js/pull/4343) [`a2f2c7e`](https://github.com/thirdweb-dev/js/commit/a2f2c7e172f9baea1c649a22abeff6a70aa200d3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Better error message when smart wallet connection fails due to rpc error

- [#4327](https://github.com/thirdweb-dev/js/pull/4327) [`bdb814d`](https://github.com/thirdweb-dev/js/commit/bdb814df6ca2c1fb1068de5be1598695880eed32) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix nft approval for CreateDirectListingButton

## 5.49.0

### Minor Changes

- [#4179](https://github.com/thirdweb-dev/js/pull/4179) [`42d5c65`](https://github.com/thirdweb-dev/js/commit/42d5c65e495d56ee211a7b3075e54c4ea190c1e2) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add NFT prebuilt components

  ```tsx
  import { getContract } from "thirdweb";
  import { NFT } from "thirdweb/react";

  const contract = getContract({
    address: "0x...",
    chain: ethereum,
    client: yourThirdwebClient,
  });

  <NFT contract={contract} tokenId={0n}>
    <Suspense fallback={"Loading media..."}>
      <NFTMedia />
    </Suspense>
  </NFT>;
  ```

### Patch Changes

- [#4316](https://github.com/thirdweb-dev/js/pull/4316) [`a65bb88`](https://github.com/thirdweb-dev/js/commit/a65bb8839bfa6d8ea39e9bee4fd04b91378e3e16) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Include from address in in-app wallet transactions

- [#4322](https://github.com/thirdweb-dev/js/pull/4322) [`3e425ec`](https://github.com/thirdweb-dev/js/commit/3e425ecc68e3b601e439a01ad0df032c4a4b9557) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix accessibility warnings

- [#4317](https://github.com/thirdweb-dev/js/pull/4317) [`1e70bbf`](https://github.com/thirdweb-dev/js/commit/1e70bbf2c3ab24732806d04c67c3ea9a512abde7) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Automatic retries for React Native in-app wallet logins

- [#4306](https://github.com/thirdweb-dev/js/pull/4306) [`9d6eb27`](https://github.com/thirdweb-dev/js/commit/9d6eb270818581dcd1d8628cf680e82f603756e9) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix programmatic deployments with smart accounts

- [#4328](https://github.com/thirdweb-dev/js/pull/4328) [`c97b1a5`](https://github.com/thirdweb-dev/js/commit/c97b1a5d7eecf3392fa9b2280a329833b1798141) Thanks [@edwardysun](https://github.com/edwardysun)! - Update default source chain selection in PayEmbed

## 5.48.3

### Patch Changes

- [#4264](https://github.com/thirdweb-dev/js/pull/4264) [`b661ce7`](https://github.com/thirdweb-dev/js/commit/b661ce7b2fd58e7ff01faf47cf8fb3bb232841ec) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add extension for deploying VoteERC20 contract

- [#4291](https://github.com/thirdweb-dev/js/pull/4291) [`f346bb8`](https://github.com/thirdweb-dev/js/commit/f346bb8fca5fd828a96ae9d46e14703050564be2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - ZkSync gasPubPerData increase for faster inclusion

- [#4271](https://github.com/thirdweb-dev/js/pull/4271) [`fcf8f89`](https://github.com/thirdweb-dev/js/commit/fcf8f89af43dafacfb54a6c8c884b6b3631d5a68) Thanks [@alecananian](https://github.com/alecananian)! - Added overrides for connected wallet name and avatar in details button and modal

- [#4295](https://github.com/thirdweb-dev/js/pull/4295) [`db2ee85`](https://github.com/thirdweb-dev/js/commit/db2ee850f3da8e5857b96efbb7c4242396127d97) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds prop to require TOS or Privacy Policy acceptance before connecting to an in-app wallet

- [#4106](https://github.com/thirdweb-dev/js/pull/4106) [`c116597`](https://github.com/thirdweb-dev/js/commit/c1165976410b03754ef65a8f707a4c7fccd3d3a1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support Entrypoint v0.7 for smart accounts

- [#4307](https://github.com/thirdweb-dev/js/pull/4307) [`dc79abd`](https://github.com/thirdweb-dev/js/commit/dc79abdca06d387516ce1f9c84782a4543d4bde1) Thanks [@MananTank](https://github.com/MananTank)! - Fix `NFTMetadata` type - remove `id` property

- [#4294](https://github.com/thirdweb-dev/js/pull/4294) [`09bb251`](https://github.com/thirdweb-dev/js/commit/09bb25165753841f7d144e22f17cca326c91f8f2) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix: ecosystem wallet signing modal should be clickable even when there's a pop up beneath

- [#4286](https://github.com/thirdweb-dev/js/pull/4286) [`dda57ea`](https://github.com/thirdweb-dev/js/commit/dda57eaad32e38dffecb888494fe2441dc8ff265) Thanks [@edwardysun](https://github.com/edwardysun)! - No retries on permanent failures on Pay quotes

## 5.48.2

### Patch Changes

- [#4250](https://github.com/thirdweb-dev/js/pull/4250) [`41fbdaf`](https://github.com/thirdweb-dev/js/commit/41fbdafcf777a58883e9f2daefb6bf4f77d5ecda) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Add overload to `signMessage` to pass an account rather than a private key

  ```ts
  import { signMessage } from "thirdweb/utils";
  await signMessage({
    message: "Hello, world!",
    account,
  });
  ```

- [#4267](https://github.com/thirdweb-dev/js/pull/4267) [`7a2de70`](https://github.com/thirdweb-dev/js/commit/7a2de7031077efba27b6bf74c1774a51e9151d22) Thanks [@alecananian](https://github.com/alecananian)! - Added `hideSwitchWallet` param to wallet details modal

- [#4224](https://github.com/thirdweb-dev/js/pull/4224) [`1405598`](https://github.com/thirdweb-dev/js/commit/1405598e7e51e4d415fd57f8169012823db0cedf) Thanks [@IDubuque](https://github.com/IDubuque)! - Added support for direct transfers in Pay

- [#4269](https://github.com/thirdweb-dev/js/pull/4269) [`120d61f`](https://github.com/thirdweb-dev/js/commit/120d61f41083198470b9dd4968d5914b644c6de5) Thanks [@MananTank](https://github.com/MananTank)! - Show wallet balance with upto 5 decimal places in UI components

- [#4274](https://github.com/thirdweb-dev/js/pull/4274) [`a0aea23`](https://github.com/thirdweb-dev/js/commit/a0aea23e74ffce4cd20842603efa87a5c038feb8) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix popup and window auth modes conflicting on firefox

- [#4244](https://github.com/thirdweb-dev/js/pull/4244) [`44e8e7b`](https://github.com/thirdweb-dev/js/commit/44e8e7bce21240156e55eec411dd461e746c3c8c) Thanks [@MananTank](https://github.com/MananTank)! - - Pay UI now selects the fiat currency based on the user's location / timezone

  - Add Japanese Yen (JPY) as a supported fiat currency for thirdweb Pay
  - Added option to configure the default fiat currency for the Pay UI

  Examples

  ```tsx
  <PayEmbed
    client={client}
    payOptions={{
      buyWithFiat: {
        prefillSource: {
          currency: "CAD",
        },
      },
    }}
  />
  ```

  ```tsx
  <ConnectButton
    client={client}
    detailsModal={{
      payOptions: {
        buyWithFiat: {
          prefillSource: {
            currency: "JPY",
          },
        },
      },
    }}
  />
  ```

  ```ts
  const sendTransaction = useSendTransaction({
    payModal: {
      buyWithFiat: {
        prefillSource: {
          currency: "CAD",
        },
      },
    },
  });
  ```

  ```tsx
  <TransactionButton
    transaction={() => someTx}
    payModal={{
      buyWithFiat: {
        prefillSource: {
          currency: "CAD",
        },
      },
    }}
  >
    some tx
  </TransactionButton>
  ```

## 5.48.1

### Patch Changes

- [#4237](https://github.com/thirdweb-dev/js/pull/4237) [`b38308d`](https://github.com/thirdweb-dev/js/commit/b38308d893aa571d910ae5f76c6538eb83e1dce5) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Enable external redirects for electron support

  ```ts
  import { authenticate } from "thirdweb/wallets/in-app";

  const result = await authenticate({
    client,
    strategy: "google",
    redirectUrl: "https://example.org",
    mode: "window",
  });
  ```

- [#4213](https://github.com/thirdweb-dev/js/pull/4213) [`6c87d7b`](https://github.com/thirdweb-dev/js/commit/6c87d7ba3a28e136bdd4580ab15e7407ad78f6b3) Thanks [@MananTank](https://github.com/MananTank)! - Fix "conditionally rendereed hooks error" in various components in `thirdweb/react` and `thirdweb/react-native`

- [#4214](https://github.com/thirdweb-dev/js/pull/4214) [`0a1bce8`](https://github.com/thirdweb-dev/js/commit/0a1bce8fa84259264cbac0820b45dd3989cfec73) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix custom image metadata on in-app wallets

- [#4239](https://github.com/thirdweb-dev/js/pull/4239) [`d93ec63`](https://github.com/thirdweb-dev/js/commit/d93ec63cd742fc7dff559d3f4325bb3350a233d1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix passkey domain not being respected on login

## 5.48.0

### Minor Changes

- [#4191](https://github.com/thirdweb-dev/js/pull/4191) [`42cdc3a`](https://github.com/thirdweb-dev/js/commit/42cdc3a2bcfa44de46c48fa2e5c8b2a279eac8bb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Updates connect modal styles

- [#4124](https://github.com/thirdweb-dev/js/pull/4124) [`246701d`](https://github.com/thirdweb-dev/js/commit/246701d615041a1dd1b8aca0a7aab62f261ac1ca) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds the ability to link a wallet in the Connect UI

### Patch Changes

- [#4128](https://github.com/thirdweb-dev/js/pull/4128) [`ef9cc55`](https://github.com/thirdweb-dev/js/commit/ef9cc55b69e77e310e600a3403ac0b2bae4b901e) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose max() & min() util methods for bigints

- [#4172](https://github.com/thirdweb-dev/js/pull/4172) [`cb591aa`](https://github.com/thirdweb-dev/js/commit/cb591aa6afffa57de31e5bdce91ad9964856e81c) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Only show pay modal if active wallet does not have enough funds for a paid transaction

- [#4177](https://github.com/thirdweb-dev/js/pull/4177) [`bd46699`](https://github.com/thirdweb-dev/js/commit/bd4669984dab9973ae1ecc6c7351a5040461e595) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expsose GaslessConfigs type

  ```ts
  const gaslessOptions: GaslessOptions = {
    provider: "engine",
    relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
    relayerForwarderAddress: "0x...",
  };
  ```

- [#4211](https://github.com/thirdweb-dev/js/pull/4211) [`4abf7a7`](https://github.com/thirdweb-dev/js/commit/4abf7a7f25182af964f0130c3ff1db574fd5ebc5) Thanks [@MananTank](https://github.com/MananTank)! - Fix Conditionally rendered hook error when Buying funds using fiat

## 5.47.1

### Patch Changes

- [#4173](https://github.com/thirdweb-dev/js/pull/4173) [`7778063`](https://github.com/thirdweb-dev/js/commit/7778063458fc69a2e0a21fb58a89b34b36b16cdb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Update Blobbie appearance

- [#4154](https://github.com/thirdweb-dev/js/pull/4154) [`9133b45`](https://github.com/thirdweb-dev/js/commit/9133b45700cfe50bb275bb8ef676491f9e39fd5d) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Update tsdocs for Vote extensions

- [#4150](https://github.com/thirdweb-dev/js/pull/4150) [`a43907e`](https://github.com/thirdweb-dev/js/commit/a43907e2df9c412b5c73c706ca4e4165b7273f68) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Lens's resolveAddress for sending crypto with lens handles

- [#4163](https://github.com/thirdweb-dev/js/pull/4163) [`fc8daaa`](https://github.com/thirdweb-dev/js/commit/fc8daaa2bc469c04ee62182e5813ad7c78d101ec) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Export util method: isBytes

- [#4165](https://github.com/thirdweb-dev/js/pull/4165) [`43f9319`](https://github.com/thirdweb-dev/js/commit/43f9319ac7ddab288ebcc5b5dbdd6b004c3bcf77) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add GaslessOptions to useSendAndConfirmTransaction

## 5.47.0

### Minor Changes

- [#4139](https://github.com/thirdweb-dev/js/pull/4139) [`5fda794`](https://github.com/thirdweb-dev/js/commit/5fda794569e799cebdf8bb36bc45263f7f517988) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose ERC20Vote extensions and add more Vote contract extensions

### Patch Changes

- [#4120](https://github.com/thirdweb-dev/js/pull/4120) [`8253524`](https://github.com/thirdweb-dev/js/commit/825352476cfc7259fe336d7d06bd53ee5dcca8c7) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Throw error when no encryption key is provided to custom auth

- [#4159](https://github.com/thirdweb-dev/js/pull/4159) [`cf4443a`](https://github.com/thirdweb-dev/js/commit/cf4443a9ebb152f815700e6da3bf0a64a8c0faa4) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improves the Blobbie algorithm

- [#4126](https://github.com/thirdweb-dev/js/pull/4126) [`13764f1`](https://github.com/thirdweb-dev/js/commit/13764f1abb95fe03199c5802b3bd909c58590c25) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Connect UI cosmetic improvements

- [#4157](https://github.com/thirdweb-dev/js/pull/4157) [`355795a`](https://github.com/thirdweb-dev/js/commit/355795a2d419791a2a17bedb26f5d794ef19cbec) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix text wrapping on Connect Button

- [#4160](https://github.com/thirdweb-dev/js/pull/4160) [`e0dcc64`](https://github.com/thirdweb-dev/js/commit/e0dcc642564c2456fe3163c98c4b504bac508359) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix connect button border on firefox browser

- [#4156](https://github.com/thirdweb-dev/js/pull/4156) [`f0d6e34`](https://github.com/thirdweb-dev/js/commit/f0d6e343eea28cd49863ba4794b89d6b070c52b2) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix smart contract wallet signature validation on older chains

## 5.46.1

### Patch Changes

- [#4099](https://github.com/thirdweb-dev/js/pull/4099) [`79260c8`](https://github.com/thirdweb-dev/js/commit/79260c8cd0e48cb2f613a8872d72a3abde4a9b2d) Thanks [@WyattMufson](https://github.com/WyattMufson)! - Add new auth fields to support redirect in web and electron applications

## 5.46.0

### Minor Changes

- [#4045](https://github.com/thirdweb-dev/js/pull/4045) [`3c32b99`](https://github.com/thirdweb-dev/js/commit/3c32b99b3addf91ec2fa8aaa02da27c6baf361a2) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Update SIWE interface

  ```ts
  import { inAppWallet, createWallet } from "thirdweb/wallets";
  import { mainnet } from "thirdweb/chains";

  const rabby = createWallet("io.rabby");
  const wallet = inAppWallet();

  const account = await wallet.connect({
    client: MY_CLIENT,
    strategy: "wallet",
    wallet: rabby,
    chain: mainnet,
  });
  ```

- [#4077](https://github.com/thirdweb-dev/js/pull/4077) [`ef9c7df`](https://github.com/thirdweb-dev/js/commit/ef9c7df2205fd9efa3afe1ccc57c25952e88401f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Passkey login support in React Native

### Patch Changes

- [#4033](https://github.com/thirdweb-dev/js/pull/4033) [`141fd53`](https://github.com/thirdweb-dev/js/commit/141fd53759f1b5515e38688fe96364edc4c76644) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add more Split contract extensions

- [#3998](https://github.com/thirdweb-dev/js/pull/3998) [`db8695d`](https://github.com/thirdweb-dev/js/commit/db8695d0e8f366e7c577a5098c45fa40e96850b0) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add NFT extension: updateTokenURI

- [#4101](https://github.com/thirdweb-dev/js/pull/4101) [`03a809a`](https://github.com/thirdweb-dev/js/commit/03a809a33f5a026162bda15586ad8f6d00a45b3a) Thanks [@MananTank](https://github.com/MananTank)! - Add `onPurchaseSuccess` callback to `PayEmbed`, `ConnectButton`, `TransactionButton` and `useSendTransaction` and gets called when user completes the purchase using thirdweb pay.

  ```tsx
  <PayEmbed
    client={client}
    payOptions={{
      onPurchaseSuccess(info) {
        console.log("purchase success", info);
      },
    }}
  />
  ```

  ```tsx
  <ConnectButton
    client={client}
    detailsModal={{
      payOptions: {
        onPurchaseSuccess(info) {
          console.log("purchase success", info);
        },
      },
    }}
  />
  ```

  ```tsx
  <TransactionButton
    transaction={...}
    payModal={{
      onPurchaseSuccess(info) {
        console.log("purchase success", info);
      },
    }}
  >
    Some Transaction
  </TransactionButton>
  ```

  ```ts
  const sendTransaction = useSendTransaction({
    payModal: {
      onPurchaseSuccess(info) {
        console.log("purchase success", info);
      },
    },
  });
  ```

- [#4047](https://github.com/thirdweb-dev/js/pull/4047) [`7a68e3b`](https://github.com/thirdweb-dev/js/commit/7a68e3b8ed71e7fa0ca64d5a58162817d4b0703b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Switch to the proper chain prior to signing SIWE payloads

- [#4092](https://github.com/thirdweb-dev/js/pull/4092) [`0ca1a79`](https://github.com/thirdweb-dev/js/commit/0ca1a79342384dd4a0990ec309c2272cc10d9570) Thanks [@gregfromstl](https://github.com/gregfromstl)! - UI cosmetic improvements

- [#4091](https://github.com/thirdweb-dev/js/pull/4091) [`b9ed753`](https://github.com/thirdweb-dev/js/commit/b9ed7535a4b37c9e74567c939abbea88a935e692) Thanks [@MananTank](https://github.com/MananTank)! - Fix connection with Safe using WalletConnect link

- [#4070](https://github.com/thirdweb-dev/js/pull/4070) [`e5a046e`](https://github.com/thirdweb-dev/js/commit/e5a046ecdde1d421a9f15ca52cdb2e955fcb8374) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add contract util method: `getCompilerMetadata()`

## 5.45.1

### Patch Changes

- [#4040](https://github.com/thirdweb-dev/js/pull/4040) [`539bdab`](https://github.com/thirdweb-dev/js/commit/539bdab40321649b3d0163d31eaffe066d669046) Thanks [@jnsdls](https://github.com/jnsdls)! - remove bun options from CLI to increase stability

## 5.45.0

### Minor Changes

- [#3870](https://github.com/thirdweb-dev/js/pull/3870) [`bbb4f1c`](https://github.com/thirdweb-dev/js/commit/bbb4f1c53f982b1f9de00fb30efbf2c77f155e96) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds useProfiles hook to fetch linked profiles for the current wallet.

  ```jsx
  import { useProfiles } from "thirdweb/react";

  const { data: profiles } = useProfiles();

  console.log("Type:", profiles[0].type); // "discord"
  console.log("Email:", profiles[0].email); // "john.doe@example.com"
  ```

- [#3870](https://github.com/thirdweb-dev/js/pull/3870) [`bbb4f1c`](https://github.com/thirdweb-dev/js/commit/bbb4f1c53f982b1f9de00fb30efbf2c77f155e96) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds SIWE authentication on in-app wallets

  ```ts
  import { inAppWallet } from "thirdweb/wallets";

  const wallet = inAppWallet();
  const account = await wallet.connect({
    client,
    walletId: "io.metamask",
    chainId: 1, // can be anything unless using smart accounts
  });
  ```

  This will give you a new in-app wallet, **not** the injected provider wallet.

- [#3797](https://github.com/thirdweb-dev/js/pull/3797) [`f74d523`](https://github.com/thirdweb-dev/js/commit/f74d52369f5170f87897af51118f749b6afef39d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Wallets can now add additional profiles to an account. Once added, any connected profile can be used to access the same wallet.

  ```ts
  const wallet = inAppWallet();

  await wallet.connect({ strategy: "google" });
  const profiles = await linkProfile(wallet, { strategy: "discord" });
  ```

  Both the Google and Discord accounts will now be linked to the same wallet.

  If the Discord account is already linked to this or another wallet, this will throw an error.

  You can retrieve all profiles linked to a wallet using the `getProfiles` method.

  ```ts
  import { inAppWallet, getProfiles } from "thirdweb/wallets";

  const wallet = inAppWallet();
  wallet.connect({ strategy: "google" });

  const profiles = getProfiles(wallet);
  ```

  This would return an array of profiles like this:

  ```ts
  [
    {
      type: "google",
      details: {
        email: "user@gmail.com",
      },
    },
    {
      type: "discord",
      details: {
        email: "user@gmail.com",
      },
    },
  ];
  ```

- [#3995](https://github.com/thirdweb-dev/js/pull/3995) [`5367eed`](https://github.com/thirdweb-dev/js/commit/5367eed3b6fbb8dd52363443f960d557779ea2cb) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add thirdweb Split contract extensions

- [#3993](https://github.com/thirdweb-dev/js/pull/3993) [`c31f25c`](https://github.com/thirdweb-dev/js/commit/c31f25c51e2ac99cafb34e5c6252a0974bb8ea16) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add thirdweb Vote contract extensions

- [#3870](https://github.com/thirdweb-dev/js/pull/3870) [`bbb4f1c`](https://github.com/thirdweb-dev/js/commit/bbb4f1c53f982b1f9de00fb30efbf2c77f155e96) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds account linking to the Connect UI

### Patch Changes

- [#4029](https://github.com/thirdweb-dev/js/pull/4029) [`b0494f6`](https://github.com/thirdweb-dev/js/commit/b0494f6eb4b1031be5dcc1ad984e13179dea5d28) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix SIWE auth in ecosystem wallets

- [#4015](https://github.com/thirdweb-dev/js/pull/4015) [`05cee23`](https://github.com/thirdweb-dev/js/commit/05cee23bbb745fd8b957060938e4817a229191eb) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix native AutoConnect

- [#3997](https://github.com/thirdweb-dev/js/pull/3997) [`dd7d28c`](https://github.com/thirdweb-dev/js/commit/dd7d28c44f58cd633dd63e52eed357438a413a48) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Improved serializeTransaction interface to include separate signature input (maintains backwards compatibility)

- [#4014](https://github.com/thirdweb-dev/js/pull/4014) [`419873a`](https://github.com/thirdweb-dev/js/commit/419873a3c618f5ddfa2e5f9b08f0696784e0e983) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Small fix for ethers5 adapter

- [#3986](https://github.com/thirdweb-dev/js/pull/3986) [`4d0e00a`](https://github.com/thirdweb-dev/js/commit/4d0e00a7c41746fec740c889362f84eada536ffb) Thanks [@jarrodwatts](https://github.com/jarrodwatts)! - add abstract l2 chain definition (ZKSync ZK stack)

- [#4008](https://github.com/thirdweb-dev/js/pull/4008) [`7cba594`](https://github.com/thirdweb-dev/js/commit/7cba594046b05635ad11c24af9cb82b05d884f89) Thanks [@MananTank](https://github.com/MananTank)! - Fix "All Wallets" not shown by default in Pay UI when trying to connect a new wallet

- [#3989](https://github.com/thirdweb-dev/js/pull/3989) [`a4bc285`](https://github.com/thirdweb-dev/js/commit/a4bc285cb76945dea536d37026da281528490c72) Thanks [@MananTank](https://github.com/MananTank)! - Update the chain object in connection manager and wallets when chain objects passed to UI components are updated.

- [#3996](https://github.com/thirdweb-dev/js/pull/3996) [`2b4629b`](https://github.com/thirdweb-dev/js/commit/2b4629b5058df0731f16322827661fba86f5d898) Thanks [@0xScratch](https://github.com/0xScratch)! - Added Fraxtal and Mode Testnets to the chain-definitions

- [#4032](https://github.com/thirdweb-dev/js/pull/4032) [`c953c3f`](https://github.com/thirdweb-dev/js/commit/c953c3f4c85a1e153bd2bef0f24709825204af69) Thanks [@alecananian](https://github.com/alecananian)! - Added `enabled` param to `useWalletBalance` hook

## 5.44.1

### Patch Changes

- [#3976](https://github.com/thirdweb-dev/js/pull/3976) [`358a757`](https://github.com/thirdweb-dev/js/commit/358a7577c1c92cb777952e21253d4924e11a6303) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix wallet info retrieval for adapter wallets

- [#3963](https://github.com/thirdweb-dev/js/pull/3963) [`2e3c5e9`](https://github.com/thirdweb-dev/js/commit/2e3c5e9dbd307119804ad14896fac5c645e59a40) Thanks [@jnsdls](https://github.com/jnsdls)! - handle switching accounts inside a connected wallet in SIWE auth states

- [#3934](https://github.com/thirdweb-dev/js/pull/3934) [`d7e5930`](https://github.com/thirdweb-dev/js/commit/d7e59305bd4852c1f7686b1b3fa2a260fa44b813) Thanks [@jxom](https://github.com/jxom)! - Fix 6492 signature verification for undeployed accounts

- [#3894](https://github.com/thirdweb-dev/js/pull/3894) [`dc86fa2`](https://github.com/thirdweb-dev/js/commit/dc86fa2e6ea1899d414054528fd59c920c2ab030) Thanks [@IDubuque](https://github.com/IDubuque)! - updated pay interface for onramp + gas

## 5.44.0

### Minor Changes

- [`c9e14e3`](https://github.com/thirdweb-dev/js/commit/c9e14e366ca5ab016fd77df588488d0effe408db) Thanks [@jnsdls](https://github.com/jnsdls)! - Adds telegram login option for in-app wallets

  ```ts
  import { inAppWallet } from "thirdweb";

  const wallet = inAppWallet();

  await wallet.connect({
    strategy: "telegram",
  });
  ```

### Patch Changes

- [`c9e14e3`](https://github.com/thirdweb-dev/js/commit/c9e14e366ca5ab016fd77df588488d0effe408db) Thanks [@jnsdls](https://github.com/jnsdls)! - Added Celo Alfajores Testnet within the chain-definitions

- [`c9e14e3`](https://github.com/thirdweb-dev/js/commit/c9e14e366ca5ab016fd77df588488d0effe408db) Thanks [@jnsdls](https://github.com/jnsdls)! - Add `type` field on `DirectListing` and `EnglishAuction` types.

## 5.43.2

### Patch Changes

- [#3895](https://github.com/thirdweb-dev/js/pull/3895) [`13d9741`](https://github.com/thirdweb-dev/js/commit/13d9741f77df6e8e3d53dbffe6671d0852ac6a06) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add Korean and French Locale

- [#3901](https://github.com/thirdweb-dev/js/pull/3901) [`825ef23`](https://github.com/thirdweb-dev/js/commit/825ef239a0552295a218e61f4dcbb5f32eb19632) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle gas free chains where baseFeePerGas is 0

- [#3903](https://github.com/thirdweb-dev/js/pull/3903) [`306f3da`](https://github.com/thirdweb-dev/js/commit/306f3da606b83d7030d6a2d0b1771e1b3f9edb8b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix occasional iframe error when logging in with oauth

## 5.43.1

### Patch Changes

- [#3896](https://github.com/thirdweb-dev/js/pull/3896) [`3b49b18`](https://github.com/thirdweb-dev/js/commit/3b49b18f4da60ae27c540a8957e81c55df787609) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix OTP validation in React Native Connect UI

- [#3897](https://github.com/thirdweb-dev/js/pull/3897) [`4463848`](https://github.com/thirdweb-dev/js/commit/446384867180e5441fd361de979457ff93818d59) Thanks [@jnsdls](https://github.com/jnsdls)! - fix "create" command requiring login

## 5.43.0

### Minor Changes

- [#3875](https://github.com/thirdweb-dev/js/pull/3875) [`337c8c9`](https://github.com/thirdweb-dev/js/commit/337c8c953e6fd70145a10ddd0aadbf2eb1c6e5aa) Thanks [@jnsdls](https://github.com/jnsdls)! - add German localization

- [#3881](https://github.com/thirdweb-dev/js/pull/3881) [`e7d6161`](https://github.com/thirdweb-dev/js/commit/e7d616181900542c934a49695f2381fd6d70e1d0) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add CreateDirectListing button for Marketplace v3

  ```tsx
  import { CreateDirectListingButton } from "thirdweb/react";

  <CreateDirectListingButton
    contractAddress="0x..." // contract address for the marketplace-v3
    chain={...} // the chain which the marketplace contract is deployed on

    // These props below are the same props for `createListing`
    // to get the full list, check the docs link above
    tokenId={0n}
    assetContractAddress="0x..." // The NFT contract address whose NFT(s) you want to sell
    pricePerToken={"0.1"} // sell for 0.1 <native token>
  >
    Sell NFT
  </CreateDirectListingButton>
  ```

### Patch Changes

- [#3885](https://github.com/thirdweb-dev/js/pull/3885) [`6cd279b`](https://github.com/thirdweb-dev/js/commit/6cd279bc49bc7c748d6cb832ab2d96089767f59a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix ethers5adapter transaction result nonces

- [#3871](https://github.com/thirdweb-dev/js/pull/3871) [`f702cf7`](https://github.com/thirdweb-dev/js/commit/f702cf7216aec61de0b335e5745a9b79b90edec3) Thanks [@jnsdls](https://github.com/jnsdls)! - temporarily disable CLI login

- [#3882](https://github.com/thirdweb-dev/js/pull/3882) [`4171f15`](https://github.com/thirdweb-dev/js/commit/4171f1536dea288cea77729ff94b17c48af21d23) Thanks [@MananTank](https://github.com/MananTank)! - Improved error messages when connection management hooks used outside ThirdwebProvider

- [#3880](https://github.com/thirdweb-dev/js/pull/3880) [`5eb4955`](https://github.com/thirdweb-dev/js/commit/5eb495581d236f36708f849de9ee2a001a224db4) Thanks [@MananTank](https://github.com/MananTank)! - Fix autoConnect for wallets that are connected from "All wallets" screen

## 5.42.0

### Minor Changes

- [#3847](https://github.com/thirdweb-dev/js/pull/3847) [`e27ebef`](https://github.com/thirdweb-dev/js/commit/e27ebef85bb61342c3de53f85e134cf4a29f787c) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add prebuilt component: BuyDirectListingButton for Marketplace v3

  ```tsx
  import { BuyDirectListingButton } from "thirdweb/react";

  <BuyDirectListingButton
    contractAddress="0x..." // contract address of the marketplace v3
    chain={...} // the chain which the marketplace contract is deployed on
    client={...} // thirdweb client
    listingId={100n} // the listingId or the item you want to buy
    quantity={1n} // optional - see the docs to learn more
  >
    Buy NFT
  </BuyDirectListingButton>
  ```

- [#3857](https://github.com/thirdweb-dev/js/pull/3857) [`d5e5467`](https://github.com/thirdweb-dev/js/commit/d5e546726ab388e642d144c494853c23e3b24aba) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds useChainMetadata to retrieve metadata for a chain such as name, icon, available faucets, block explorers, etc.

  ```jsx
  import { useChainMetadata } from "thirdweb/react";

  const { data: chainMetadata } = useChainMetadata(defineChain(11155111));

  console.log("Name:", chainMetadata.name); // Sepolia
  console.log("Faucets:", chainMetadata.faucets); // ["https://thirdweb.com/sepolia/faucet"]
  console.log("Explorers:", chainMetadata.explorers); // ["https://sepolia.etherscan.io/"]
  ```

### Patch Changes

- [#3846](https://github.com/thirdweb-dev/js/pull/3846) [`cdb2970`](https://github.com/thirdweb-dev/js/commit/cdb29708061d52f576617e6a91518465d9894157) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Handle ERC20 approval for the ClaimButton

- [#3843](https://github.com/thirdweb-dev/js/pull/3843) [`91edae5`](https://github.com/thirdweb-dev/js/commit/91edae58a771722b3818f855acd37993e2be5145) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose multicall & erc1155:encodeSafeTransferFrom extension

- [#3867](https://github.com/thirdweb-dev/js/pull/3867) [`109575e`](https://github.com/thirdweb-dev/js/commit/109575eba5285b5c4022839e98ff5dc41064dc93) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix wallet social login button styling

- [#3854](https://github.com/thirdweb-dev/js/pull/3854) [`7ec421f`](https://github.com/thirdweb-dev/js/commit/7ec421f0e7c87a93a5a1d80d561c8082f75620ce) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add util function: parseAbiParams

  ```ts
  import { parseAbiParams } from "thirdweb/utils";

  const example1 = parseAbiParams(
    ["address", "uint256"],
    ["0x.....", "1200000"],
  ); // result: ["0x......", 1200000n]
  ```

- [#3869](https://github.com/thirdweb-dev/js/pull/3869) [`bd44ce9`](https://github.com/thirdweb-dev/js/commit/bd44ce935e6857811a865b2c8ed8e0b9eb61e625) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Export more wallet creation and connection types

## 5.41.0

### Minor Changes

- [#3827](https://github.com/thirdweb-dev/js/pull/3827) [`b0a303d`](https://github.com/thirdweb-dev/js/commit/b0a303d5ef7cf7a74d5aadc9c04d0b6161806f8b) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Adds SIWF for in-app wallets

  ```ts
  await wallet.connect({
    strategy: "farcaster",
    client: CLIENT,
  });
  ```

### Patch Changes

- [#3831](https://github.com/thirdweb-dev/js/pull/3831) [`d775333`](https://github.com/thirdweb-dev/js/commit/d775333b40dbcfab18702019b40ff54e6fed1a79) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Expose ERC20 extension: getApprovalForTransaction

- [#3845](https://github.com/thirdweb-dev/js/pull/3845) [`b551b69`](https://github.com/thirdweb-dev/js/commit/b551b692914b8c35cf365c46e63c17cce66c018e) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Restyles the View Assets Connect UI page

- [#3817](https://github.com/thirdweb-dev/js/pull/3817) [`b128530`](https://github.com/thirdweb-dev/js/commit/b128530355f0dc47d897bd2ef7c3823752ea9b6c) Thanks [@MananTank](https://github.com/MananTank)! - Move connection manager creation to context instead of global singleton

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
