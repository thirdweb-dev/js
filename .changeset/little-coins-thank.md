---
"thirdweb": minor
---

#### Enable "Credit Card" option in Buy Screen in ConnectButton to allow users to buy crypto with credit card

By default - both "Credit Card" and "Crypto" options are enabled

You can also disable "Credit Card" or "Crypto" option in `ConnectButton` as shown below:

```tsx
<ConnectButton
  detailsModal={{
    pay: {
      buyWithCrypto: false, // disable "Crypto" option
      buyWithFiat: true, // enable "Credit Card" option only
    },
  }}
/>
```

You can also enable `testMode` for "Credit Card" option to test the Stripe onramp without doing actual payment

```tsx
<ConnectButton
  detailsModal={{
    pay: {
      buyWithFiat: {
        testMode: true,
      },
    },
  }}
/>
```

#### Add `PayEmbed` component

`PayEmbed` components allows embedding thirdweb pay UI directly in your app to allow users to buy tokens using other tokens or with credit card.

```tsx
<PayEmbed
  client={client}
  style={{
    width: "360px",
  }}
/>
```

#### Add Fiat onramp APIs `getBuyWithFiatQuote`, `getBuyWithFiatStatus`, `getBuyWithFiatHistory` and `getPostOnRampQuote` and their hook versions `useBuyWithFiatQuote`, `useBuyWithFiatStatus`, `useBuyWithFiatHistory`

#### Add `getBuyHistory` and `useBuyHistory` API to get both "Buy with Fiat" and "Buy with Crypto" transaction history in a single list
