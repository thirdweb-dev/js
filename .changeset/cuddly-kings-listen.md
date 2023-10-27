---
"@thirdweb-dev/wallets": patch
---

Expose function to estimate SmartWallet transactions, handling pre and post deployment state

```ts
const cost = smartWallet.estimate(preparedTx);
const costBatch = smartWallet.estimateBatch(preparedTxs);
```

Also works with raw transactions

```ts
const cost = smartWallet.estimateRaw(rawTx);
const costBatch = smartWallet.estimateBatchRaw(rawTxs);
```
