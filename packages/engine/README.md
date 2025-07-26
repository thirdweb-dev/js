# Engine SDK

## Description

The **@thirdweb-dev/engine** package is a TypeScript SDK that provides a type-safe wrapper around thirdweb's Engine API. Engine is a high-performance backend service for executing blockchain transactions at scale, handling wallet management, transaction queuing, and gas optimization. This SDK enables developers to integrate Engine's powerful backend capabilities into their applications with full TypeScript support and automatic OpenAPI-generated client methods.

### Key Features

- **Backend Transaction Execution**: Execute blockchain transactions from your backend without private key exposure
- **Wallet Management**: Create and manage wallets securely in Engine's hosted environment  
- **Transaction Queuing**: Handle high-volume transaction processing with automatic queuing and retry logic
- **Gas Optimization**: Automatic gas price optimization and transaction acceleration
- **Multi-chain Support**: Execute transactions across all supported EVM-compatible networks
- **Type Safety**: Full TypeScript support with auto-generated types from OpenAPI spec
- **Auto-retry Logic**: Built-in retry mechanisms for failed transactions
- **Webhook Integration**: Real-time transaction status updates via webhooks

## Installation

```bash
npm install @thirdweb-dev/engine
```

### Prerequisites

Before using the Engine SDK, you need:

1. **Engine Instance**: Access to a running thirdweb Engine instance
2. **API Keys**: Valid API keys for authentication
3. **Backend Wallets**: Configured backend wallets in Engine for transaction signing

## Usage

### Basic Setup

#### 1. Configure the Engine Client

```typescript
import { configure } from "@thirdweb-dev/engine";

// Configure once at application startup
configure({
  baseUrl: "https://your-engine-instance.com", // Your Engine URL
  secretKey: "YOUR_SECRET_KEY", // Your secret key
});
```

#### 2. Alternative Configuration with thirdweb Client

```typescript
import { configureWithClient } from "@thirdweb-dev/engine";
import { createThirdwebClient } from "thirdweb";

const thirdwebClient = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY",
});

configureWithClient(thirdwebClient);
```

### Contract Interactions

#### Writing to Contracts

```typescript
import { writeContract } from "@thirdweb-dev/engine";

const result = await writeContract({
  headers: {
    "x-backend-wallet-address": "0x...", // Backend wallet address
    "x-account-address": "0x...", // Optional: smart account address
  },
  body: {
    chain: "ethereum",
    contractAddress: "0x1234567890123456789012345678901234567890",
    functionName: "transfer",
    args: [
      "0x742d35Cc06C94a2E0b2dE76D63CB8d35e3Ae1B1a", // to
      "1000000000000000000", // amount (1 ETH in wei)
    ],
    txOverrides: {
      gas: "21000",
      gasPrice: "20000000000", // 20 gwei
    },
  },
});

console.log("Transaction queued:", result.data.queueId);
```

#### Reading from Contracts

```typescript
import { readContract } from "@thirdweb-dev/engine";

const balance = await readContract({
  body: {
    chain: "polygon",
    contractAddress: "0xA0b86a33E6441e13C7C95C5D6b55b7cE06eB6a9D", // USDC
    functionName: "balanceOf",
    args: ["0x742d35Cc06C94a2E0b2dE76D63CB8d35e3Ae1B1a"],
  },
});

console.log("USDC Balance:", balance.data.result);
```

### Wallet Management

#### Create Backend Wallet

```typescript
import { createBackendWallet } from "@thirdweb-dev/engine";

const wallet = await createBackendWallet({
  body: {
    type: "local", // or "aws-kms", "gcp-kms"
    label: "My Backend Wallet",
  },
});

console.log("Created wallet:", wallet.data.walletAddress);
```

#### Import Existing Wallet

```typescript
import { importBackendWallet } from "@thirdweb-dev/engine";

const importedWallet = await importBackendWallet({
  body: {
    type: "local",
    privateKey: "0x...", // Your private key
    label: "Imported Wallet",
  },
});
```

#### List Backend Wallets

```typescript
import { getBackendWallets } from "@thirdweb-dev/engine";

const wallets = await getBackendWallets();
console.log("Available wallets:", wallets.data.result);
```

### Transaction Management

#### Get Transaction Status

```typescript
import { getTransaction } from "@thirdweb-dev/engine";

const transaction = await getTransaction({
  path: {
    queueId: "your-queue-id",
  },
});

console.log("Transaction status:", transaction.data.status);
console.log("Transaction hash:", transaction.data.transactionHash);
```

#### List All Transactions

```typescript
import { getTransactions } from "@thirdweb-dev/engine";

const transactions = await getTransactions({
  query: {
    page: 1,
    limit: 50,
    status: "completed", // or "queued", "sent", "failed"
  },
});

console.log("Transactions:", transactions.data.result);
```

#### Cancel Transaction

```typescript
import { cancelTransaction } from "@thirdweb-dev/engine";

await cancelTransaction({
  path: {
    queueId: "your-queue-id",
  },
});
```

### Smart Contract Deployment

#### Deploy Contract

```typescript
import { deployContract } from "@thirdweb-dev/engine";

const deployment = await deployContract({
  headers: {
    "x-backend-wallet-address": "0x...",
  },
  body: {
    chain: "polygon",
    contractType: "erc721", // or custom contract
    contractMetadata: {
      name: "My NFT Collection",
      symbol: "MNC",
      description: "A sample NFT collection",
    },
    constructorParams: [], // Constructor parameters
  },
});

console.log("Contract deployed:", deployment.data.contractAddress);
```

### Advanced Features

#### Batch Transactions

```typescript
import { batchWriteContract } from "@thirdweb-dev/engine";

const batchResult = await batchWriteContract({
  headers: {
    "x-backend-wallet-address": "0x...",
  },
  body: {
    chain: "polygon",
    transactions: [
      {
        contractAddress: "0x...",
        functionName: "mint",
        args: ["0x...", "1"],
      },
      {
        contractAddress: "0x...",
        functionName: "mint", 
        args: ["0x...", "2"],
      },
    ],
  },
});
```

#### Smart Account Operations

```typescript
import { createSmartAccount, executeSmartAccountTransaction } from "@thirdweb-dev/engine";

// Create smart account
const smartAccount = await createSmartAccount({
  headers: {
    "x-backend-wallet-address": "0x...", // Admin wallet
  },
  body: {
    chain: "polygon",
    adminAddress: "0x...",
    factoryAddress: "0x...", // Smart account factory
  },
});

// Execute transaction via smart account
const txResult = await executeSmartAccountTransaction({
  headers: {
    "x-backend-wallet-address": "0x...",
    "x-account-address": smartAccount.data.smartAccountAddress,
  },
  body: {
    chain: "polygon",
    contractAddress: "0x...",
    functionName: "mint",
    args: ["0x...", "1"],
  },
});
```

### Webhooks Integration

#### Configure Webhooks

```typescript
import { createWebhook } from "@thirdweb-dev/engine";

const webhook = await createWebhook({
  body: {
    url: "https://your-app.com/webhooks/engine",
    name: "Transaction Updates",
    eventType: "transaction_status_update",
  },
});
```

#### Handle Webhook Events

```javascript
// Express.js webhook handler example
app.post('/webhooks/engine', (req, res) => {
  const { queueId, status, transactionHash, errorMessage } = req.body;
  
  switch (status) {
    case 'completed':
      console.log(`Transaction ${queueId} completed: ${transactionHash}`);
      // Update your database, notify users, etc.
      break;
    case 'failed':
      console.log(`Transaction ${queueId} failed: ${errorMessage}`);
      // Handle failed transaction
      break;
    case 'queued':
      console.log(`Transaction ${queueId} queued`);
      break;
  }
  
  res.status(200).send('OK');
});
```

## Configuration Options

### Client Configuration

```typescript
import { configure } from "@thirdweb-dev/engine";

configure({
  baseUrl: "https://engine.example.com",
  secretKey: "your-secret-key",
  timeout: 30000, // Request timeout in ms
  retries: 3, // Number of retries for failed requests
});
```

### Request Headers

Common headers used with Engine requests:

```typescript
const headers = {
  "x-backend-wallet-address": "0x...", // Required: Backend wallet for signing
  "x-account-address": "0x...", // Optional: Smart account address
  "x-account-factory-address": "0x...", // Optional: Smart account factory
  "x-account-salt": "unique-salt", // Optional: Deterministic smart account
  "x-idempotency-key": "unique-key", // Optional: Prevent duplicate transactions
};
```

## API Reference

### Core Functions

- `configure(options)` - Configure the Engine client
- `writeContract(options)` - Execute write operations on smart contracts
- `readContract(options)` - Read data from smart contracts
- `deployContract(options)` - Deploy new smart contracts
- `getTransaction(options)` - Get transaction status and details

### Wallet Management

- `createBackendWallet(options)` - Create new backend wallet
- `importBackendWallet(options)` - Import existing wallet
- `getBackendWallets()` - List all backend wallets
- `getWalletBalance(options)` - Get wallet token balances

### Transaction Management

- `getTransactions(options)` - List transactions with filtering
- `cancelTransaction(options)` - Cancel queued transaction
- `retryTransaction(options)` - Retry failed transaction

### Smart Accounts

- `createSmartAccount(options)` - Create new smart account
- `getSmartAccounts()` - List smart accounts
- `executeSmartAccountTransaction(options)` - Execute via smart account

## Examples

### NFT Minting Service

```typescript
import { writeContract, getTransaction } from "@thirdweb-dev/engine";

class NFTMintingService {
  private backendWallet = "0x..."; // Your backend wallet address
  private nftContract = "0x..."; // Your NFT contract address

  async mintNFT(recipientAddress: string, tokenId: string) {
    try {
      // Queue mint transaction
      const result = await writeContract({
        headers: {
          "x-backend-wallet-address": this.backendWallet,
          "x-idempotency-key": `mint-${recipientAddress}-${tokenId}`,
        },
        body: {
          chain: "polygon",
          contractAddress: this.nftContract,
          functionName: "mint",
          args: [recipientAddress, tokenId],
        },
      });

      const queueId = result.data.queueId;
      
      // Poll for completion
      return await this.waitForCompletion(queueId);
    } catch (error) {
      console.error("Minting failed:", error);
      throw error;
    }
  }

  private async waitForCompletion(queueId: string) {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const transaction = await getTransaction({
        path: { queueId },
      });

      if (transaction.data.status === "completed") {
        return {
          success: true,
          transactionHash: transaction.data.transactionHash,
        };
      }

      if (transaction.data.status === "failed") {
        throw new Error(transaction.data.errorMessage);
      }

      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error("Transaction timeout");
  }
}

// Usage
const mintingService = new NFTMintingService();
const result = await mintingService.mintNFT("0x...", "123");
```

### Multi-Chain Token Transfer

```typescript
import { writeContract, getBackendWallets } from "@thirdweb-dev/engine";

class MultiChainTransferService {
  async transferTokensAcrossChains(
    fromChain: string,
    toChain: string,
    tokenAddress: string,
    amount: string,
    recipient: string
  ) {
    const wallets = await getBackendWallets();
    const wallet = wallets.data.result[0].walletAddress;

    // Transfer from source chain
    const transferResult = await writeContract({
      headers: {
        "x-backend-wallet-address": wallet,
      },
      body: {
        chain: fromChain,
        contractAddress: tokenAddress,
        functionName: "transfer",
        args: [recipient, amount],
      },
    });

    return transferResult.data.queueId;
  }
}
```

## References

### Documentation
- [Engine Documentation](https://portal.thirdweb.com/engine) - Complete Engine guide
- [Engine API Reference](https://engine.thirdweb.com/reference) - Full API documentation  
- [Engine Setup Guide](https://portal.thirdweb.com/engine/get-started) - Getting started with Engine

### Advanced Features
- [Webhooks Guide](https://portal.thirdweb.com/engine/features/webhooks) - Setting up webhooks
- [Smart Accounts](https://portal.thirdweb.com/engine/features/smart-accounts) - Account abstraction with Engine
- [Gas Optimization](https://portal.thirdweb.com/engine/features/gas-optimization) - Gas price management

### Infrastructure
- [Self-Hosting Engine](https://portal.thirdweb.com/engine/self-host) - Deploy your own Engine instance
- [Cloud Engine](https://portal.thirdweb.com/engine/cloud) - Managed Engine service
- [Security Best Practices](https://portal.thirdweb.com/engine/security) - Securing your Engine deployment

### Examples and Templates
- [Engine Examples](https://github.com/thirdweb-example/engine-examples) - Example implementations
- [Backend Integration](https://github.com/thirdweb-example/engine-backend) - Backend service examples
- [Webhook Handlers](https://github.com/thirdweb-example/engine-webhooks) - Webhook implementation examples

### OpenAPI Integration
- [OpenAPI Specification](https://engine.thirdweb.com/json) - Raw OpenAPI spec
- [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts) - Code generation tool used

### Community and Support
- [Discord #engine](https://discord.gg/thirdweb) - Engine specific help
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report Engine SDK issues
- [Engine Status](https://status.thirdweb.com/) - Service status and uptime
