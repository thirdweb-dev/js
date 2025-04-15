---
"@thirdweb-dev/insight": major
---

Initial release of dedicated insight TS sdk

This package is a thin openAPI wrapper for insight, our in-house indexer.

## Configuration

```ts
import { configure } from "@thirdweb-dev/insight";

// call this once at the startup of your application
configure({
  clientId: "<YOUR_CLIENT_ID>",
});
```

## Example Usage

```ts
import { getV1Events } from "@thirdweb-dev/insight";

const events = await getV1Events({
  query: {
    chain: [1, 137],
    filter_address: "0x1234567890123456789012345678901234567890",
  },
});
```
