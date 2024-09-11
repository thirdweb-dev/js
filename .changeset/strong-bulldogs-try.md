---
"thirdweb": minor
---

Handle salt parameter for deterministic deploys of published contracts

You can now pass a salt parameter to the `deployPublishedContract` function to deploy a contract deterministically.

```ts
const address = await deployPublishedContract({
  client,
  chain,
  account,
  contractId: "Airdrop",
  contractParams: {
    defaultAdmin: "0x...",
    contractURI: "ipfs://...",
  },
  salt: "test", // <--- deterministic deploy
});
```

This also works for unpublished contracts, via the `deployContract` function.

```ts
const address = await deployContract({
  client,
  chain,
  account,
  bytecode: "0x...",
  abi: contractAbi,
  constructorParams: {
    param1: "value1",
    param2: 123,
  },
  salt: "test", // <--- deterministic deploy
});
```
