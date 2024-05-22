---
"thirdweb": minor
---

Adds the ability to update ecosystem wallet details

### Usage

```ts
import { createThirdwebClient } from "thirdweb";
import { updateEcosystem } from "thirdweb/wallets/ecosystem";

const client = createThirdwebClient({ secretKey: "your_secret_key" });
const ecosystemId = await updateEcosystem({
  client: client,
  id: "ecosystem_id",
  name: "My Updated Ecosystem",
  logoUrl: "https://example.com/logo.png",
});
```
