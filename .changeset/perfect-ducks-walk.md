---
"thirdweb": minor
---

Open "Pay Modal" UI when sending transaction using the `useSendTransaction` hook if the user does not have enough funds to execute the transaction to prompt the user to buy tokens

`useSendTransaction` now takes an optional `config` option to customize the "Pay Modal" UI

```tsx
const sendTransaction = useSendTransaction({
  payModal: {
    locale: 'en_US',
    theme: 'light'
  }
});
```

You may also explicitly disable the "Pay Modal" UI by setting the `payModal` option to `false`

```tsx
const sendTransaction = useSendTransaction({
  payModal: false
});
```