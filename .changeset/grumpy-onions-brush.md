---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Fixes Coinbase wallet on iOS

- Adds connect wallet hooks for the supported wallets:

1. useMetaMaskWallet
2. useCoinbaseWallet
3. useRainbowWallet
4. useTrustWallet

Usage:

```
const connect = useMetaMaskWallet();
connect();
```
