---
"@thirdweb-dev/react-native": minor
"@thirdweb-dev/wallets": minor
"@thirdweb-dev/unity-js-bridge": minor
---

Enforces passing an encryption key for custom jwt auth

```typescript
const embedded = useEmbeddedWallet();

embedded.connect({
  jwt: "<token>",
  encryptionKey: "<my-key>",
  strategy: "jwt",
});
```
