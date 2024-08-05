---
"thirdweb": minor
---

Adds telegram login option for in-app wallets

```ts
import { inAppWallet } from "thirdweb"

const wallet = inAppWallet();

await wallet.connect({
    strategy: "telegram"
});
```

