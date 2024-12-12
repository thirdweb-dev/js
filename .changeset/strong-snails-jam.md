---
"thirdweb": minor
---

Support the ability to unlink accounts for in app wallet with more than 1 linked account.

It's supported out of the box in the connect UI.

For typescript users, the following code snippet is a simple example of how it'd work.

```typescript
import { inAppWallet } from "thirdweb/wallets";
  
const wallet = inAppWallet();
wallet.connect({ strategy: "google" });

const profiles = await getProfiles({
  client,
});

const updatedProfiles = await unlinkProfile({
  client,
  profileToUnlink: profiles[1],// assuming there is more than 1 profile linked to the user. 
});
```
