---
"thirdweb": patch
---

Add `onPurchaseSuccess` callback to `PayEmbed`, `ConnectButton`, `TransactionButton` and `useSendTransaction` and gets called when user completes the purchase using thirdweb pay.

```tsx
<PayEmbed
  client={client}
  payOptions={{
    onPurchaseSuccess(info) {
      console.log("purchase success", info);
    },
  }}
/>
```

```tsx
<ConnectButton
  client={client}
  detailsModal={{
    payOptions: {
      onPurchaseSuccess(info) {
        console.log("purchase success", info);
      },
    },
  }}
/>
```

```tsx
<TransactionButton
  transaction={...}
  payModal={{
    onPurchaseSuccess(info) {
      console.log("purchase success", info);
    },
  }}
>
  Some Transaction
</TransactionButton>
```

```ts
const sendTransaction = useSendTransaction({
  payModal: {
    onPurchaseSuccess(info) {
      console.log("purchase success", info);
    },
  },
});
```
