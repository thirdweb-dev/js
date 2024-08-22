---
"thirdweb": patch
---

Enable external redirects for electron support

```ts
import { authenticate } from "thirdweb/wallets/in-app";

const result = await authenticate({
  client,
  strategy: "google",
  redirectUrl: "https://example.org",
  mode: "window"
});
```
