---
"thirdweb": minor
---

Adds the useWalletBalance hook. The hook will default to the native token balance if no `tokenAddress` is provided.

### Usage

```ts
import { useWalletBalance } from "thirdweb/react";

const { data, isLoading, isError } = useWalletBalance({
  chain: walletChain,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  address: activeAccount?.address,
  client,
});
```
