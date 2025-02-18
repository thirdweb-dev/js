---
"thirdweb": patch
---

Deprecated `viemAdapter.walletClient` in favor of `viemAdapter.wallet` to take wallet instances instead of accounts

BEFORE:

```ts
import { viemAdapter } from "thirdweb/adapters/viem";

const walletClient = viemAdapter.walletClient.toViem({
  account, // Account
  chain,
  client,
});
```

AFTER:

```ts
import { viemAdapter } from "thirdweb/adapters/viem";

const walletClient = viemAdapter.wallet.toViem({
  wallet, // now pass a connected Wallet instance instead of an account
  chain,
  client,
});
```

This allows for full wallet lifecycle management with the viem adapter, including switching chains, adding chains, events and more.
