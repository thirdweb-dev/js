---
"thirdweb": minor
---

EIP7702 support for in-app wallets

You can now turn your in-app wallets into smart accounts with 7702!

This lets you:

- sponsor transactions
- batch transactions
- add session keys
- and more!

simply pass the executionMode "EIP7702" to get started:

```ts
const wallet = inAppWallet({
  executionMode: {
    mode: "EIP7702",
    sponsorGas: true,
  },
});
```

Keep in mind that this will only work on chains that support 7702.
