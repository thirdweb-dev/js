---
"thirdweb": minor
---

First party support for zkSync native account abstraction

You can now use smart accounts on zkSync and zkSync sepolia without any extra setup.

```ts
const wallet = smartWallet({
  chain: zkSync,
  sponsorGas: true,
});

const smartAccount = await wallet.connect({
  client,
  personalAccount,
});

// now your can perform transactions normally, gas will be sponsored
sendTransaction({ transaction, account: smartAccount });
```
