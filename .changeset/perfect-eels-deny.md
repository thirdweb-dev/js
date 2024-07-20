---
"thirdweb": minor
---

Add discord login as an option of thirdweb in app wallet and ecosystem wallet logins

```typescript
import { inAppWallet } from "thirdweb/wallets";
  const wallet = inAppWallet();
  const account = await wallet.connect({
   client,
   chain,
   strategy: "discord",
 });
```