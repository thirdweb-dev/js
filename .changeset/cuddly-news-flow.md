---
"thirdweb": minor
---

New `smartAccount` prop for `inAppWallet()`

You can now convert an inAppWallet to a smart account simply by passing the `smartAccount` prop.

```ts
const wallet = inAppWallet({
  smartAccount: {
    chain: sepolia,
    sponsorGas: true,
  },
});

await wallet.connect({
  client,
  strategy: "google",
});
```

Note: beware that when toggling this flag on and off, you will get a different address (admin EOA vs smart account).
