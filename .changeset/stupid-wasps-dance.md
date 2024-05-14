---
"thirdweb": minor
---

You can now specify an image for the social login page.

```ts
import { inAppWallet } from "thirdweb/wallets";
const wallet = inAppWallet({
  metadata: {
    image: {
      src: "https://example.com/logo.png",
      alt: "My logo",
      width: 100,
      height: 100,
    },
  },
});
```
