---
"thirdweb": patch
---

Update the `onSuccess`, `onError`, and `onCancel` callback props of the `BuyWidget` to be called with the `quote` object

```tsx
<BuyWidget
  onSuccess={(quote) => console.log("Swap completed:", quote)}
  onError={(error, quote) => console.error("Swap failed:", error, quote)}
  onCancel={(quote) => console.log("Swap cancelled:", quote)}
/>
```
