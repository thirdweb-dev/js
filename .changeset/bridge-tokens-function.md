---
"thirdweb": patch
---

Add `Bridge.tokens()` function to retrieve supported Universal Bridge tokens

New function allows fetching and filtering tokens supported by the Universal Bridge service. Supports filtering by chain ID, token address, symbol, name, and includes pagination with limit/offset parameters.

```typescript
import { Bridge } from "thirdweb";

// Get all supported tokens
const tokens = await Bridge.tokens({
  client: thirdwebClient,
});

// Filter tokens by chain and symbol
const ethTokens = await Bridge.tokens({
  chainId: 1,
  symbol: "USDC",
  limit: 50,
  client: thirdwebClient,
});
```
