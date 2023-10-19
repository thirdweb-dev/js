---
"@thirdweb-dev/wallets": patch
---

Expose new Smart Wallet transaction functions

Snding raw transactions:

```
smartWallet.sendRaw(tx);
smartWallet.executeRaw(tx); // waits for confirmations
```

Sending raw batched transactions

```
smartWallet.sendBatchRaw(tx);
smartWallet.executeBatchRaw(tx); // waits for confirmations
```
