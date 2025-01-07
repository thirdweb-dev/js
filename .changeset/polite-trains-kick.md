---
"thirdweb": minor
---

Feature: Adds `deploySmartAccount` function to force the deployment of a smart account.

```ts
const account = await deploySmartAccount({
  smartAccount,
  chain,
  client,
  accountContract,
});
```

Fix: Uses 1271 signatures if the smart account is already deployed.
