---
"thirdweb": minor
---

Wallets can now add additional profiles to an account. Once added, any connected profile can be used to access the same wallet.

```ts
const wallet = inAppWallet();

await wallet.connect({ strategy: "google" });
const profiles = await linkProfile(wallet, { strategy: "discord" });
```
Both the Google and Discord accounts will now be linked to the same wallet.

If the Discord account is already linked to this or another wallet, this will throw an error.

You can retrieve all profiles linked to a wallet using the `getProfiles` method.
```ts
import { inAppWallet, getProfiles } from "thirdweb/wallets";

const wallet = inAppWallet();
wallet.connect({ strategy: "google" });

const profiles = getProfiles(wallet);
```

This would return an array of profiles like this:
```ts
[
  {
    type: "google",
    details: {
      email: "user@gmail.com",
    }
  },
  {
    type: "discord",
    details: {
      email: "user@gmail.com",
    }
  }
]
```
