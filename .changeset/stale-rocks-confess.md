---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/wallets": patch
---

[RN] Adds walletConnectReceiver prop to EmbeddedWallet and SmartWallet

You can pass your own WalletConnect projectId and metadata (highly recommended):

```typescript
embeddedWallet({
    auth: {
    options: ['email', 'google'],
    redirectUrl: 'redirect-url',
    },
    walletConnectReceiver: {
        walletConnectWalletMetadata?: WCMetadata;
        walletConnectV2ProjectId?: string;
        walletConnectV2RelayUrl?: string;
    },
}),

smartWallet(localWallet(), {
    factoryAddress: 'factory-address',
    gasless: true,
    walletConnectReceiver: {
        walletConnectWalletMetadata?: WCMetadata;
        walletConnectV2ProjectId?: string;
        walletConnectV2RelayUrl?: string;
    },
}),
```

You can just pass `true` to the prop and these props will default to our internal WalletConnect projectId and metadata.

```typescript
embeddedWallet({
    auth: {
    options: ['email', 'google'],
    redirectUrl: 'redirect-url',
    },
    walletConnectReceiver: true
}),

smartWallet(localWallet(), {
    factoryAddress: 'factory-address',
    gasless: true,
    walletConnectReceiver: true
}),
```
