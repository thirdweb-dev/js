---
"thirdweb": minor
---

Added webhook verification functionality to securely verify incoming webhooks from thirdweb. This includes:

- New `Webhook.parse` function to verify webhook signatures and timestamps
- Support for both `x-payload-signature` and `x-pay-signature` header formats
- Timestamp verification with configurable tolerance
- Version 2 webhook payload type support

Example usage:
```typescript
import { Webhook } from "thirdweb/bridge";

const webhook = await Webhook.parse(
  payload,
  headers,
  secret,
  300 // optional tolerance in seconds
);
``` 