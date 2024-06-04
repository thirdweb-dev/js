---
"thirdweb": minor
---

Exports toSerializableTransaction to convert preparedTransaction into a fully serializable transaction.
Exports estimateGasCost to estimate the gas cost of a transaction in ether and wei.
Exports getGasPrice to get the currect gas price for a chain.

### `toSerializableTransaction`

```ts
import { prepareTransaction, toSerializableTransaction } from "thirdweb";

const transaction = await prepareTransaction({
  transaction: {
    to: "0x...",
    value: 100,
  },
});
const serializableTransaction = await toSerializableTransaction({
  transaction,
});

account.sendTransaction(serializableTransaction);
```

### `estimateGasCost`

```ts
import { estimateGasCost } from "thirdweb";

const gasCost = await estimateGasCost({ transaction });
```

### `getGasPrice`

```ts
import { getGasPrice } from "thirdweb";

const gasPrice = await getGasPrice({ client, chain });
```
