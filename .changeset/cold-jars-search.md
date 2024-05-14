---
"thirdweb": minor
---

Updated Connect Modal UI + Passkey support

- Passkey is now an auth option for `inAppWallet`
- Connect UI component UI refresh

```ts
const wallet = inAppWallet();
const hasPasskey = await hasStoredPasskey(client);
await wallet.connect({
    client,
    strategy: "passkey",
    type: hasPasskey ? "sign-in" : "sign-up",
});
```
