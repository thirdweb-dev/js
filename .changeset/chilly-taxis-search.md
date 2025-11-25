---
"thirdweb": minor
---

Add "upto" payment scheme option for x402 verify and settle

```typescript
const paymentArgs = {
  resourceUrl: "https://api.example.com/premium-content",
  method: "GET",
  paymentData,
  payTo: "0x1234567890123456789012345678901234567890",
  network: arbitrum,
  scheme: "upto", // enables dynamic pricing
  price: "$0.10", // max payable amount
  facilitator: thirdwebFacilitator,
};

// First verify the payment is valid for the max amount
const verifyResult = await verifyPayment(paymentArgs);

if (verifyResult.status !== 200) {
  return Response.json(verifyResult.responseBody, {
    status: verifyResult.status,
    headers: verifyResult.responseHeaders,
  });
}

// Do the expensive work that requires payment
const { tokensUsed } = await doExpensiveWork();
const pricePerTokenUsed = 0.00001;

// Now settle the payment based on actual usage
const settleResult = await settlePayment({
  ...paymentArgs,
  price: tokensUsed * pricePerTokenUsed, // adjust final price based on usage
});
```
