---
"thirdweb": minor
---

New PayEmbed modes and revamp TransactionButton flow

You can now configure the PayEmbed component to build 3 different flows:

- Fund wallets: Inline component that allows users to buy any currency. (default)

```tsx
<PayEmbed
  client={client}
  payOptions={{
    mode: "fund_wallet",
  }}
/>
```

- Direct payments: Take payments from Fiat or Crypto directly to your seller wallet.

```tsx
<PayEmbed
  client={client}
  payOptions={{
    mode: "direct_payment",
    paymentInfo: {
      sellerAddress: "0x...",
      chain: base,
      amount: "0.1",
    },
    metadata: {
      name: "Black Hoodie (Size L)",
      image: "https://example.com/image.png",
    },
  }}
/>
```

- Transaction payments: Let your users pay for onchain transactions with fiat or crypto on any chain.

```tsx
<PayEmbed
  client={client}
  payOptions={{
    mode: "transaction",
    transaction: claimTo({
      contract,
      tokenId: 0n,
      to: toAddress,
    }),
    metadata: nft?.metadata,
  }}
/>
```

You can also configure the TransactionButton component to show metadata to personalize the transaction payment flow:

```tsx
<TransactionButton
  transaction={() => {
    return transfer({
      contract,
      amount: 10n,
      to: toAddress,
    });
  }}
  payModal={{
    metadata: {
      name: "Buy me a coffee",
      image: "https://example.com/image.png",
    },
  }}
/>
```
