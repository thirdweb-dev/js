---
"thirdweb": minor
---

Breaking Change in `deployPublishedContract`

Contract constructor/ initializer params are now passed as a single object instead of an array. The object should have the same shape as the params defined in the contract's ABI.

Example of old way (using `constructorParams` or `initializeParams`):

```ts
const address = await deployPublishedContract({
  account,
  chain,
  client,
  contractId: "Airdrop",
  contractParams: [TEST_ACCOUNT_A.address, ""],
});
```

New way (using `contractParams`):

```ts
const address = await deployPublishedContract({
  account,
  chain,
  client,
  contractId: "Airdrop",
  contractParams: {
    defaultAdmin: TEST_ACCOUNT_A.address,
    contractURI: "",
  },
});
```
