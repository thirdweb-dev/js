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

## 📦 Packages

This monorepo contains multiple packages designed to work together to provide a comprehensive web3 development experience. Each package serves a specific purpose and can be used independently or in combination with others.

### Core Package

#### [`thirdweb`](./packages/thirdweb/README.md)
The main SDK package providing all-in-one web3 functionality for Browser, Node, and Mobile applications.

```bash
npm install thirdweb
```

**Features:**
- Type-safe contract and wallet APIs
- Embedded wallets with social/email login
- Account abstraction (ERC4337) support
- React hooks and UI components
- Automatic ABI resolution
- IPFS upload/download
- Cross-platform support (Web, React Native)

### Platform Adapters

#### [`@thirdweb-dev/react-native-adapter`](./packages/react-native-adapter/README.md)
Required polyfills and configuration for running the thirdweb SDK in React Native applications.

```bash
npm install @thirdweb-dev/react-native-adapter
```

**Purpose:** Provides necessary polyfills and setup instructions for React Native compatibility.

#### [`@thirdweb-dev/wagmi-adapter`](./packages/wagmi-adapter/README.md)
Integration layer for using thirdweb's in-app wallets with wagmi.

```bash
npm install @thirdweb-dev/wagmi-adapter
```

**Purpose:** Enables seamless integration between thirdweb wallets and the wagmi ecosystem.

### Backend Services

#### [`@thirdweb-dev/engine`](./packages/engine/README.md)
TypeScript SDK for Engine, thirdweb's backend onchain executor service.

```bash
npm install @thirdweb-dev/engine
```

**Purpose:** Interact with thirdweb Engine for backend transaction execution and blockchain operations.

#### [`@thirdweb-dev/vault-sdk`](./packages/vault-sdk/README.md)
SDK for interacting with Vault, thirdweb's secure key management service.

```bash
npm install @thirdweb-dev/vault-sdk
```

**Purpose:** Secure key management and wallet operations through thirdweb's Vault service.

#### [`@thirdweb-dev/nebula`](./packages/nebula/README.md)
TypeScript SDK for Nebula, thirdweb's AI agent service.

```bash
npm install @thirdweb-dev/nebula
```

**Purpose:** Integrate AI-powered blockchain interactions and smart contract operations.

#### [`@thirdweb-dev/insight`](./packages/insight/README.md)
TypeScript SDK for Insight, thirdweb's analytics and monitoring service.

```bash
npm install @thirdweb-dev/insight
```

**Purpose:** Analytics, monitoring, and insights for your web3 applications and smart contracts.

#### [`@thirdweb-dev/api`](./packages/api/README.md)
TypeScript SDK for thirdweb's general API services.

```bash
npm install @thirdweb-dev/api
```

**Purpose:** Access thirdweb's general API endpoints for various web3 services and utilities.

### Utilities

#### [`@thirdweb-dev/service-utils`](./packages/service-utils/README.md)
Internal utilities and shared functionality for thirdweb services.

```bash
npm install @thirdweb-dev/service-utils
```

**Purpose:** Shared utilities, types, and helper functions used across thirdweb services.

## 🚀 Quick Start

### For Web Applications

```bash
npm install thirdweb
```

```typescript
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

function App() {
  return <ConnectButton client={client} />;
}
```

### For React Native Applications

```bash
npm install thirdweb @thirdweb-dev/react-native-adapter
```

```typescript
// Import at the top of your App.tsx
import "@thirdweb-dev/react-native-adapter";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

function App() {
  return <ConnectButton client={client} />;
}
```

### For Backend Applications

```bash
npm install thirdweb @thirdweb-dev/engine
```

```typescript
import { createThirdwebClient } from "thirdweb";
import { configure } from "@thirdweb-dev/engine";

// Configure Engine client
configure({
  secretKey: "YOUR_SECRET_KEY",
});

const client = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY",
});
```

## 🔗 Package Dependencies

```mermaid
graph TD
    A[thirdweb] --> B[Core SDK]
    C[@thirdweb-dev/react-native-adapter] --> A
    D[@thirdweb-dev/wagmi-adapter] --> A
    E[@thirdweb-dev/engine] --> F[Engine API]
    G[@thirdweb-dev/vault-sdk] --> H[Vault Service]
    I[@thirdweb-dev/nebula] --> J[Nebula AI]
    K[@thirdweb-dev/insight] --> L[Analytics]
    M[@thirdweb-dev/api] --> N[thirdweb API]
    O[@thirdweb-dev/service-utils] --> P[Shared Utils]
```

## 📚 Documentation

- **Main Documentation**: [https://portal.thirdweb.com/typescript/v5](https://portal.thirdweb.com/typescript/v5)
- **React Documentation**: [https://portal.thirdweb.com/typescript/v5/react](https://portal.thirdweb.com/typescript/v5/react)
- **React Native Guide**: [https://portal.thirdweb.com/react-native](https://portal.thirdweb.com/react-native)
- **Templates**: [https://thirdweb.com/templates](https://thirdweb.com/templates)

## 🛠 Development

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation

```bash
pnpm install
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=./packages/thirdweb
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=./packages/thirdweb
```

## 🤝 Contributing

We welcome contributions from all developers regardless of experience level. If you are interested in contributing, please read our [Contributing Guide](.github/contributing.md) to learn how the repo works, how to test your changes, and how to submit a pull request.

See our [open source page](https://thirdweb.com/open-source) for more information on our open-source bounties and program.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For help or feedback, please [visit our support site](https://thirdweb.com/support) or join our [Discord community](https://discord.gg/thirdweb).

## 🔒 Security

If you believe you have found a security vulnerability in any of our packages, we kindly ask you not to open a public issue; and to disclose this to us by emailing `security@thirdweb.com`.
