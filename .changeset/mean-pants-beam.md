---
"thirdweb": patch
---

Add `verify` parameter to `Bridge.Webhook.parse` function to validate the payload

### Example

```ts
import { Bridge } from "thirdweb";

const payload = await Bridge.Webhook.parse(
  body,
  headers,
  process.env.WEBHOOK_SECRET,
  tolerance,
  {
    // throw an error if the `payload` doesn't have this receiver address set
    receiverAddress: "0x1234567890123456789012345678901234567890",
  }
);
```
