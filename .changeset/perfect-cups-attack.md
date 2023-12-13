---
"@thirdweb-dev/react-native": patch
---

Adds the ability to login with any arbitrary login payload

```typescript
await embeddedWallet.authenticate({
  strategy: "auth_endpoint",
  payload: "SOME_STRING",
  encryptionKey: "",
});
```
