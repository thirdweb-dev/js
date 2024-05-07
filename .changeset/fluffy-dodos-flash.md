---
"thirdweb": patch
---

Adds extraGas override to transactions. Useful when gas estimates are faulty or to ensure a transaction goes through.

## Usage

```ts
const transaction = prepareTransaction({
  to: "0x1234567890123456789012345678901234567890",
  chain: ethereum,
  client: thirdwebClient,
  value: toWei("1.0"),
  gasPrice: 30n,
  extraGas: 50_000n,
});
```
