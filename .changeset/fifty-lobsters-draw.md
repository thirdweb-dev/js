---
"thirdweb": patch
---

Add overload to `signMessage` to pass an account rather than a private key

```ts
import { signMessage } from "thirdweb/utils";
await signMessage({
  message: "Hello, world!",
  account
});
```
