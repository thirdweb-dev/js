---
"@thirdweb-dev/sdk": minor
---

[SDK] Implement sharded merkle trees for lightweight allowlist checks

**Behavior change**

We've made allowlists much more performant using sharded merkle trees. This allows us to process large allowlists (1M+) efficiently.

To support those large allowlists, fetching claim conditions does not fetch the allowlist data by default anymore. Instead, you can pass an options object to additionally fetch the allowlist data along with the rest of the claim conditions data.

This affects `ClaimConditions.getActive()` and `ClaimConditions.getAll()`

Examples:

```ts
const activeClaimCondition = await contract.erc721.claimConditions.getActive();
// `activeClaimCondition.snapshot` is undefined
const activeclaimConditionWithtAllowList =
  await contract.erc721.claimConditions.getActive({
    withAllowList: true,
  });
// `activeClaimCondition.snapshot` returns the allowlist data
```
