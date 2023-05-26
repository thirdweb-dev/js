---
"@thirdweb-dev/react-core": patch
---

Return wallet instance from `useConnect` hook instead of returning nothing

```diff
const connect = useConnect();

- await connect(walletConfig)
+ const walletInstance = await connect(walletConfig)
```
