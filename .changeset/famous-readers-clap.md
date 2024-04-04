---
"@thirdweb-dev/sdk": patch
---

feat: add purchase with crypto from v5

Here's how you might use it:

```ts
// get a quote between two tokens
const quote = await getBuyWithCryptoQuote(quoteParams);
// if approval is required, send the approval transaction
if (quote.approval) {
  const response = await signer.sendTransaction(quote.approval);
}
// send the quoted transaction
const transactionResult = await signer.sendTransaction(
  quote.transactionRequest,
);
// keep polling the status of the quoted transaction until it * returns a success or failure status
const status = await getBuyWithCryptoStatus({
  clientId: "YOUR_CLIENT_ID",
  transactionHash: transactionResult.hash,
});
```

For more information, check out the [pay documentation](https://portal.thirdweb.com/connect/pay/buy-with-crypto) for purchases with crypto
