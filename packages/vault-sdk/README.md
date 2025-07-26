# Vault SDK

## Description

The **@thirdweb-dev/vault-sdk** package provides a TypeScript SDK for interacting with thirdweb's Vault service, a secure key management solution for web3 applications. Vault offers enterprise-grade security for managing private keys, signing transactions, and handling sensitive cryptographic operations without exposing private keys to your application code.

### Key Features

- **Secure Key Management**: Store and manage private keys in a secure, isolated environment
- **Multi-Signature Support**: Configure multi-signature wallets for enhanced security
- **Hardware Security Modules (HSM)**: Integration with hardware-based security modules
- **Key Derivation**: Hierarchical deterministic (HD) wallet support with BIP-32/BIP-44
- **Transaction Signing**: Sign transactions without exposing private keys
- **Access Control**: Role-based access control and permission management
- **Audit Logging**: Complete audit trail of all cryptographic operations
- **Cross-Platform**: Works in Node.js, browser, and React Native environments

## Installation

```bash
npm install @thirdweb-dev/vault-sdk
```

### Prerequisites

To use the Vault SDK, you need:

1. **Vault Service Access**: Access to a thirdweb Vault instance
2. **Authentication Credentials**: Valid JWT tokens or API keys
3. **Vault Configuration**: Properly configured vault policies and access permissions

## Usage

### Basic Setup

#### 1. Initialize Vault Client

```typescript
import { createVaultClient } from "@thirdweb-dev/vault-sdk";

const vaultClient = createVaultClient({
  vaultUrl: "https://vault.thirdweb.com", // Your Vault instance URL
  accessToken: "your-jwt-token", // JWT token for authentication
});
```

#### 2. Alternative Setup with API Key

```typescript
import { createVaultClient } from "@thirdweb-dev/vault-sdk";

const vaultClient = createVaultClient({
  vaultUrl: "https://vault.thirdweb.com",
  apiKey: "your-api-key",
  organizationId: "your-org-id",
});
```

### Key Management

#### Create New Wallet

```typescript
import { generateWallet } from "@thirdweb-dev/vault-sdk";

const wallet = await generateWallet(vaultClient, {
  name: "My Secure Wallet",
  description: "Primary wallet for production use",
  keyType: "secp256k1", // or "ed25519"
  metadata: {
    environment: "production",
    purpose: "primary-signer",
  },
});

console.log("Wallet created:", {
  id: wallet.id,
  address: wallet.address,
  publicKey: wallet.publicKey,
});
```

#### Import Existing Wallet

```typescript
import { importWallet } from "@thirdweb-dev/vault-sdk";

const importedWallet = await importWallet(vaultClient, {
  name: "Imported Wallet",
  privateKey: "0x...", // Private key to import
  encryptionKey: "your-encryption-key", // Optional additional encryption
});
```

#### List Wallets

```typescript
import { listWallets } from "@thirdweb-dev/vault-sdk";

const wallets = await listWallets(vaultClient, {
  limit: 50,
  offset: 0,
  filter: {
    keyType: "secp256k1",
    status: "active",
  },
});

console.log("Available wallets:", wallets);
```

### Transaction Signing

#### Sign Transaction

```typescript
import { signTransaction } from "@thirdweb-dev/vault-sdk";

const signature = await signTransaction(vaultClient, {
  walletId: "wallet-id-123",
  transaction: {
    to: "0x742d35Cc06C94a2E0b2dE76D63CB8d35e3Ae1B1a",
    value: "1000000000000000000", // 1 ETH in wei
    data: "0x", // Contract call data
    gasLimit: "21000",
    gasPrice: "20000000000", // 20 gwei
    nonce: 42,
    chainId: 1, // Ethereum mainnet
  },
  approvalType: "automatic", // or "manual" for multi-sig
});

console.log("Transaction signed:", signature);
```

#### Sign Message

```typescript
import { signMessage } from "@thirdweb-dev/vault-sdk";

const messageSignature = await signMessage(vaultClient, {
  walletId: "wallet-id-123",
  message: "Hello, Web3!",
  encoding: "utf8", // or "hex"
});

console.log("Message signature:", messageSignature);
```

#### Sign Typed Data (EIP-712)

```typescript
import { signTypedData } from "@thirdweb-dev/vault-sdk";

const typedDataSignature = await signTypedData(vaultClient, {
  walletId: "wallet-id-123",
  domain: {
    name: "MyDApp",
    version: "1",
    chainId: 1,
    verifyingContract: "0x...",
  },
  types: {
    Transfer: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  value: {
    from: "0x...",
    to: "0x...",
    amount: "1000000000000000000",
  },
});
```

### Multi-Signature Wallets

#### Create Multi-Sig Wallet

```typescript
import { createMultiSigWallet } from "@thirdweb-dev/vault-sdk";

const multiSigWallet = await createMultiSigWallet(vaultClient, {
  name: "Treasury Multi-Sig",
  signers: [
    { address: "0x...", weight: 1 },
    { address: "0x...", weight: 1 },
    { address: "0x...", weight: 2 }, // Higher weight for admin
  ],
  threshold: 2, // Require 2 signatures
  policy: {
    requireAllForHighValue: true,
    highValueThreshold: "10000000000000000000", // 10 ETH
  },
});
```

#### Submit Transaction for Approval

```typescript
import { submitTransactionProposal } from "@thirdweb-dev/vault-sdk";

const proposal = await submitTransactionProposal(vaultClient, {
  multiSigWalletId: "multisig-wallet-id",
  transaction: {
    to: "0x...",
    value: "5000000000000000000", // 5 ETH
    data: "0x",
  },
  description: "Treasury payout for Q4 operations",
  executionDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
});

console.log("Proposal submitted:", proposal.id);
```

#### Approve Transaction

```typescript
import { approveTransaction } from "@thirdweb-dev/vault-sdk";

await approveTransaction(vaultClient, {
  proposalId: "proposal-id-123",
  signature: "optional-signature-if-required",
  comment: "Approved for Q4 operations",
});
```

### HD Wallet Support

#### Create HD Wallet

```typescript
import { createHDWallet } from "@thirdweb-dev/vault-sdk";

const hdWallet = await createHDWallet(vaultClient, {
  name: "HD Master Wallet",
  entropy: "high", // Security level
  derivationPath: "m/44'/60'/0'/0", // Ethereum standard path
  seedPhraseBackup: {
    enabled: true,
    encryptionKey: "backup-encryption-key",
  },
});
```

#### Derive Child Wallet

```typescript
import { deriveChildWallet } from "@thirdweb-dev/vault-sdk";

const childWallet = await deriveChildWallet(vaultClient, {
  parentWalletId: "hd-master-wallet-id",
  derivationPath: "m/44'/60'/0'/0/5", // 6th account
  name: "User Account 5",
});
```

### Access Control and Policies

#### Create Access Policy

```typescript
import { createAccessPolicy } from "@thirdweb-dev/vault-sdk";

const policy = await createAccessPolicy(vaultClient, {
  name: "Production Signing Policy",
  rules: [
    {
      resource: "wallet:*",
      actions: ["read", "sign"],
      conditions: {
        ipAllowlist: ["192.168.1.0/24"],
        timeWindow: {
          start: "09:00",
          end: "17:00",
          timezone: "UTC",
        },
      },
    },
    {
      resource: "wallet:high-value-*",
      actions: ["sign"],
      conditions: {
        requireMultiApproval: true,
        maxTransactionValue: "1000000000000000000", // 1 ETH
      },
    },
  ],
});
```

#### Assign Policy to User

```typescript
import { assignPolicy } from "@thirdweb-dev/vault-sdk";

await assignPolicy(vaultClient, {
  userId: "user-123",
  policyId: policy.id,
  validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

### Audit and Monitoring

#### Get Audit Logs

```typescript
import { getAuditLogs } from "@thirdweb-dev/vault-sdk";

const auditLogs = await getAuditLogs(vaultClient, {
  startTime: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  endTime: Date.now(),
  walletId: "wallet-id-123", // Optional filter
  action: "sign", // Optional filter
  limit: 100,
});

console.log("Recent signing activities:", auditLogs);
```

#### Set Up Monitoring Alerts

```typescript
import { createAlert } from "@thirdweb-dev/vault-sdk";

const alert = await createAlert(vaultClient, {
  name: "High Value Transaction Alert",
  conditions: {
    transactionValue: {
      greaterThan: "5000000000000000000", // > 5 ETH
    },
    frequency: {
      threshold: 5,
      timeWindow: "1h", // 5 transactions in 1 hour
    },
  },
  notifications: [
    {
      type: "email",
      recipients: ["security@company.com"],
    },
    {
      type: "webhook",
      url: "https://api.company.com/vault-alerts",
    },
  ],
});
```

## Configuration Options

### Client Configuration

```typescript
import { createVaultClient } from "@thirdweb-dev/vault-sdk";

const client = createVaultClient({
  vaultUrl: "https://vault.thirdweb.com",
  accessToken: "jwt-token",
  
  // Optional configuration
  timeout: 30000, // Request timeout
  retries: 3, // Number of retries
  retryDelay: 1000, // Delay between retries
  
  // TLS configuration for self-hosted instances
  tls: {
    rejectUnauthorized: true,
    certificatePath: "/path/to/cert.pem",
  },
  
  // Logging configuration
  logging: {
    level: "info", // debug, info, warn, error
    redactSensitiveData: true,
  },
});
```

### Security Configuration

```typescript
const secureClient = createVaultClient({
  vaultUrl: "https://vault.thirdweb.com",
  accessToken: "jwt-token",
  
  // Enhanced security options
  security: {
    encryptionAtRest: true,
    encryptionInTransit: true,
    keyRotationInterval: "30d",
    sessionTimeout: "15m",
    
    // Hardware security module settings
    hsm: {
      enabled: true,
      provider: "aws-cloudhsm", // or "azure-keyvault"
      keyId: "hsm-key-id",
    },
  },
});
```

## API Reference

### Core Functions

- `createVaultClient(config)` - Initialize Vault client
- `generateWallet(client, options)` - Create new wallet
- `importWallet(client, options)` - Import existing wallet
- `listWallets(client, options)` - List available wallets
- `deleteWallet(client, walletId)` - Securely delete wallet

### Signing Functions

- `signTransaction(client, options)` - Sign blockchain transaction
- `signMessage(client, options)` - Sign arbitrary message
- `signTypedData(client, options)` - Sign EIP-712 typed data
- `batchSign(client, operations)` - Sign multiple operations atomically

### Multi-Signature Functions

- `createMultiSigWallet(client, options)` - Create multi-sig wallet
- `submitTransactionProposal(client, options)` - Submit transaction for approval
- `approveTransaction(client, options)` - Approve pending transaction
- `rejectTransaction(client, options)` - Reject pending transaction

### HD Wallet Functions

- `createHDWallet(client, options)` - Create HD master wallet
- `deriveChildWallet(client, options)` - Derive child wallet
- `getDerivationPath(client, walletId)` - Get wallet derivation path

### Access Control Functions

- `createAccessPolicy(client, policy)` - Create access policy
- `assignPolicy(client, assignment)` - Assign policy to user
- `revokePolicy(client, assignment)` - Revoke policy assignment

## Examples

### Enterprise Wallet Service

```typescript
import { 
  createVaultClient, 
  generateWallet, 
  signTransaction,
  createAccessPolicy 
} from "@thirdweb-dev/vault-sdk";

class EnterpriseWalletService {
  private vaultClient;

  constructor(vaultUrl: string, accessToken: string) {
    this.vaultClient = createVaultClient({
      vaultUrl,
      accessToken,
      security: {
        encryptionAtRest: true,
        sessionTimeout: "15m",
      },
    });
  }

  async createUserWallet(userId: string, userRole: string) {
    // Create wallet for user
    const wallet = await generateWallet(this.vaultClient, {
      name: `Wallet for ${userId}`,
      metadata: {
        userId,
        userRole,
        createdAt: new Date().toISOString(),
      },
    });

    // Create appropriate access policy
    const policy = await createAccessPolicy(this.vaultClient, {
      name: `${userRole} Policy for ${userId}`,
      rules: this.getPolicyRulesForRole(userRole),
    });

    // Assign policy to user
    await assignPolicy(this.vaultClient, {
      userId,
      policyId: policy.id,
    });

    return wallet;
  }

  async executeSecureTransaction(walletId: string, transaction: any) {
    try {
      const signature = await signTransaction(this.vaultClient, {
        walletId,
        transaction,
        approvalType: "automatic",
      });

      return {
        success: true,
        signature,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Transaction signing failed:", error);
      throw error;
    }
  }

  private getPolicyRulesForRole(role: string) {
    const baseRules = [
      {
        resource: "wallet:own",
        actions: ["read", "sign"],
        conditions: {
          maxTransactionValue: "1000000000000000000", // 1 ETH
        },
      },
    ];

    if (role === "admin") {
      baseRules.push({
        resource: "wallet:*",
        actions: ["read", "sign", "manage"],
        conditions: {
          requireMultiApproval: true,
        },
      });
    }

    return baseRules;
  }
}
```

### DeFi Integration with Multi-Sig

```typescript
import { 
  createMultiSigWallet,
  submitTransactionProposal,
  approveTransaction 
} from "@thirdweb-dev/vault-sdk";

class DeFiMultiSigManager {
  private vaultClient;
  private treasuryWalletId: string;

  constructor(vaultClient: any) {
    this.vaultClient = vaultClient;
  }

  async initializeTreasury() {
    const treasuryWallet = await createMultiSigWallet(this.vaultClient, {
      name: "DeFi Treasury",
      signers: [
        { address: "0x...", weight: 1, role: "cto" },
        { address: "0x...", weight: 1, role: "cfo" },
        { address: "0x...", weight: 2, role: "ceo" },
      ],
      threshold: 2,
      policy: {
        requireAllForHighValue: true,
        highValueThreshold: "50000000000000000000", // 50 ETH
        dailyLimit: "10000000000000000000", // 10 ETH per day
      },
    });

    this.treasuryWalletId = treasuryWallet.id;
    return treasuryWallet;
  }

  async proposeYieldFarmingInvestment(
    protocolAddress: string,
    amount: string,
    description: string
  ) {
    const proposal = await submitTransactionProposal(this.vaultClient, {
      multiSigWalletId: this.treasuryWalletId,
      transaction: {
        to: protocolAddress,
        value: "0",
        data: this.encodeStakeTransaction(amount),
      },
      description: `Yield farming investment: ${description}`,
      category: "defi-investment",
      riskLevel: "medium",
      executionDeadline: Date.now() + 48 * 60 * 60 * 1000, // 48 hours
    });

    return proposal;
  }

  private encodeStakeTransaction(amount: string): string {
    // Encode the staking transaction data
    // This would typically use a library like ethers.js
    return "0x..."; // Encoded transaction data
  }
}
```

## References

### Documentation
- [Vault Documentation](https://portal.thirdweb.com/vault) - Complete Vault guide
- [Key Management Best Practices](https://portal.thirdweb.com/vault/security) - Security guidelines
- [Multi-Signature Setup](https://portal.thirdweb.com/vault/multisig) - Multi-sig configuration

### Security Resources
- [Vault Security Model](https://portal.thirdweb.com/vault/security-model) - Understanding Vault's security architecture
- [Access Control Guide](https://portal.thirdweb.com/vault/access-control) - Setting up permissions and policies
- [Audit Logging](https://portal.thirdweb.com/vault/audit-logs) - Monitoring and compliance

### Integration Examples
- [Vault Examples](https://github.com/thirdweb-example/vault-examples) - Example implementations
- [Enterprise Integration](https://github.com/thirdweb-example/vault-enterprise) - Enterprise use cases
- [DeFi Integration](https://github.com/thirdweb-example/vault-defi) - DeFi protocol integration

### Advanced Topics
- [Hardware Security Modules](https://portal.thirdweb.com/vault/hsm) - HSM integration
- [Key Derivation](https://portal.thirdweb.com/vault/hd-wallets) - HD wallet implementation
- [Disaster Recovery](https://portal.thirdweb.com/vault/disaster-recovery) - Backup and recovery procedures

### API References
- [Vault API Reference](https://vault-api.thirdweb.com/docs) - Complete API documentation
- [Authentication Guide](https://portal.thirdweb.com/vault/authentication) - Authentication methods
- [Webhook Integration](https://portal.thirdweb.com/vault/webhooks) - Real-time notifications

### Community and Support
- [Discord #vault](https://discord.gg/thirdweb) - Vault specific help
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report Vault SDK issues
- [Security Disclosures](mailto:security@thirdweb.com) - Report security vulnerabilities
