---
"thirdweb": patch
---

BETA support for 7579 modular smart accounts

You can now create modular smart wallets using the 7579 preset.

Keep in mind that this is in BETA, and there might be breaking API changes.

```typescript
import { sepolia } from "thirdweb/chains";
import { smartWallet, Config } from "thirdweb/wallets/smart";
 const modularSmartWallet = smartWallet(
  Config.erc7579({
    chain: sepolia,
    sponsorGas: true,
    factoryAddress: "0x...", // the 7579 factory address
    validatorAddress: "0x...", // the default validator module address
  }),
});
```
