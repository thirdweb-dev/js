---
"thirdweb": minor
---

Adds the ability to create a wallet ecosystem for use by other developers

### Usage

```ts
import { createThirdwebClient } from "thirdweb";
import { createEcosystem } from "thirdweb/wallets/ecosystem";

const client = createThirdwebClient({ secretKey: "your_secret_key" });
const ecosystemId = await createEcosystem({
  client: client,
  name: "My New Ecosystem",
  logoUrl: "https://example.com/logo.png",
});
```
