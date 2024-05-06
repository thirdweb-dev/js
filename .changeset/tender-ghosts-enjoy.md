---
"thirdweb": patch
---

### Integrate Pay Modal with TransactionButton

By default, the Pay Modal is integrated with the `TransactionButton` component. If the user performs a transaction and does not have enough funds to execute it and if [thirdweb pay](https://portal.thirdweb.com/connect/pay/buy-with-crypto) is available for that blockchain, the Pay Modal will be displayed to allow user to buy the required amount of tokens

A new prop `payModal` is added to the `TransactionButton` component customize the Pay Modal UI or disable it entirely

Example: Disable Pay Modal

```tsx
<TransactionButton payModal={false}> Example 1 </TransactionButton>
```

Example: Customize Pay Modal UI

```tsx
<TransactionButton
  payModal={{
    theme: "light",
  }}
>
  Example 2
</TransactionButton>
```

### Disable Pay Modal for certain configurations in `useSendTransaction` hook

If `useSendTransaction` hook is passed `gasless: true` configuration or if current active wallet is a smart wallet with `sponsorGas: true` configuration - the Pay Modal will be disabled
