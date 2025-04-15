---
"thirdweb": patch
---

Get indexed events from `getContractEvents`

You can now automatically query indexed events on supported chains when calling getContractEvents

```ts
import { getContractEvents } from "thirdweb";

const events = await getContractEvents({
  contract: DOODLES_CONTRACT,
  events: [transferEvent()],
});
```

This method falls back to RPC eth_getLogs if the indexer is not available.

You can also use the dedicated indexer function via the Insight export

```ts
import { Insight } from "thirdweb";

const events = await Insight.getContractEvents({
  client,
  chains: [sepolia],
  contractAddress: "0x1234567890123456789012345678901234567890",
  event: transferEvent(),
  decodeLogs: true,
});
```
