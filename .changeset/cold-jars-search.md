---
"thirdweb": minor
---

Updated Connect Modal UI + Passkey support

- Passkey is now an auth option for `inAppWallet`
- Connect UI component UI refresh

```ts
const wallet = inAppWallet();
let type;
if(hasStoredPasskey(client)) {
  // sign in with las used passkey
  type = "sign-in";
} else {
  // sign-up with new passkey
  type = "sign-up";
}

await wallet.connect({
    client,
    strategy: "passkey",
    type,
});
```
