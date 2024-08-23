---
"thirdweb": patch
---

- Pay UI now selects the fiat currency based on the user's location / timezone

- Add Japanese Yen (JPY) as a supported fiat currency for thirdweb Pay

- Added option to configure the default fiat currency for the Pay UI

Examples

```tsx
<PayEmbed
  client={client}
  payOptions={{
    buyWithFiat: {
      prefillSource: {
        currency: "CAD",
      },
    },
  }}
/>
```

```tsx
<ConnectButton
  client={client}
  detailsModal={{
    payOptions: {
      buyWithFiat: {
        prefillSource: {
          currency: "JPY",
        },
      },
    },
  }}
/>
```

```ts
const sendTransaction = useSendTransaction({
  payModal: {
    buyWithFiat: {
      prefillSource: {
        currency: "CAD",
      },
    },
  },
});
```

```tsx
<TransactionButton
  transaction={() => someTx}
  payModal={{
    buyWithFiat: {
      prefillSource: {
        currency: "CAD",
      },
    },
  }}
>
  some tx
</TransactionButton>
```
