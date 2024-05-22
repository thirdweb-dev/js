---
"thirdweb": minor
---

Adds `unstyled` prop to `TransactionButton` to remove default styles

```tsx
<TransactionButton
  transaction={() => {}}
  onSuccess={handleSuccess}
  onError={handleError}
  unstyled
  className="bg-white text-black rounded-md p-4 flex items-center justify-center"
>
  Confirm Transaction
</TransactionButton>
```
