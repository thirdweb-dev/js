---
"thirdweb": minor
---

ERC20 Token Paymaster support

You can now use ERC20 Token Paymasters with Smart Wallets.

```typescript
import { base } from "thirdweb/chains";
import { TokenPaymaster, smartWallet } from "thirdweb/wallets";

const wallet = smartWallet({
  chain: base,
  sponsorGas: true, // only sponsor gas for the first ERC20 approval
  overrides: {
    tokenPaymaster: TokenPaymaster.BASE_USDC,
  },
});
```
