---
"thirdweb": minor
---

Add feePayer option for direct_payment mode of PayEmbed

For direct payments via the PayEmbed, you can now specify the payer of the protocol fee for direct transfers. Can be "sender" or "receiver", defaults to "sender".

```ts
<PayEmbed
        client={THIRDWEB_CLIENT}
        payOptions={{
          mode: "direct_payment",
          paymentInfo: {
            amount: "2",
            chain: base,
            token: getDefaultToken(base, "USDC"),
            sellerAddress: "0x...",
            feePayer: "receiver", // <-- transfer fee paid by the receiver
          },
          metadata: {
            name: "Black Hoodie (Size L)",
            image: "/drip-hoodie.png",
          },
        }}
      />
```
