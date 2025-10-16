---
"thirdweb": minor
---

Update `onSuccess` prop on `BuyWidget`, `CheckoutWidget`, `SwapWidget`, and `BridgeWidget` components to include `statuses` and `quote` objects instead of just `quote`.

```tsx
<BuyWidget
  onSuccess={(data) => {
    console.log(data.statuses);
    console.log(data.quote);
  }}
/>
```
