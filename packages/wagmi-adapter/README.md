# Wagmi Adapter

## Description

The **@thirdweb-dev/wagmi-adapter** package provides a seamless integration layer that enables you to use thirdweb's powerful in-app wallets and smart account features within the wagmi ecosystem. This adapter allows developers to leverage thirdweb's embedded wallets, social login capabilities, and account abstraction while maintaining compatibility with the extensive wagmi tooling and ecosystem.

### Key Features

- **Wagmi Integration**: Use thirdweb wallets as wagmi connectors
- **In-App Wallets**: Social login (Google, Facebook, Apple) and email authentication in wagmi apps
- **Smart Accounts**: Account abstraction (ERC-4337) support with gas sponsorship
- **Type Safety**: Full TypeScript support with wagmi's type system
- **Ecosystem Compatibility**: Works with all wagmi-compatible tools and libraries
- **Seamless Migration**: Easy integration into existing wagmi applications

## Installation

```bash
npm install @thirdweb-dev/wagmi-adapter @wagmi/core thirdweb
```

### Peer Dependencies

The wagmi adapter requires these peer dependencies:

```bash
npm install @wagmi/core@^2.16.0 thirdweb@^5.85.0
```

For React applications, also install:

```bash
npm install wagmi @tanstack/react-query
```

## Usage

### Basic Setup

#### 1. Configure Wagmi with Thirdweb Wallets

```typescript
import { createConfig, http } from '@wagmi/core'
import { mainnet, polygon } from '@wagmi/core/chains'
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'

// Create thirdweb client
import { createThirdwebClient } from 'thirdweb'

const thirdwebClient = createThirdwebClient({
  clientId: 'YOUR_CLIENT_ID',
})

// Configure wagmi with thirdweb wallets
const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    // Add thirdweb in-app wallet as wagmi connector
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'inApp',
      auth: {
        options: ['email', 'google', 'apple', 'facebook'],
      },
    }),
    // Add smart wallet connector
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'smart',
      sponsorGas: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
})
```

#### 2. React Integration

```tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi-config'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Wallet Connection Examples

#### In-App Wallet with Social Login

```typescript
import { connect } from '@wagmi/core'
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'

const inAppConnector = thirdwebWalletConnect({
  client: thirdwebClient,
  walletId: 'inApp',
  auth: {
    options: ['email', 'google', 'apple', 'facebook'],
  },
})

// Connect with email
await connect(config, {
  connector: inAppConnector,
  authOptions: {
    strategy: 'email',
    email: 'user@example.com',
  },
})

// Connect with Google
await connect(config, {
  connector: inAppConnector,
  authOptions: {
    strategy: 'google',
  },
})
```

#### Smart Account Setup

```typescript
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'

const smartAccountConnector = thirdwebWalletConnect({
  client: thirdwebClient,
  walletId: 'smart',
  sponsorGas: true, // Enable gas sponsorship
  factoryAddress: '0x...', // Optional: custom factory
  accountSalt: 'unique-salt', // Optional: deterministic addresses
})

await connect(config, {
  connector: smartAccountConnector,
  personalWallet: inAppConnector, // Use in-app wallet as signer
})
```

### React Hooks Usage

#### Connection Management

```tsx
import { useConnect, useDisconnect, useAccount } from 'wagmi'

function WalletConnection() {
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  const thirdwebConnectors = connectors.filter(
    connector => connector.id.startsWith('thirdweb')
  )

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <div>
          {thirdwebConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

#### Contract Interactions

```tsx
import { useReadContract, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'

const contractConfig = {
  address: '0x...',
  abi: [
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
    {
      name: 'transfer',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
  ],
} as const

function TokenInteraction() {
  const { address } = useAccount()
  
  const { data: balance } = useReadContract({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })

  const { writeContract, isPending } = useWriteContract()

  const handleTransfer = () => {
    writeContract({
      ...contractConfig,
      functionName: 'transfer',
      args: ['0x...', parseEther('1')],
    })
  }

  return (
    <div>
      <p>Balance: {balance?.toString()}</p>
      <button 
        onClick={handleTransfer}
        disabled={isPending}
      >
        {isPending ? 'Transferring...' : 'Transfer'}
      </button>
    </div>
  )
}
```

### Advanced Configuration

#### Custom Connector Configuration

```typescript
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'

const customConnector = thirdwebWalletConnect({
  client: thirdwebClient,
  walletId: 'inApp',
  auth: {
    options: ['email', 'google'],
    // Custom auth configuration
    redirectUrl: 'https://myapp.com/auth',
    loginUrl: 'https://myapp.com/login',
  },
  // Wallet display options
  metadata: {
    name: 'My App Wallet',
    description: 'Secure wallet for My App',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
  },
})
```

#### Multi-Chain Smart Accounts

```typescript
import { mainnet, polygon, arbitrum } from '@wagmi/core/chains'

const createSmartAccountConnector = (chainId: number) => 
  thirdwebWalletConnect({
    client: thirdwebClient,
    walletId: 'smart',
    chain: chainId,
    sponsorGas: true,
    factoryAddress: getFactoryAddress(chainId),
  })

const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    // In-app wallet for signing
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'inApp',
      auth: { options: ['email', 'google'] },
    }),
    // Smart accounts for each chain
    createSmartAccountConnector(mainnet.id),
    createSmartAccountConnector(polygon.id),
    createSmartAccountConnector(arbitrum.id),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})
```

### Migration from Wagmi Connectors

#### Replace Existing Connectors

```typescript
// Before: Standard wagmi connectors
import { metaMask, walletConnect } from '@wagmi/connectors'

const oldConfig = createConfig({
  connectors: [
    metaMask(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
})

// After: Enhanced with thirdweb capabilities
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'

const newConfig = createConfig({
  connectors: [
    metaMask(), // Keep existing connectors
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    // Add thirdweb enhanced wallets
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'inApp',
      auth: { options: ['email', 'google', 'apple'] },
    }),
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'smart',
      sponsorGas: true,
    }),
  ],
})
```

## API Reference

### thirdwebWalletConnect

Main function to create thirdweb wallet connectors for wagmi.

```typescript
function thirdwebWalletConnect(options: ThirdwebWalletOptions): Connector
```

#### Options

```typescript
interface ThirdwebWalletOptions {
  client: ThirdwebClient
  walletId: 'inApp' | 'smart' | string
  chain?: number
  auth?: {
    options: AuthOption[]
    redirectUrl?: string
    loginUrl?: string
  }
  sponsorGas?: boolean
  factoryAddress?: string
  accountSalt?: string
  metadata?: {
    name: string
    description?: string
    url?: string
    icons?: string[]
  }
}
```

#### Auth Options

- `'email'` - Email-based authentication
- `'google'` - Google OAuth
- `'apple'` - Apple OAuth  
- `'facebook'` - Facebook OAuth
- `'discord'` - Discord OAuth
- `'twitter'` - Twitter OAuth

### Connector Methods

```typescript
// Standard wagmi connector interface
connector.connect(options?)
connector.disconnect()
connector.getAccount()
connector.getChainId()
connector.switchChain(chainId)
```

## Examples

### Complete wagmi + thirdweb Application

```tsx
import { createConfig, http } from '@wagmi/core'
import { mainnet, polygon } from '@wagmi/core/chains'
import { WagmiProvider, useAccount, useConnect, useReadContract } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { thirdwebWalletConnect } from '@thirdweb-dev/wagmi-adapter'
import { createThirdwebClient } from 'thirdweb'

const thirdwebClient = createThirdwebClient({
  clientId: 'YOUR_CLIENT_ID',
})

const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    thirdwebWalletConnect({
      client: thirdwebClient,
      walletId: 'inApp',
      auth: {
        options: ['email', 'google'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
})

const queryClient = new QueryClient()

function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  if (isConnected) {
    return <div>Connected: {address}</div>
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}

function TokenBalance() {
  const { address } = useAccount()
  
  const { data: balance } = useReadContract({
    address: '0xA0b86a33E6441e13C7C95C5D6b55b7cE06eB6a9D', // USDC
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })

  return <div>USDC Balance: {balance?.toString()}</div>
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: '2rem' }}>
          <h1>Wagmi + thirdweb Example</h1>
          <WalletStatus />
          <TokenBalance />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Smart Account with Gas Sponsorship

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function GaslessTransaction() {
  const { 
    writeContract, 
    data: hash, 
    isPending 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    // This transaction will be sponsored (no gas required)
    writeContract({
      address: '0x...',
      abi: [
        {
          name: 'mint',
          type: 'function',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ],
      functionName: 'mint',
      args: ['0x...', 1000000000000000000n], // 1 token
    })
  }

  return (
    <div>
      <button 
        onClick={handleMint}
        disabled={isPending || isConfirming}
      >
        {isPending ? 'Preparing...' : 
         isConfirming ? 'Confirming...' : 
         'Mint Token (Gasless)'}
      </button>
      {isSuccess && <div>Transaction successful!</div>}
    </div>
  )
}
```

## References

### Documentation
- [Wagmi Documentation](https://wagmi.sh/) - Official wagmi docs
- [thirdweb wagmi Integration](https://portal.thirdweb.com/typescript/v5/wagmi) - Integration guide
- [Wagmi Connectors Guide](https://wagmi.sh/core/api/connectors) - Understanding wagmi connectors

### Examples and Templates
- [wagmi + thirdweb Template](https://github.com/thirdweb-example/wagmi-starter) - Complete example
- [Smart Account wagmi Example](https://github.com/thirdweb-example/smart-wallet-wagmi) - Account abstraction
- [Multi-chain wagmi App](https://github.com/thirdweb-example/multi-chain-wagmi) - Cross-chain functionality

### Related Libraries
- [@wagmi/core](https://www.npmjs.com/package/@wagmi/core) - Core wagmi functionality
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) - Data fetching for React
- [viem](https://www.npmjs.com/package/viem) - Low-level Ethereum library

### Advanced Topics
- [Custom Connectors](https://wagmi.sh/dev/creating-connectors) - Creating custom wagmi connectors
- [Account Abstraction Guide](https://portal.thirdweb.com/wallet/smart-wallet) - Understanding smart accounts
- [Gas Sponsorship Setup](https://portal.thirdweb.com/engine/features/gasless-transactions) - Configuring gasless transactions

### Community and Support
- [wagmi Discord](https://discord.gg/wagmi) - wagmi community support
- [thirdweb Discord](https://discord.gg/thirdweb) - thirdweb specific help
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report integration issues
