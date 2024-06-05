---
"thirdweb": minor
---

Add `valueERC20` option in `PreparedTransaction` object to specify the transaction cost in ERC20 tokens to allow opening the Pay Modal for ERC20 tokens if user does not have specified ERC20 tokens.

```tsx
const sendTx = useSendTransaction();

return (
  <button
    onClick={async () => {
      const someTx = { ... };

      // declare that transaction cost is 10 USDC
      someTx.valueERC20 = {
        amount: "10",
        tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      };

      await sendTx.mutateAsync(someTx);
    }}
  >
    send tx
  </button>
);
```

```tsx
<TransactionButton
  transaction={() => {
    const someTx = {...};

    // declare that transaction cost is 10 USDC
    someTx.valueERC20 = {
      amount: "10",
      tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    };

    return someTx;
  }}
>
  send tx
</TransactionButton>
```
