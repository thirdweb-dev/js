---
"thirdweb": minor
---

Exposes autoConnect as a standalone function for use outside of react.

```tsx
import { autoConnect } from "thirdweb/wallets";
 
const autoConnected = await autoConnect({
  client,
  onConnect: (wallet) => {
    console.log("wallet", wallet); /// wallet that is have been auto connected.
  },
});
console.log('isAutoConnected', isAutoConnected) // true or false
```
