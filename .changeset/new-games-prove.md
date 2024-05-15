---
"thirdweb": minor
---

Adds the ability to set a custom logo for the social login modal

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
