---
"thirdweb": minor
---

Update SIWE interface
```ts
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { mainnet } from "thirdweb/chains"

const rabby = createWallet("io.rabby");
const wallet = inAppWallet();

const account = await wallet.connect({
    client: MY_CLIENT,
    strategy: "wallet",
    wallet: rabby,
    chain: mainnet
});
```

