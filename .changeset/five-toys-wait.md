---
"thirdweb": minor
---

`useAdminWallet()` Hook + automatically auth when using inapp + smart accounts

### Add `useAdminWallet()` hook to get the admin wallet for a smart wallet

```ts
const activeWallet = useActiveWallet(); // smart wallet
const adminWallet = useAdminWallet(); // the personal wallet that controls the smart wallet
```

### Automatically auth when using inapp + smart accounts

When using auth with an inapp + smart wallet, ConnectButton and ConnectEmebed will automatically auth without having to click sign in.
