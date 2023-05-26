---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/wallets": patch
---

[ReactNative-Wallets] Enables SmartWallet to connect to an app, with implementation in React Native

- Wallets package

1. Smart Wallet now supports connecting an external app to it. It acts as an actual wallet implementing the WC protocol
2. There are two WalletConnect handlers to manage V1 and V2 WC connections
3. Creates a synchronous storage interface used in WCV1
4. To have your connector support WC, you need to implement the interface: IWalletConnectReceiver.
5. You can now pass the flag enableConnectApp to the smart wallet config to enable a new field in our modal to connect an app to your smart wallet

```
smartWallet({
    factoryAddress: "..."
    thirdwebApiKey: "apiKey"
    gasless: true,
    personalWallets: [localWallet()],
    enableConnectApp: true,
}),
```

- React Native

1. Creates new modals for WC SessionRequests and SessionApprovals
2. Implements SyncStorage using MMKV
