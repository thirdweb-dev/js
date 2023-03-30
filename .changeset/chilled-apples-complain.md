---
"@thirdweb-dev/react-core": minor
---

Usage of the `useContractRead` and `useContractWrite` hooks has changed:

```js
const owner = "0x...";
const operator = "0x...";
const overrides = { gasLimit: "10000", gasPrice: "10000" };

// Old usage
const { data } = useContractRead(
  contract,
  "approve",
  owner,
  operator,
  overrides,
);

const { mutateAsync } = useContractWrite(contract, "approve");
mutateAsync(owner, operator, overrides);

// New usage
const { data } = useContractRead(
  contract,
  "approve",
  [owner, operator],
  overrides,
);

const { mutateAsync } = useContractWrite(contract, "approve");
mutateAsync([owner, operator], overrides);
```
