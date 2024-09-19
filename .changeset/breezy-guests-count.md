---
"thirdweb": minor
---

Login to an in-app wallet with your Coinbase account

```ts
import { inAppWallet } from "thirdweb/react"

const wallet = inAppWallet();

const account = await wallet.connect({
    strategy: "coinbase",
    chain: mainnet,
    client: thirdwebClient,
});
```
