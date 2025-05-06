---
"thirdweb": patch
---

Added the `sortBy` option to Bridge.routes

```ts
import { Bridge } from "thirdweb";

const routes = await Bridge.routes({
  originChainId: 1,
  originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  limit: 10,
  offset: 0,
  sortBy: "popularity",
  client: thirdwebClient,
});
```