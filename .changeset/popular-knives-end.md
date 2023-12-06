---
"@thirdweb-dev/wallets": minor
---

feat: add custom auth endpoint authentication strategy support for embeddedWallet

Configure the endpoint for where the payload is to be sent too over at thirdweb.com/dashboard.

```typsecript
await embeddedWallet.authenticate({
    strategy: "auth_endpoint",
    payload: "SOME_STRING",
    encryptionKey: ""
});
```
