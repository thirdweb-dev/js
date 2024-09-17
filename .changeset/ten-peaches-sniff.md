---
"thirdweb": minor
---

Adds guest account option. These accounts will only persist for the duration of the user's session unless they link an additionaly auth method to recover the account with.
```ts
import { inAppWallet } from "thirdweb/wallets";

const wallet = inAppWallet();

const account = await wallet.connect({
  client,
  strategy: "guest",
});
```
