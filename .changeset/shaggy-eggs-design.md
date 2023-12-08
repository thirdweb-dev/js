---
"@thirdweb-dev/react": patch
---

- Add option to only show the Official WalletConnect Modal for `walletConnect` in ConnectWallet Modal

```ts
walletConnect({
  qrModal: "walletConnect", // hide the ConnectWallet Modal and only show the WalletConnect Modal
});
```

If no, `qrModal` is set, it defaults to `"custom"` as shown below:

```ts
walletConnect({
  qrModal: "custom", // render QR code in ConnectWallet Modal
});
```

- Stop Focus trapping the ConnectWallet Modal when it is rendered but hidden
