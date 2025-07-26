<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/legacy_packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb</h1>
<p align="center">
<a href="https://www.npmjs.com/package/thirdweb"><img src="https://img.shields.io/npm/v/thirdweb?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml/badge.svg"/></a>
</p>

## Description

The **thirdweb** SDK is a comprehensive web3 development toolkit that provides everything you need to build decentralized applications. It offers type-safe APIs for smart contract interactions, embedded wallets with social login, account abstraction support, React hooks and UI components, and cross-platform compatibility for web, React Native, and Node.js applications.

### Key Features

- **Type-safe APIs**: Fully typed contract and wallet interactions
- **Embedded Wallets**: Social login (Google, Facebook, etc.) and email authentication
- **Account Abstraction**: ERC-4337 smart accounts with gas sponsorship
- **React Integration**: Hooks and UI components for seamless frontend development  
- **React Native Support**: Cross-platform mobile app development
- **Automatic ABI Resolution**: Smart contract ABIs resolved automatically
- **IPFS Integration**: Built-in decentralized storage capabilities
- **Multi-chain Support**: Connect to any EVM-compatible blockchain
- **Auth System**: Sign-in with Ethereum (SIWE) support

## Installation

```bash
npm install thirdweb
```

### For TypeScript Projects
```bash
npm install thirdweb typescript
```

### For React Applications
```bash
npm install thirdweb react react-dom
```

### For React Native Applications
```bash
npm install thirdweb @thirdweb-dev/react-native-adapter
# Additional React Native dependencies required - see React Native Adapter docs
```

## Usage

### Basic Setup

#### 1. Create a Thirdweb Client

```typescript
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID", // Get from thirdweb.com/dashboard
});
```

#### 2. Connect to a Blockchain

```typescript
import { defineChain } from "thirdweb/chains";

// Use a built-in chain
import { ethereum, polygon } from "thirdweb/chains";

// Or define a custom chain
const customChain = defineChain({
  id: 1234,
  name: "My Custom Chain",
  rpc: "https://my-rpc-url.com",
});
```

### React Integration

#### ThirdwebProvider Setup

```tsx
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

function App() {
  return (
    <ThirdwebProvider>
      <YourApp />
    </ThirdwebProvider>
  );
}
```

#### Connect Wallet Button

```tsx
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("walletConnect"),
  createWallet("inApp", {
    auth: {
      options: ["email", "google", "apple", "facebook"],
    },
  }),
];

function MyComponent() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: "wide" }}
    />
  );
}
```

### Smart Contract Interactions

#### Reading from a Contract

```typescript
import { getContract } from "thirdweb";
import { readContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";

const contract = getContract({
  client,
  chain: ethereum,
  address: "0x...",
});

// Read with automatic ABI resolution
const result = await readContract({
  contract,
  method: "function balanceOf(address owner) view returns (uint256)",
  params: ["0x..."],
});
```

#### Writing to a Contract

```typescript
import { prepareContractCall, sendTransaction } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

// In a React component
function TransferButton() {
  const { mutate: sendTransaction } = useSendTransaction();

  const handleTransfer = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function transfer(address to, uint256 amount)",
      params: ["0x...", 100n],
    });

    sendTransaction(transaction);
  };

  return <button onClick={handleTransfer}>Transfer</button>;
}
```

### Embedded Wallets (In-App Wallets)

```typescript
import { createWallet } from "thirdweb/wallets";

const embeddedWallet = createWallet("inApp", {
  auth: {
    options: ["email", "google", "apple", "facebook"],
  },
});

// Connect with email
await embeddedWallet.connect({
  client,
  strategy: "email",
  email: "user@example.com",
});
```

### Account Abstraction (Smart Accounts)

```typescript
import { createWallet } from "thirdweb/wallets";

const smartWallet = createWallet("smart", {
  chain: ethereum,
  sponsorGas: true, // Enable gas sponsorship
});

const personalWallet = createWallet("inApp");
await personalWallet.connect({ client, strategy: "email", email: "user@example.com" });

await smartWallet.connect({
  client,
  personalWallet,
});
```

### Storage and IPFS

```typescript
import { upload, download } from "thirdweb/storage";

// Upload to IPFS
const file = new File(["content"], "example.txt");
const uri = await upload({
  client,
  files: [file],
});

// Download from IPFS
const response = await download({
  client,
  uri: "ipfs://...",
});
```

### Node.js Backend Usage

```typescript
import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

const client = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY", // Use secret key for backend
});

const account = privateKeyToAccount({
  client,
  privateKey: "0x...",
});

// Send transactions from backend
const transaction = prepareContractCall({
  contract,
  method: "function mint(address to, uint256 amount)",
  params: [account.address, 100n],
});

const result = await sendTransaction({
  transaction,
  account,
});
```

### CLI Usage

The thirdweb package also includes a CLI for project scaffolding and contract deployment:

```bash
# Create a new project
npx thirdweb create

# Deploy contracts
npx thirdweb deploy

# Generate contract bindings
npx thirdweb generate
```

## API Reference

### Core Functions

- `createThirdwebClient(options)` - Create a thirdweb client instance
- `getContract(options)` - Get a contract instance for interactions
- `readContract(options)` - Read data from a smart contract
- `prepareContractCall(options)` - Prepare a contract transaction
- `sendTransaction(options)` - Send a prepared transaction

### React Hooks

- `useActiveAccount()` - Get the currently connected account
- `useActiveWallet()` - Get the currently connected wallet
- `useReadContract(options)` - Read contract data with caching
- `useSendTransaction()` - Send transactions with loading states
- `useContractEvents(options)` - Listen to contract events

### React Components

- `<ConnectButton />` - Wallet connection button with modal
- `<TransactionButton />` - Button that executes transactions
- `<MediaRenderer />` - Render NFT media (images, videos, etc.)
- `<Web3Button />` - Button that requires wallet connection

### Wallet Types

- `"io.metamask"` - MetaMask wallet
- `"com.coinbase.wallet"` - Coinbase Wallet
- `"walletConnect"` - WalletConnect protocol
- `"inApp"` - Embedded wallet with social login
- `"smart"` - Smart account with account abstraction

## Examples

### Complete DApp Example

```tsx
import { ThirdwebProvider, ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";

const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });

const contract = getContract({
  client,
  chain: ethereum,
  address: "0x...",
});

function TokenBalance() {
  const account = useActiveAccount();
  const { data: balance } = useReadContract({
    contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: [account?.address!],
    queryOptions: { enabled: !!account },
  });

  return <div>Balance: {balance?.toString()}</div>;
}

function App() {
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} />
      <TokenBalance />
    </ThirdwebProvider>
  );
}
```

### NFT Minting Example

```tsx
import { prepareContractCall, sendTransaction } from "thirdweb";
import { upload } from "thirdweb/storage";

async function mintNFT() {
  // Upload metadata to IPFS
  const metadata = {
    name: "My NFT",
    description: "An awesome NFT",
    image: file, // File object
  };
  
  const uri = await upload({
    client,
    files: [metadata],
  });

  // Mint NFT
  const transaction = prepareContractCall({
    contract,
    method: "function mint(address to, string uri)",
    params: [account.address, uri],
  });

  await sendTransaction({ transaction, account });
}
```

## References

### Documentation
- [Main Documentation](https://portal.thirdweb.com/typescript/v5) - Complete SDK documentation
- [React Documentation](https://portal.thirdweb.com/typescript/v5/react) - React-specific guides
- [Getting Started Guide](https://portal.thirdweb.com/typescript/v5/getting-started) - Step-by-step setup
- [Migration Guide](https://portal.thirdweb.com/typescript/v5/migrate) - Upgrading from v4

### Examples and Templates
- [Starter Templates](https://thirdweb.com/templates) - Ready-to-use project templates
- [Next.js Starter](https://github.com/thirdweb-example/next-starter) - Next.js template
- [Vite Starter](https://github.com/thirdweb-example/vite-starter) - Vite template
- [Code Examples](https://github.com/thirdweb-example) - Example repositories

### Tools and Services
- [thirdweb Dashboard](https://thirdweb.com/dashboard) - Manage your projects and API keys
- [Contracts Hub](https://thirdweb.com/explore) - Pre-built smart contracts
- [Chain List](https://thirdweb.com/chainlist) - Supported blockchain networks

### Community and Support
- [Discord Community](https://discord.gg/thirdweb) - Join the community
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report bugs and feature requests
- [Support Center](https://thirdweb.com/support) - Get help and support
- [YouTube Channel](https://www.youtube.com/c/thirdweb) - Video tutorials and guides

### Additional Resources
- [Blog](https://blog.thirdweb.com/) - Latest news and tutorials
- [Twitter](https://twitter.com/thirdweb) - Follow for updates
- [Changelog](https://portal.thirdweb.com/changelog) - Latest features and fixes
