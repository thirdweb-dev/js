---
"@thirdweb-dev/wallets": minor
---

feat(wallets): Enable custom jwt auth for embedded wallets

Usage:

```typescript
const embeddedWalletConnector = new EmbeddedWalletConnecter({
  clientId: "Thirdweb client id",
  chains: [Optimism, Goerli, Ethereum],
  chain: Optimism,
});
embeddedWalletConnector.connect({
  loginType: "custom_jwt_auth",
  jwt: "Your jwt here",
  encryptionKey: "Super strong encryption key",
});
```
