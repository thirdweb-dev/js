# React Native Adapter

## Description

The **@thirdweb-dev/react-native-adapter** package provides essential polyfills and configuration required to run the thirdweb SDK in React Native applications. This adapter bridges the gap between web APIs that the thirdweb SDK expects and the React Native runtime environment, ensuring seamless cross-platform functionality.

### Key Features

- **Essential Polyfills**: Provides crypto, network, and storage polyfills for React Native
- **Metro Configuration**: Guides for proper module resolution setup
- **Cross-Platform Support**: Works with both iOS and Android React Native apps
- **Expo Integration**: Full compatibility with Expo and Expo Router
- **Native Dependencies**: Manages complex native dependency requirements
- **Security**: Implements secure cryptographic operations for mobile environments

## Installation

### 1. Install Core Packages

```bash
npm install thirdweb @thirdweb-dev/react-native-adapter
```

Or with Expo:

```bash
npx expo install thirdweb @thirdweb-dev/react-native-adapter
```

### 2. Install Required Peer Dependencies

Since React Native requires installing native dependencies directly, you must install these required peer dependencies:

```bash
npx expo install react-native-get-random-values @react-native-community/netinfo expo-application @react-native-async-storage/async-storage expo-web-browser expo-linking react-native-aes-gcm-crypto react-native-quick-crypto@0.7.0-rc.6 amazon-cognito-identity-js @coinbase/wallet-mobile-sdk react-native-mmkv react-native-svg @react-native-clipboard/clipboard
```

#### Dependency Explanations

```typescript
// Wallet Connect dependencies
"react-native-get-random-values"     // Secure random number generation
"@react-native-community/netinfo"    // Network state detection
"expo-application"                   // App information access

// In-app wallet dependencies  
"@react-native-async-storage/async-storage" // Persistent storage
"expo-web-browser"                   // OAuth flows
"amazon-cognito-identity-js"         // Authentication
"react-native-aes-gcm-crypto"        // Encryption
"react-native-quick-crypto"          // Fast hashing

// UI components dependencies
"react-native-svg"                   // SVG rendering
"react-native-mmkv"                  // Fast key-value storage
"@react-native-clipboard/clipboard"  // Clipboard access
```

## Usage

### 1. Configure Metro

If you don't have a `metro.config.js` file, create one:

```bash
npx expo customize metro.config.js
```

Add the required resolver properties:

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports and conditional exports
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "react-native",
  "browser", 
  "require",
];

module.exports = config;
```

### 2. Import Polyfills

#### Standard React Native App

Import the adapter at the very top of your `App.tsx`:

```typescript
// App.tsx
import "@thirdweb-dev/react-native-adapter"; // Must be first import
import React from "react";
import { View } from "react-native";
import { ThirdwebProvider } from "thirdweb/react";

export default function App() {
  return (
    <ThirdwebProvider>
      {/* Your app content */}
    </ThirdwebProvider>
  );
}
```

#### Expo Router Apps

For Expo Router, create a new entry point to ensure polyfills load before routing:

1. Create `app/index.ts`:

```typescript
// app/index.ts
import "@thirdweb-dev/react-native-adapter"; // Polyfills first
import "expo-router/entry"; // Then router
```

2. Update your `package.json`:

```json
{
  "main": "./app/index"
}
```

### 3. Basic thirdweb Setup

Once configured, use thirdweb exactly as you would in a web environment:

```typescript
// MyComponent.tsx
import React from "react";
import { View, Text } from "react-native";
import { 
  ThirdwebProvider, 
  ConnectButton, 
  useActiveAccount 
} from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

function WalletInfo() {
  const account = useActiveAccount();
  
  return (
    <View>
      {account ? (
        <Text>Connected: {account.address}</Text>
      ) : (
        <Text>Not connected</Text>
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThirdwebProvider>
      <View style={{ flex: 1, padding: 20 }}>
        <ConnectButton client={client} />
        <WalletInfo />
      </View>
    </ThirdwebProvider>
  );
}
```

### 4. In-App Wallets Example

```typescript
import { createWallet } from "thirdweb/wallets";
import { ConnectButton } from "thirdweb/react";

const inAppWallet = createWallet("inApp", {
  auth: {
    options: ["email", "google", "apple", "facebook"],
  },
});

function LoginScreen() {
  return (
    <ConnectButton
      client={client}
      wallets={[inAppWallet]}
      connectModal={{
        size: "wide",
        title: "Sign in to MyApp",
      }}
    />
  );
}
```

### 5. Smart Contract Interactions

```typescript
import { getContract, readContract, prepareContractCall } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { polygon } from "thirdweb/chains";

const contract = getContract({
  client,
  chain: polygon,
  address: "0x...",
});

function TokenBalance() {
  const account = useActiveAccount();
  const { data: balance } = useReadContract({
    contract,
    method: "function balanceOf(address) returns (uint256)",
    params: [account?.address!],
    queryOptions: { enabled: !!account },
  });

  return <Text>Balance: {balance?.toString()}</Text>;
}

function TransferButton() {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handleTransfer = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function transfer(address to, uint256 amount)",
      params: ["0x...", 1000000000000000000n], // 1 token
    });

    sendTransaction(transaction);
  };

  return (
    <TouchableOpacity 
      onPress={handleTransfer}
      disabled={isPending}
      style={{ padding: 10, backgroundColor: "blue" }}
    >
      <Text style={{ color: "white" }}>
        {isPending ? "Sending..." : "Send Token"}
      </Text>
    </TouchableOpacity>
  );
}
```

## Configuration Notes

### Android Requirements

- **Minimum SDK**: React Native AES GCM Crypto requires `minSdkVersion 26`. Update your `android/build.gradle`:

```gradle
// android/build.gradle
buildscript {
    ext {
        minSdkVersion = 26  // Required for encryption
        compileSdkVersion = 34
        targetSdkVersion = 34
    }
}
```

### iOS Requirements

- **iOS 13+**: Some cryptographic functions require iOS 13 or higher
- **Capability Entitlements**: Ensure proper entitlements for network and keychain access

### Common Issues and Solutions

#### Metro Resolution Warnings

You may see warnings about unresolved exports. This is normal and will improve as libraries update to support newer Metro versions.

#### Build Errors

If you encounter build errors:

1. Clear Metro cache: `npx expo start --clear`
2. Clean and reinstall: `rm -rf node_modules && npm install`
3. For iOS: `cd ios && pod install` (if using bare React Native)

#### Performance Optimization

For better performance, consider lazy loading the thirdweb SDK:

```typescript
import { lazy, Suspense } from "react";

const ThirdwebApp = lazy(() => import("./ThirdwebApp"));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ThirdwebApp />
    </Suspense>
  );
}
```

## Examples

### Complete React Native DApp

```typescript
// App.tsx
import "@thirdweb-dev/react-native-adapter";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  ThirdwebProvider,
  ConnectButton,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { createThirdwebClient, getContract, prepareContractCall } from "thirdweb";
import { polygon } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

const contract = getContract({
  client,
  chain: polygon,
  address: "0x...", // Your contract address
});

function WalletSection() {
  const account = useActiveAccount();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Wallet Connection</Text>
      <ConnectButton client={client} />
      {account && (
        <Text style={styles.address}>
          Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </Text>
      )}
    </View>
  );
}

function ContractInteraction() {
  const account = useActiveAccount();
  const { data: balance } = useReadContract({
    contract,
    method: "function balanceOf(address) returns (uint256)",
    params: [account?.address!],
    queryOptions: { enabled: !!account },
  });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handleMint = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function mint(address to, uint256 amount)",
      params: [account!.address, 1000000000000000000n],
    });
    sendTransaction(transaction);
  };

  if (!account) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Contract Interaction</Text>
      <Text>Balance: {balance?.toString() || "0"}</Text>
      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleMint}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Minting..." : "Mint Token"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <ThirdwebProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>My Web3 App</Text>
        <WalletSection />
        <ContractInteraction />
      </SafeAreaView>
    </ThirdwebProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  address: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
```

## API Reference

### Core Import

```typescript
import "@thirdweb-dev/react-native-adapter";
```

This single import provides:

- **Crypto Polyfills**: `crypto.getRandomValues()`, `crypto.subtle`
- **Buffer Polyfill**: Global `Buffer` object
- **URL Polyfill**: `URL` and `URLSearchParams` constructors  
- **Storage Polyfills**: LocalStorage and SessionStorage implementations
- **Network Polyfills**: Fetch and WebSocket implementations
- **Text Encoding**: TextEncoder and TextDecoder

### Metro Configuration

Required metro.config.js settings:

```javascript
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "react-native",
  "browser", 
  "require",
];
```

## References

### Documentation
- [React Native Integration Guide](https://portal.thirdweb.com/react-native) - Complete setup guide
- [thirdweb React Native Docs](https://portal.thirdweb.com/typescript/v5/react) - React Native specific documentation
- [Metro Configuration Guide](https://metrobundler.dev/docs/resolution) - Metro resolver documentation

### Examples and Templates
- [Full Working Demo](https://github.com/thirdweb-dev/expo-starter) - Complete React Native example
- [Expo Router Example](https://github.com/thirdweb-example/expo-router-starter) - Expo Router integration
- [React Native Templates](https://thirdweb.com/templates?framework=react-native) - Ready-to-use templates

### Platform-Specific Guides
- [iOS Setup Guide](https://portal.thirdweb.com/react-native/ios) - iOS specific configuration
- [Android Setup Guide](https://portal.thirdweb.com/react-native/android) - Android specific configuration
- [Expo Integration](https://portal.thirdweb.com/react-native/expo) - Expo specific setup

### Dependencies Documentation
- [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto) - Cryptographic operations
- [react-native-aes-gcm-crypto](https://github.com/craftzdog/react-native-aes-gcm-crypto) - AES-GCM encryption
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) - OAuth flows
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Persistent storage

### Troubleshooting
- [Common Issues](https://portal.thirdweb.com/react-native/troubleshooting) - Solutions to common problems
- [Metro Resolution Issues](https://portal.thirdweb.com/react-native/metro-issues) - Metro configuration problems
- [Build Errors](https://portal.thirdweb.com/react-native/build-errors) - Platform-specific build issues

### Community Support
- [Discord #react-native](https://discord.gg/thirdweb) - React Native specific help
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Bug reports and feature requests
- [Stack Overflow](https://stackoverflow.com/questions/tagged/thirdweb) - Community Q&A
