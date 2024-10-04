---
"thirdweb": patch
---

Add querying for in app wallet user details via externally linked wallet address:

```ts
import { getUser } from "thirdweb";

// this is the wallet address that the user used to connect via SIWE to their in app wallet
const user = await getUser({
  client,
  externalWalletAddress: "0x123...",
});
```

Add querying for ecosystem wallet user details:

```ts
import { getUser } from "thirdweb";

const user = await getUser({
  client,
  ecosystem: {
    id: "ecosystem.YOUR_ID",
    partnerId: "OPTIONAL_PARTNER_ID"
  }
  email: "user@example.com",
});
```
