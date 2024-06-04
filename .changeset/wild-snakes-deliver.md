---
"thirdweb": minor
---

Add `overrideTxCost` option in `payModal` to override the calculated transaction cost to add support for prompting the user to buy ERC-20 tokens via Pay Modal.

```tsx
const sendTx = useSendTransaction({
  payModal: {
    // set the transaction cost as 10 USDC
    overrideTxCost: {
      value: sendUSDPolygonAmount,
      token: {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        name: "USD Coin",
        symbol: "USDC",
      },
    },
  },
});

return (
  <button
    onClick={async () => {
      await sendTx.mutateAsync({ ... });
    }}
  >
    send tx
  </button>
);
```

```tsx
<TransactionButton
  payModal={{
    overrideTxCost: {
      value: sendUSDPolygonAmount,
      token: {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        name: "USD Coin",
        symbol: "USDC",
      },
    },
  }}
  transaction={() => {...}}
>
  send tx
</TransactionButton>
```
