---
"thirdweb": minor
---

Adds waitForBundle function to await a sendCalls bundle's complete confirmation.

### Usage

```ts
import { waitForBundle } from "thirdweb/wallets/eip5792";
const result = await waitForBundle({
  client,
  chain,
  wallet,
  bundleId: "0x123...",
});
```
