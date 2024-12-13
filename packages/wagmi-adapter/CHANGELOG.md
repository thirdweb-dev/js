# @thirdweb-dev/wagmi-adapter

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
