---
"@thirdweb-dev/react": patch
---

Connect to MetaMask on mobile device using WalletConnect instead of opening the web app in MetaMask browser by default

This behavior can be changed by setting `connectionMethod` option to `metamaskWallet`

```tsx
<ThirdwebProvider
  supportedWallets={[
    metamaskWallet({
      connectionMethod: "walletConnect", // default
    }),
  ]}
>
  <App />
</ThirdwebProvider>
```

this is same as not setting `connectionMethod` option:

```tsx
<ThirdwebProvider supportedWallets={[metamaskWallet()]}>
  <App />
</ThirdwebProvider>
```

If you want to revert to old behavior of opening the web app in Metamask browser, set `connectionMethod` to `metamaskBrowser`

```tsx
<ThirdwebProvider
  supportedWallets={[
    metamaskWallet({
      connectionMethod: "metamaskBrowser",
    }),
  ]}
>
  <App />
</ThirdwebProvider>
```
