---
"@thirdweb-dev/sdk": minor
"@thirdweb-dev/react": minor
---

### TypeScript SDK

The signature of all `contract.call` methods has been updated to the following structure:

```ts
function call(functionName: string, args: any[], overrides?: CallOverrides);
```

Meaning that the following contract call in the old format:

```ts
const owner = "0x...";
const operator = "0x...";
const overrides = { gasLimit: "10000", gasPrice: "10000" };

const res = await contract.call("approve", owner, operator, overrides);
```

Would now look like this with the changes:

```ts
const owner = "0x...";
const operator = "0x...";
const overrides = { gasLimit: "10000", gasPrice: "10000" };

const res = await contract.call("approve", [owner, operator], overrides);
```

### React SDK

As a result of the above changes, usage of the `useContractRead` and `useContractWrite` hooks has also changed:

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
