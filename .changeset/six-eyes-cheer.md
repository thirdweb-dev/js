---
"thirdweb": minor
---

Adds EIP-5792 react hooks

## `useSendCalls`

`useSendCalls` will automatically revalidate all reads from contracts that are interacted with.

```tsx
import { useSendCalls } from "thirdweb/react";

const sendTx1 = approve({
  contract: USDT_CONTRACT,
  amount: 100,
  spender: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
});
const sendTx2 = approve({
  contract: USDT_CONTRACT,
  amount: 100,
  spender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
});
const { mutate: sendCalls, data: bundleId } = useSendCalls({ client });
await sendCalls({
  wallet,
  client,
  calls: [sendTx1, sendTx2],
});
```

Await the bundle's full confirmation:

```tsx
const { mutate: sendCalls, data: bundleId } = useSendCalls({
  client,
  waitForResult: true,
});
await sendCalls({
  wallet,
  client,
  calls: [sendTx1, sendTx2],
});
```

Sponsor transactions with a paymaster:

```ts
const { mutate: sendCalls, data: bundleId } = useSendCalls();
await sendCalls({
  client,
  calls: [sendTx1, sendTx2],
  capabilities: {
    paymasterService: {
      url: `https://${CHAIN.id}.bundler.thirdweb.com/${client.clientId}`,
    },
  },
});
```

## `useCapabilities`

```tsx
import { useCapabilities } from "thirdweb/react";
const { data: capabilities, isLoading } = useCapabilities();
```

## `useCallsStatus`

```tsx
import { useCallsStatus } from "thirdweb/react";
const { data: status, isLoading } = useCallsStatus({ bundleId, client });
```
