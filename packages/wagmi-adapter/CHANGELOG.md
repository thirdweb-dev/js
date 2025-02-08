# @thirdweb-dev/wagmi-adapter

## 0.2.14

## 0.2.13

## 0.2.12

## 0.2.11

### Patch Changes

- [#6117](https://github.com/thirdweb-dev/js/pull/6117) [`ae675db`](https://github.com/thirdweb-dev/js/commit/ae675db8c86a9e4cddb6eb208cd132e0eeaa1978) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes getProvider autoconnections with account factory

## 0.2.10

## 0.2.9

## 0.2.8

### Patch Changes

- [#6100](https://github.com/thirdweb-dev/js/pull/6100) [`411895c`](https://github.com/thirdweb-dev/js/commit/411895c0027200fc580fcd58a2ac440da6e227a0) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fix wagmi adapter usage with account factories

## 0.2.7

### Patch Changes

- [#6079](https://github.com/thirdweb-dev/js/pull/6079) [`1616b7f`](https://github.com/thirdweb-dev/js/commit/1616b7f6198d43fc48a1269b1cca93958cbf7dba) Thanks [@jnsdls](https://github.com/jnsdls)! - updated dependencies

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.1

### Patch Changes

- [#6015](https://github.com/thirdweb-dev/js/pull/6015) [`8bbee03`](https://github.com/thirdweb-dev/js/commit/8bbee03c77abe95d2c4a48b46fefa9086de3b749) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Fixes issue with smart wallets used on SiteLink and SiteEmbed

## 0.2.0

### Minor Changes

- [#6005](https://github.com/thirdweb-dev/js/pull/6005) [`dc05f2e`](https://github.com/thirdweb-dev/js/commit/dc05f2ea3c346ca96d3613c1a94a2b5ce57fe95d) Thanks [@gregfromstl](https://github.com/gregfromstl)! - Accept url token parameters on autoconnection

## 0.1.9

## 0.1.8

## 0.1.7

## 0.1.6

## 0.1.5

## 0.1.4

## 0.1.3

## 0.1.2

## 0.1.1

### Patch Changes

- [#5723](https://github.com/thirdweb-dev/js/pull/5723) [`a57bfdb`](https://github.com/thirdweb-dev/js/commit/a57bfdb5658c431eed27fc2952cc4319c364a89c) Thanks [@jnsdls](https://github.com/jnsdls)! - publish fix

## 0.1.0

### Minor Changes

- [#5644](https://github.com/thirdweb-dev/js/pull/5644) [`8d2e2ad`](https://github.com/thirdweb-dev/js/commit/8d2e2ad92db675315f6950b787fd6a5f426e249e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Wagmi connector for in-app wallets

  You can now connect to an in-app wallet in your wagmi applications.

  Install the wagmi adapter:

  ```bash
  npm install @thirdweb-dev/wagmi-adapter
  ```

  Create a wagmi config with the in-app wallet connector:

  ```ts
  import { http, createConfig } from "wagmi";
  import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
  import { createThirdwebClient, defineChain as thirdwebChain } from "thirdweb";

  const client = createThirdwebClient({
    clientId: "...",
  });

  export const config = createConfig({
    chains: [sepolia],
    connectors: [
      inAppWalletConnector({
        client,
        // optional: turn on smart accounts
        smartAccounts: {
          sponsorGas: true,
          chain: thirdwebChain(sepolia),
        },
      }),
    ],
    transports: {
      [sepolia.id]: http(),
    },
  });
  ```

  Then in your app, you can use the connector to connect with any supported strategy:

  ```ts
  const { connect, connectors } = useConnect();

  const onClick = () => {
    const inAppWallet = connectors.find((x) => x.id === "in-app-wallet");
    connect({
      connector: inAppWallet,
      strategy: "google",
    });
  };
  ```
