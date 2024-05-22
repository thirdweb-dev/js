---
"thirdweb": minor
---

Adds the ability to retrieve all wallet ecosystems for an account.

### Usage

```ts
import { createThirdwebClient } from "thirdweb";
import { getEcosystems } from "thirdweb/wallets/ecosystem";

const client = createThirdwebClient({ secretKey: "your_secret_key" });
const ecosystem = await getEcosystems({
  client: client,
});
```
