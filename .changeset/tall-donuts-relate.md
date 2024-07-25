---
"thirdweb": minor
---

Adds the ability to open OAuth windows as a redirect. This is useful for embedded applications such as telegram web apps.

Be sure to include your domain in the allowlisted domains for your client ID.

```ts
import { inAppWallet } from "thirdweb/wallets";
const wallet = inAppWallet({
  auth: {
    mode: "redirect"
  }
});
```
