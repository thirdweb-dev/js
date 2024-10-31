---
"thirdweb": patch
---

Add support for custom singlePhase drops

If you are using a custom drop contract, you can now set claim conditions and claim by passing the `singlePhaseDrop` option to the `setClaimConditions` and `claimTo` functions.

```ts
setClaimConditions({
  contract,
  phases: [
    {
      startTime: new Date(0),
      maxClaimableSupply: 10n,
    },
  ],
  tokenId: 0n,
  singlePhaseDrop: true, // <--- for custom drop contracts
});
```
