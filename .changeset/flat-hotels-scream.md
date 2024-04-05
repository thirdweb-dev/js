---
"thirdweb": minor
---

add phone authentication method for embedded wallets

example usage:

```ts
import { createThirdwebClient } from "thirdweb";
import { preAuthenticate, connectEmbeddedWallet } from "thirdweb/wallets/embedded";

// phone number with country code, no spaces
const phoneNumber = "+11234567890";
const client = createThirdwebClient({ clientId: "Your client ID" });
await preAuthenticate({
  strategy: "phone",
  phoneNumber,
  client,
});

const [wallet, chain] = await connectEmbeddedWallet({
    strategy: "phone";
    phoneNumber,
    verificationCode: "SMS_CODE_HERE"
});
```
