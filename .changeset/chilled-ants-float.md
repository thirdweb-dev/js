---
"thirdweb": minor
---

Adds SIWE authentication on in-app wallets

```ts
import { inAppWallet } from "thirdweb/wallets"

const wallet = inAppWallet();
const account = await wallet.connect({
  client,
  walletId: "io.metamask",
  chainId: 1 // can be anything unless using smart accounts
});
```

This will give you a new in-app wallet, **not** the injected provider wallet.

