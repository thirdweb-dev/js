---
"thirdweb": minor
---

**Gasless transactions in Typescript**

```ts
import { sendTransaction } from "thirdweb";

const result = sendTransaction({
  transaction,
  account,
  gasless: {
    provider: "engine",
    relayerUrl: "https://...",
    relayerForwarderAddress: "0x...",
  },
});
```

**Gasless transactions in React**

```jsx
import { useSendTransaction } from "thirdweb/react";

const { mutate } = useSendTransaction({
  gasless: {
    provider: "engine",
    relayerUrl: "https://...",
    relayerForwarderAddress: "0x...",
  },
});

// Call mutate with the transaction object
mutate(transaction);
```
