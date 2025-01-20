---
"thirdweb": minor
---

Feature: Chain is no longer required for smart accounts

```ts
import { smartWallet } from "thirdweb";

const wallet = smartWallet({
    sponsorGas: true, // enable sponsored transactions
});
```
