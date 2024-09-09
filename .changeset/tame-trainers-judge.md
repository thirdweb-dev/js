---
"@thirdweb-dev/react-native-adapter": minor
"thirdweb": minor
---

Support for Coinbase Smart Wallet in React Native

You can now use the Coinbase Smart Wallet in your React Native apps.

```ts
const wallet = createWallet("com.coinbase.wallet", {
  appMetadata: {
    name: "My app name",
  },
  mobileConfig: {
    callbackURL: "https://example.com",
  },
  walletConfig: {
    options: "smartWalletOnly",
  },
});

await wallet.connect({
  client,
});
```
