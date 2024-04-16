---
"thirdweb": minor
---

Open "Buy Modal" UI when sending transaction using the `useSendTransaction` hook if the user does not have enough funds to execute the transaction to prompt the user to buy tokens

`useSendTransaction` now takes an optional `config` option to customize the "Buy Modal" UI

```tsx
const sendTransaction = useSendTransaction({
  buyModal: {
    locale: 'en_US',
    theme: 'light'
  }
});
```