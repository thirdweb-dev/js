---
"@thirdweb-dev/wallets": patch
---

New SmartWallet API for session keys

You can now add admins and scoped session keys to smart wallets directly with a simple API:

```
const smartWallet = new SmartWallet(config);
await smartWallet.connect({ personalWallet })

await smartWallet.createSessionKey(keyAddress, permissions);
await smartWallet.revokeSessionKey(keyAddress);

await smartWallet.addAdmin(adminAddress);
await smartWallet.removeAdmin(adminAddress);
```
