---
"@thirdweb-dev/sdk": minor
---

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
