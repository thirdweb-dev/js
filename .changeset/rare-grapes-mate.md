---
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/react": patch
"@thirdweb-dev/react-native": patch
---

<br />
### New Hooks

<details>
<summary>
<code>useWatchTransactions()</code> - watch for transactions on the blockchain (real-time)
</summary>
<br />

**Example:** Listen to all transactions on USD Coin (USDC) contract address.

```jsx
import { useWatchTransactions } from "@thirdweb-dev/react";

const MyComponent = () => {
  const transactions = useWatchTransactions({
    network: "ethereum",
    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  });

  if (!transactions.length) {
    return <div>No transactions, yet.</div>;
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.hash}>
          <div>Hash: {transaction.hash}</div>
          <div>From: {transaction.from}</div>
          <div>To: {transaction.to}</div>
          <div>Value: {transaction.value}</div>
        </div>
      ))}
    </div>
  );
};
```

> **Note**
>
> This hook is available in `@thirdweb-dev/react`, `@thirdweb-dev/react-native` and `@thirdweb-dev/react-core` packages, the usage is the same. (The only difference is the import path.)

</details>
