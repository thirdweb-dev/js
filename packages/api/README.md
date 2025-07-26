# API SDK

## Description

The **@thirdweb-dev/api** package is a TypeScript SDK that provides access to thirdweb's comprehensive API services. This package serves as a unified interface to interact with various thirdweb backend services, including contract deployment, metadata management, account abstraction, authentication, and other web3 infrastructure services.

### Key Features

- **Contract Management**: Deploy, interact with, and manage smart contracts
- **Metadata Services**: Upload and manage NFT metadata and assets
- **Account Abstraction**: Create and manage smart accounts (ERC-4337)
- **Authentication**: Secure authentication and session management
- **Chain Information**: Access blockchain network data and configurations
- **Gas Estimation**: Get accurate gas estimates for transactions
- **Event Indexing**: Query blockchain events and transaction history
- **Type Safety**: Full TypeScript support with auto-generated types
- **Rate Limiting**: Built-in rate limiting and retry mechanisms
- **Error Handling**: Comprehensive error handling and debugging

## Installation

```bash
npm install @thirdweb-dev/api
```

### Prerequisites

To use the API SDK, you need:

1. **thirdweb Account**: A registered thirdweb account
2. **API Key**: Valid API key from the thirdweb dashboard
3. **Project Setup**: Configured project in the thirdweb dashboard

## Usage

### Basic Setup

#### 1. Configure API Client

```typescript
import { configure } from "@thirdweb-dev/api";

// Configure once at application startup
configure({
  secretKey: "YOUR_SECRET_KEY", // For server-side usage
  baseUrl: "https://api.thirdweb.com", // Optional: custom endpoint
  timeout: 30000, // Request timeout in ms
});
```

#### 2. Client-Side Configuration

```typescript
import { createAPIClient } from "@thirdweb-dev/api";

// For client-side applications
const apiClient = createAPIClient({
  clientId: "YOUR_CLIENT_ID",
  domain: "your-domain.com", // For CORS and authentication
});
```

### Contract Management

#### Deploy Contract

```typescript
import { deployContract } from "@thirdweb-dev/api";

const deployment = await deployContract({
  body: {
    contractType: "nft-collection", // or "nft-drop", "token", "marketplace", etc.
    metadata: {
      name: "My NFT Collection",
      symbol: "MNC",
      description: "A collection of unique digital art pieces",
      image: "ipfs://QmYourImageHash",
    },
    constructorParams: {
      name: "My NFT Collection",
      symbol: "MNC",
      royaltyRecipient: "0x...",
      royaltyBps: 500, // 5% royalty
    },
    chainId: 137, // Polygon
    deployerAddress: "0x...",
  },
});

console.log("Contract deployed:", {
  address: deployment.data.contractAddress,
  transactionHash: deployment.data.transactionHash,
  explorer: deployment.data.explorerUrl,
});
```

#### Get Contract Information

```typescript
import { getContract } from "@thirdweb-dev/api";

const contractInfo = await getContract({
  path: {
    chainId: "137",
    contractAddress: "0x1234567890123456789012345678901234567890",
  },
});

console.log("Contract info:", contractInfo.data);

// Example response:
// {
//   name: "My NFT Collection",
//   symbol: "MNC", 
//   contractType: "ERC721",
//   owner: "0x...",
//   totalSupply: "100",
//   metadata: {...}
// }
```

#### List User Contracts

```typescript
import { getUserContracts } from "@thirdweb-dev/api";

const contracts = await getUserContracts({
  query: {
    walletAddress: "0x...",
    chainId: 137,
    contractType: "nft-collection",
    limit: 50,
    offset: 0,
  },
});

console.log("User contracts:", contracts.data.result);
```

### Metadata Management

#### Upload to IPFS

```typescript
import { uploadToIPFS } from "@thirdweb-dev/api";

// Upload single file
const file = new File(["content"], "metadata.json", { type: "application/json" });
const singleUpload = await uploadToIPFS({
  body: {
    file: file,
    metadata: {
      name: "NFT Metadata",
      description: "Metadata for my NFT",
    },
  },
});

console.log("IPFS URL:", singleUpload.data.ipfsUrl);

// Upload multiple files
const files = [
  new File(["{}"], "1.json", { type: "application/json" }),
  new File(["{}"], "2.json", { type: "application/json" }),
];

const batchUpload = await uploadToIPFS({
  body: {
    files: files,
    options: {
      uploadWithGatewayUrl: true,
      uploadWithoutDirectory: false,
    },
  },
});

console.log("Batch upload:", batchUpload.data.baseUri);
```

#### Generate NFT Metadata

```typescript
import { generateNFTMetadata } from "@thirdweb-dev/api";

const metadata = await generateNFTMetadata({
  body: {
    name: "Epic Dragon NFT",
    description: "A legendary dragon with fire-breathing abilities",
    image: "ipfs://QmYourImageHash",
    attributes: [
      { trait_type: "Element", value: "Fire" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Power", value: "95" },
    ],
    animation_url: "ipfs://QmYourAnimationHash",
    external_url: "https://myproject.com/nft/1",
  },
});

console.log("Generated metadata:", metadata.data);
```

### Account Abstraction (Smart Accounts)

#### Create Smart Account

```typescript
import { createSmartAccount } from "@thirdweb-dev/api";

const smartAccount = await createSmartAccount({
  body: {
    chainId: 137,
    adminAddress: "0x...", // EOA that will control the smart account
    factoryAddress: "0x...", // Smart account factory address
    accountSalt: "unique-salt-string", // For deterministic addresses
    gasSponsorship: {
      enabled: true,
      sponsorAddress: "0x...",
      policy: "always", // or "conditional"
    },
  },
});

console.log("Smart account created:", {
  address: smartAccount.data.accountAddress,
  isDeployed: smartAccount.data.isDeployed,
});
```

#### Execute Smart Account Transaction

```typescript
import { executeSmartAccountTransaction } from "@thirdweb-dev/api";

const execution = await executeSmartAccountTransaction({
  body: {
    smartAccountAddress: "0x...",
    chainId: 137,
    transaction: {
      to: "0x...", // Target contract
      value: "0",
      data: "0x...", // Encoded function call
    },
    gasSponsorship: true,
    adminSignature: "0x...", // Signature from admin EOA
  },
});

console.log("Transaction executed:", {
  transactionHash: execution.data.transactionHash,
  gasUsed: execution.data.gasUsed,
  sponsored: execution.data.sponsored,
});
```

### Authentication Services

#### Generate Auth Token

```typescript
import { generateAuthToken } from "@thirdweb-dev/api";

const authToken = await generateAuthToken({
  body: {
    domain: "myapp.com",
    address: "0x...", // User's wallet address
    chainId: 1,
    expirationTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    resources: [
      "https://myapp.com/api/user",
      "https://myapp.com/api/nfts",
    ],
  },
});

console.log("Auth token:", authToken.data.token);
```

#### Verify Authentication

```typescript
import { verifyAuth } from "@thirdweb-dev/api";

const verification = await verifyAuth({
  body: {
    message: "Sign this message to authenticate",
    signature: "0x...", // User's signature
    address: "0x...", // User's wallet address
    chainId: 1,
  },
});

console.log("Auth verified:", verification.data.valid);
```

### Chain and Network Information

#### Get Chain Data

```typescript
import { getChainData } from "@thirdweb-dev/api";

const chainData = await getChainData({
  path: {
    chainId: "137", // Polygon
  },
});

console.log("Chain data:", chainData.data);

// Example response:
// {
//   chainId: 137,
//   name: "Polygon",
//   currency: "MATIC",
//   rpcUrls: ["https://polygon-rpc.com"],
//   blockExplorers: [{
//     name: "PolygonScan",
//     url: "https://polygonscan.com"
//   }],
//   nativeCurrency: {
//     name: "MATIC",
//     symbol: "MATIC",
//     decimals: 18
//   }
// }
```

#### Get Supported Chains

```typescript
import { getSupportedChains } from "@thirdweb-dev/api";

const chains = await getSupportedChains({
  query: {
    includeTestnets: false,
    includeL2s: true,
  },
});

console.log("Supported chains:", chains.data.chains);
```

### Gas Estimation

#### Estimate Transaction Gas

```typescript
import { estimateGas } from "@thirdweb-dev/api";

const gasEstimate = await estimateGas({
  body: {
    chainId: 1,
    from: "0x...",
    to: "0x...",
    value: "1000000000000000000", // 1 ETH
    data: "0x...", // Contract call data
  },
});

console.log("Gas estimate:", {
  gasLimit: gasEstimate.data.gasLimit,
  gasPrice: gasEstimate.data.gasPrice,
  estimatedCost: gasEstimate.data.estimatedCost,
});
```

#### Get Current Gas Prices

```typescript
import { getGasPrices } from "@thirdweb-dev/api";

const gasPrices = await getGasPrices({
  path: {
    chainId: "1",
  },
});

console.log("Gas prices:", {
  standard: gasPrices.data.standard,
  fast: gasPrices.data.fast,
  fastest: gasPrices.data.fastest,
});
```

### Event Indexing and Queries

#### Query Contract Events

```typescript
import { getContractEvents } from "@thirdweb-dev/api";

const events = await getContractEvents({
  path: {
    chainId: "137",
    contractAddress: "0x...",
  },
  query: {
    eventName: "Transfer", // Optional: filter by event name
    fromBlock: 18000000,
    toBlock: "latest",
    limit: 100,
    offset: 0,
  },
});

console.log("Contract events:", events.data.events);
```

#### Get Transaction History

```typescript
import { getTransactionHistory } from "@thirdweb-dev/api";

const history = await getTransactionHistory({
  query: {
    walletAddress: "0x...",
    chainId: 137,
    contractAddress: "0x...", // Optional: filter by contract
    limit: 50,
    offset: 0,
  },
});

console.log("Transaction history:", history.data.transactions);
```

### Advanced Features

#### Batch API Requests

```typescript
import { batchRequests } from "@thirdweb-dev/api";

const batchResults = await batchRequests({
  body: {
    requests: [
      {
        method: "GET",
        path: "/contract/137/0x.../metadata",
      },
      {
        method: "GET", 
        path: "/contract/137/0x.../events",
        query: { limit: 10 },
      },
      {
        method: "POST",
        path: "/gas/estimate",
        body: {
          chainId: 137,
          to: "0x...",
          data: "0x...",
        },
      },
    ],
  },
});

console.log("Batch results:", batchResults.data.results);
```

#### Webhook Management

```typescript
import { createWebhook, listWebhooks } from "@thirdweb-dev/api";

// Create webhook
const webhook = await createWebhook({
  body: {
    name: "Contract Events Webhook",
    url: "https://myapp.com/webhooks/contract-events",
    eventTypes: ["contract.deployed", "nft.minted", "transaction.completed"],
    filters: {
      chainIds: [1, 137],
      contractAddresses: ["0x..."],
    },
    active: true,
  },
});

// List webhooks
const webhooks = await listWebhooks({
  query: {
    active: true,
    limit: 50,
  },
});

console.log("Active webhooks:", webhooks.data.webhooks);
```

## Configuration Options

### Client Configuration

```typescript
import { configure } from "@thirdweb-dev/api";

configure({
  secretKey: "your-secret-key", // Server-side only
  clientId: "your-client-id", // Client-side only
  baseUrl: "https://api.thirdweb.com",
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  
  // Rate limiting
  rateLimit: {
    requestsPerSecond: 10,
    burstLimit: 50,
  },
  
  // Error handling
  errorHandling: {
    throwOnError: true,
    logErrors: true,
    maxRetries: 3,
  },
  
  // Caching
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 1000, // Max cached items
  },
});
```

### Request Configuration

```typescript
const requestConfig = {
  // Headers
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "MyApp/1.0.0",
    "X-Client-Version": "5.0.0",
  },
  
  // Authentication
  auth: {
    type: "bearer", // or "api-key"
    token: "your-token",
  },
  
  // Pagination
  pagination: {
    defaultLimit: 50,
    maxLimit: 1000,
  },
  
  // Filtering
  filtering: {
    caseSensitive: false,
    allowRegex: false,
  },
};
```

## API Reference

### Core Functions

- `configure(options)` - Configure the API client
- `createAPIClient(options)` - Create client instance for frontend use
- `batchRequests(requests)` - Execute multiple API requests in batch

### Contract Functions

- `deployContract(options)` - Deploy new smart contract
- `getContract(chainId, address)` - Get contract information
- `getUserContracts(options)` - List user's deployed contracts
- `updateContract(options)` - Update contract metadata

### Metadata Functions

- `uploadToIPFS(options)` - Upload files to IPFS
- `generateNFTMetadata(options)` - Generate NFT metadata
- `getMetadata(uri)` - Retrieve metadata from URI
- `pinToIPFS(hash)` - Pin content to IPFS

### Account Abstraction Functions

- `createSmartAccount(options)` - Create new smart account
- `executeSmartAccountTransaction(options)` - Execute transaction via smart account
- `getSmartAccountInfo(address)` - Get smart account information
- `sponsorTransaction(options)` - Sponsor transaction gas fees

### Authentication Functions

- `generateAuthToken(options)` - Generate authentication token
- `verifyAuth(options)` - Verify authentication signature
- `refreshToken(token)` - Refresh expired token
- `revokeToken(token)` - Revoke authentication token

### Chain Functions

- `getChainData(chainId)` - Get blockchain network information
- `getSupportedChains(options)` - List supported chains
- `getBlockData(chainId, blockNumber)` - Get block information

### Gas Functions

- `estimateGas(options)` - Estimate transaction gas cost
- `getGasPrices(chainId)` - Get current gas prices
- `optimizeGas(options)` - Get gas optimization suggestions

### Event Functions

- `getContractEvents(options)` - Query contract events
- `getTransactionHistory(options)` - Get wallet transaction history
- `subscribeToEvents(options)` - Subscribe to real-time events

## Examples

### Complete Contract Deployment Service

```typescript
import { 
  deployContract, 
  uploadToIPFS, 
  getContract,
  createSmartAccount 
} from "@thirdweb-dev/api";

class ContractDeploymentService {
  constructor(private secretKey: string) {
    configure({ secretKey });
  }

  async deployNFTCollection(params: {
    name: string;
    symbol: string;
    description: string;
    image: File;
    ownerAddress: string;
    chainId: number;
    royaltyBps: number;
  }) {
    try {
      // Upload image to IPFS
      const imageUpload = await uploadToIPFS({
        body: { file: params.image },
      });

      // Deploy contract
      const deployment = await deployContract({
        body: {
          contractType: "nft-collection",
          metadata: {
            name: params.name,
            symbol: params.symbol,
            description: params.description,
            image: imageUpload.data.ipfsUrl,
          },
          constructorParams: {
            name: params.name,
            symbol: params.symbol,
            royaltyRecipient: params.ownerAddress,
            royaltyBps: params.royaltyBps,
          },
          chainId: params.chainId,
          deployerAddress: params.ownerAddress,
        },
      });

      // Wait for deployment confirmation
      await this.waitForDeployment(
        params.chainId,
        deployment.data.transactionHash
      );

      // Get deployed contract info
      const contractInfo = await getContract({
        path: {
          chainId: params.chainId.toString(),
          contractAddress: deployment.data.contractAddress,
        },
      });

      return {
        success: true,
        contract: {
          address: deployment.data.contractAddress,
          transactionHash: deployment.data.transactionHash,
          explorerUrl: deployment.data.explorerUrl,
          metadata: contractInfo.data,
        },
      };
    } catch (error) {
      console.error("Deployment failed:", error);
      throw error;
    }
  }

  async createManagedAccount(adminAddress: string, chainId: number) {
    // Create smart account for managed operations
    const smartAccount = await createSmartAccount({
      body: {
        chainId,
        adminAddress,
        gasSponsorship: {
          enabled: true,
          sponsorAddress: adminAddress,
          policy: "conditional",
        },
      },
    });

    return smartAccount.data;
  }

  private async waitForDeployment(chainId: number, txHash: string) {
    // Implementation to wait for transaction confirmation
    // This would poll the transaction status until confirmed
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        const receipt = await this.getTransactionReceipt(chainId, txHash);
        if (receipt.status === "success") {
          return receipt;
        }
      } catch (error) {
        // Transaction might not be indexed yet
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error("Deployment confirmation timeout");
  }

  private async getTransactionReceipt(chainId: number, txHash: string) {
    // Implementation to get transaction receipt
    // This would use the transaction history API
    return { status: "success" }; // Placeholder
  }
}

// Usage
const deploymentService = new ContractDeploymentService("your-secret-key");

const result = await deploymentService.deployNFTCollection({
  name: "My Art Collection",
  symbol: "ART",
  description: "A curated collection of digital art",
  image: imageFile,
  ownerAddress: "0x...",
  chainId: 137,
  royaltyBps: 500, // 5%
});

console.log("Deployment result:", result);
```

### Multi-Chain Event Monitor

```typescript
import { 
  getContractEvents, 
  createWebhook, 
  getSupportedChains 
} from "@thirdweb-dev/api";

class EventMonitor {
  private webhooks: Map<string, any> = new Map();

  async monitorContract(
    contractAddress: string,
    eventNames: string[],
    chainIds: number[]
  ) {
    for (const chainId of chainIds) {
      // Create webhook for each chain
      const webhook = await createWebhook({
        body: {
          name: `Contract Events - Chain ${chainId}`,
          url: `https://myapp.com/webhooks/events`,
          eventTypes: ["contract.event"],
          filters: {
            chainIds: [chainId],
            contractAddresses: [contractAddress],
            eventNames,
          },
          active: true,
        },
      });

      this.webhooks.set(`${chainId}-${contractAddress}`, webhook.data);

      // Get historical events
      const historicalEvents = await getContractEvents({
        path: {
          chainId: chainId.toString(),
          contractAddress,
        },
        query: {
          fromBlock: "earliest",
          limit: 1000,
        },
      });

      console.log(
        `Historical events for chain ${chainId}:`,
        historicalEvents.data.events.length
      );
    }
  }

  async getEventsSummary(contractAddress: string, chainIds: number[]) {
    const summaries = await Promise.all(
      chainIds.map(async (chainId) => {
        const events = await getContractEvents({
          path: {
            chainId: chainId.toString(),
            contractAddress,
          },
          query: {
            fromBlock: "earliest",
            limit: 10000,
          },
        });

        return {
          chainId,
          totalEvents: events.data.events.length,
          eventTypes: this.aggregateEventTypes(events.data.events),
        };
      })
    );

    return summaries;
  }

  private aggregateEventTypes(events: any[]) {
    const types = new Map<string, number>();
    
    events.forEach(event => {
      const count = types.get(event.eventName) || 0;
      types.set(event.eventName, count + 1);
    });

    return Object.fromEntries(types);
  }

  async cleanup() {
    // Remove all webhooks
    for (const [key, webhook] of this.webhooks) {
      try {
        await this.deleteWebhook(webhook.id);
        console.log(`Removed webhook for ${key}`);
      } catch (error) {
        console.error(`Failed to remove webhook for ${key}:`, error);
      }
    }
    
    this.webhooks.clear();
  }

  private async deleteWebhook(webhookId: string) {
    // Implementation to delete webhook
    // This would use the webhook deletion API
  }
}

// Usage
const monitor = new EventMonitor();

await monitor.monitorContract(
  "0x1234567890123456789012345678901234567890",
  ["Transfer", "Mint", "Burn"],
  [1, 137, 42161] // Ethereum, Polygon, Arbitrum
);

const summary = await monitor.getEventsSummary(
  "0x1234567890123456789012345678901234567890",
  [1, 137, 42161]
);

console.log("Events summary:", summary);
```

## References

### Documentation
- [API Documentation](https://portal.thirdweb.com/api) - Complete API guide
- [Authentication Guide](https://portal.thirdweb.com/api/auth) - API authentication methods
- [Rate Limits](https://portal.thirdweb.com/api/rate-limits) - API usage limits and optimization

### API Endpoints
- [Contract API](https://portal.thirdweb.com/api/contracts) - Contract deployment and management
- [Metadata API](https://portal.thirdweb.com/api/metadata) - IPFS and metadata services
- [Smart Accounts API](https://portal.thirdweb.com/api/smart-accounts) - Account abstraction services
- [Events API](https://portal.thirdweb.com/api/events) - Blockchain event indexing

### Integration Examples
- [API Examples](https://github.com/thirdweb-example/api-examples) - Example implementations
- [Backend Integration](https://github.com/thirdweb-example/api-backend) - Server-side API usage
- [Frontend Integration](https://github.com/thirdweb-example/api-frontend) - Client-side API usage

### Advanced Topics
- [Webhooks Guide](https://portal.thirdweb.com/api/webhooks) - Real-time event notifications
- [Batch Processing](https://portal.thirdweb.com/api/batch) - Efficient bulk operations
- [Caching Strategies](https://portal.thirdweb.com/api/caching) - Optimizing API performance

### OpenAPI Integration
- [OpenAPI Specification](https://api.thirdweb.com/openapi.json) - Complete API specification
- [Postman Collection](https://portal.thirdweb.com/api/postman) - Ready-to-use API collection
- [API Testing](https://portal.thirdweb.com/api/testing) - Testing strategies and tools

### Community and Support
- [Discord #api](https://discord.gg/thirdweb) - API specific help and discussions
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report API SDK issues
- [API Status](https://status.thirdweb.com/api) - API service status and uptime
