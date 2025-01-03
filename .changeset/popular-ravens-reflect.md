---
"thirdweb": minor
---

Add support for backend wallets.

This is useful is you have a backend that is connected to an agent or what not that you want to have programmatic access to a wallet without managing private keys.

Here's how you'd do it:

```typescript
const wallet = inAppWallet();
const account = await wallet.connect({
    strategy: "backend",
    client: createThirdwebClient({
        secretKey: "...",
    }),
    walletSecret: "...",
  });
console.log("account.address", account.address);
```

Note that `walletSecret` would simply be something that you generate and store to uniquely identify the given wallet created under the particular `client`.
