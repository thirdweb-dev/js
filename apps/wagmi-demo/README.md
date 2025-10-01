# Thirdweb Wagmi Adapter

This is a demo of the [thirdweb Wagmi Adapter](https://github.com/thirdweb-dev/js/tree/main/packages/wagmi-adapter).

It demonstrates how to connect [in-app smart wallets](https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure) to a Wagmi app.

Users connect with google, and obtain a ERC-4337 smart account that can be used to interact with the app without paying for gas.

```ts
// src/wagmi.ts
export const config = createConfig({
  chains: [chain],
  connectors: [
    inAppWalletConnector({
      client,
      smartAccount: {
        chain: thirdwebChain(chain),
        sponsorGas: true,
      },
    }),
  ],
  transports: {
    [chain.id]: http(),
  },
});
```

## Prerequisites

Copy the `.env.example` file to `.env` and set your Thirdweb client ID. You can get your client ID from the [thirdweb dashboard](https://thirdweb.com).

## How to run

```bash
pnpm install
pnpm dev
```
