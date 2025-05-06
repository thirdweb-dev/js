---
"thirdweb": patch
---

Adds the `maxSteps` option to Buy.quote, Buy.prepare, Sell.quote, and Sell.prepare functions. This allows users to limit quotes to routes with a specific number of steps or fewer. For example:

```ts
const quote = await bridge.Buy.quote({
  originChainId: 1,
  originTokenAddress: "0x...",
  destinationChainId: 137,
  destinationTokenAddress: "0x...",
  amount: 1000000n,
  maxSteps: 2
});

const preparedQuote = await bridge.Buy.prepare({
  originChainId: 1,
  originTokenAddress: "0x...",
  destinationChainId: 137,
  destinationTokenAddress: "0x...",
  amount: 1000000n,
  sender: "0x...",
  receiver: "0x...",
  maxSteps: 2
});

const quote = await bridge.Sell.quote({
  originChainId: 1,
  originTokenAddress: "0x...",
  destinationChainId: 137,
  destinationTokenAddress: "0x...",
  amount: 1000000n,
  maxSteps: 3
});

const preparedQuote = await bridge.Sell.prepare({
  originChainId: 1,
  originTokenAddress: "0x...",
  destinationChainId: 137,
  destinationTokenAddress: "0x...",
  amount: 1000000n,
  sender: "0x...",
  receiver: "0x...",
  maxSteps: 3
});
```
