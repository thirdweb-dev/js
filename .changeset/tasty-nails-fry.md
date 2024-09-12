---
"thirdweb": minor
---

Adds getUsers function to query users on the server

```ts
import { getUser } from "thirdweb/wallets";

const user = await getUser({
  client,
  walletAddress: "0x123...",
});
```
