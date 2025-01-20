---
"thirdweb": minor
---

Feature: Adds deployMarketplaceContract

```ts

import { deployMarketplaceContract } from "thirdweb/deploys";

const address = await deployMarketplaceContract({
      client,
      chain,
      account,
      params: {
        name: "MarketplaceV3",
        description: "MarketplaceV3 deployed using thirdweb SDK",
        platformFeeRecipient: "0x21d514c90ee4E4e4Cd16Ce9185BF01F0F1eE4A04",
        platformFeeBps: 1000, 
      }
});
```
