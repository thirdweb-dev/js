---
"thirdweb": minor
---

### "Credit Card" payment method added in thirdweb Pay for Fiat on-ramp

### `PayEmbed` component added to embed thirdweb Pay UI

```tsx
<PayEmbed
  client={client}
  style={{
    width: "360px",
  }}
/>
```

### thirdweb Pay UI customization available in `PayEmbed` and `ConnectButton`

`payOptions` prop in `PayEmbed` and `ConnectButton > detailsModal` allows you custimize :

- Enable/Disable payment methods
- Set default amount for Buy token
- Set Buy token/chain to be selected by default
- Set Source token/chain to be selected by default for Crypto payment method
- Disable editing for Buy token/chain/amount and Source token/chain

```tsx
<ConnectButton
  client={client}
  detailsModal={{
    payOptions: yourOptions,
  }}
/>

<PayEmbed
  client={client}
  detailsModal={{
    payOptions: yourOptions,
  }}
/>
```

### Fiat on-ramp functions and hooks added

- `getBuyWithFiatQuote`, `useBuyWithFiatQuote` to get a quote for buying crypto with fiat currency
- `getBuyWithFiatStatus`, `useBuyWithFiatStatus` to get status of "Buy with fiat" transaction
- `getBuyWithFiatHistory`, `useBuyWithFiatHistory` to get "Buy with fiat" transaction history
- `getPostOnRampQuote`, `usePostOnRampQuote` to get quote for swapping on-ramp token to destination token after doing on-ramp
- Add `getBuyHistory` and `useBuyHistory` to get both "Buy with Fiat" and "Buy with Crypto" transaction history in a single list
