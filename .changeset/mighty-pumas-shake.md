---
"thirdweb": minor
---

Exports toSerializableTransaction to convert preparedTransaction into a fully serializable transaction

### Usage

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
