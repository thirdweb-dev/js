---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Allow guest mode to be directly connected when no supported wallets are passed in

When passing an empty `supportedWallets` array and setting `guestMode` to true:

```
<ThirdwebProvider
      activeChain={activeChain}
      supportedChains={[activeChain]}
      guestMode={true}
      supportedWallets={[]}
```

Pressing on the ConnectWallet button will automatically create a `LocalWallet` for you and connect the user without any further prompts
