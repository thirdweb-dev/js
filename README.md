<p align="center">
    <br />
    <a href="https://thirdweb.com">
        <img src="https://thirdweb.com/brand/thirdweb-icon.svg" width="200" alt=""/></a>
    <br />
</p>

<h1 align="center"><a href='https://thirdweb.com/'>thirdweb</a> TypeScript SDK</h1>

<p align="center">
    <a href="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml">
        <img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml/badge.svg"/>
    </a>
</p>

<p align="center"><strong>All-in-one web3 SDK for Browser, Node and Mobile apps</strong></p>

## Core Package

#### [`thirdweb`](./packages/thirdweb/README.md)

The main SDK package providing all-in-one web3 functionality for Browser, Node, and Mobile applications.

```bash
npm install thirdweb
```

**Features:**

- Type-safe contract and transaction APIs
- In-app wallets with social/email login
- Account abstraction (ERC4337/EIP7702) support
- 500+ external wallets supported
- Built in infra (RPC, bundler, paymaster, indexer)
- React hooks and UI components
- Automatic ABI resolution
- IPFS upload/download
- Cross-platform support (Web, React Native)

### Documentation

Visit the [developer portal](https://portal.thirdweb.com) for full documentation.

### 🚀 Quick Start
> Tip: Make sure you are using Node.js v18+ and have `pnpm` installed for a smoother local development experience.


#### For React Applications

```bash
npm install thirdweb
```

```typescript
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

function App() {
  const account = useActiveAccount();
  console.log("Connected as", account?.address);

  return <ConnectButton client={client} />;
}
```

For React Native Applications, you'll also need to install the `@thirdweb-dev/react-native-adapter` package and import it at app startup for polyfills.

#### For Backend Applications

```bash
npm install thirdweb
```

```typescript
import { createThirdwebClient, Engine } from "thirdweb";

const client = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY",
});

const wallet = Engine.serverWallet({
  client,
  address: "0x...",
});

const transaction = transfer({
  contract: getContract({
    client,
    address: "0x...", // token contract
    chain: defineChain(1),
  }),
  to: "0x...", // recipient
  amount: "0.01", // amount in tokens
});

await wallet.enqueueTransaction({
  transaction,
});
```

## Adapters

#### [`@thirdweb-dev/react-native-adapter`](./packages/react-native-adapter/README.md)

Required polyfills and configuration for running the thirdweb SDK in React Native applications.

```bash
npm install @thirdweb-dev/react-native-adapter
```

#### [`@thirdweb-dev/wagmi-adapter`](./packages/wagmi-adapter/README.md)

Integration layer for using thirdweb's in-app wallets with wagmi.

```bash
npm install @thirdweb-dev/wagmi-adapter
```

## Type safe API wrappers

#### [`@thirdweb-dev/api`](./packages/api/README.md)

TypeScript SDK for thirdweb's API, combining all of thirdweb products.

```bash
npm install @thirdweb-dev/api
```

#### [`@thirdweb-dev/engine`](./packages/engine/README.md)

TypeScript SDK for Engine, thirdweb's backend onchain executor service.

```bash
npm install @thirdweb-dev/engine
```

#### [`@thirdweb-dev/insight`](./packages/insight/README.md)

TypeScript SDK for Insight, thirdweb's multichain indexer service.

```bash
npm install @thirdweb-dev/insight
```

#### [`@thirdweb-dev/vault-sdk`](./packages/vault-sdk/README.md)

SDK for interacting with Vault, thirdweb's secure key management service.

```bash
npm install @thirdweb-dev/vault-sdk
```

#### [`@thirdweb-dev/nebula`](./packages/nebula/README.md)

TypeScript SDK for Nebula, thirdweb's AI agent service.

```bash
npm install @thirdweb-dev/nebula
```

## Contributing

We welcome contributions from all developers regardless of experience level. If you are interested in contributing, please read our [Contributing Guide](.github/contributing.md) to learn how the repo works, how to test your changes, and how to submit a pull request.

See our [open source page](https://thirdweb.com/open-source) for more information on our open-source bounties and program.

## Additional Resources

- [Dashboard](https://thirdweb.com/login)
- [Documentation](https://portal.thirdweb.com/)
- [Templates](https://thirdweb.com/templates)
- [YouTube](https://www.youtube.com/c/thirdweb)
- [X/Twitter](https://x.com/thirdweb)
- [Telegram](https://t.me/officialthirdweb)

## Support

For help or feedback, please [visit our support site](https://thirdweb.com/support)

## Security

If you believe you have found a security vulnerability in any of our packages, we kindly ask you not to open a public issue; and to disclose this to us by emailing `security@thirdweb.com`.
