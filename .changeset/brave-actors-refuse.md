---
"@thirdweb-dev/react-core": patch
---

Get the native token balance of a wallet address on the `activeChain` network set in the `ThirdwebProvider`

```ts
const balanceQuery = useBalanceForAddress(walletAddress);

console.log(balanceQuery.data);
```
