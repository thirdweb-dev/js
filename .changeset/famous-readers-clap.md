---
"@thirdweb-dev/sdk": patch
---

Adds "buy with crypto" APIs, Here's an example of how you can use it for swapping tokens

```ts
// 1. get a quote for swapping tokens
const quote = await getBuyWithCryptoQuote(quoteParams);

// 2. if approval is required, send the approval transaction
if (quote.approval) {
  const approvalTx = await signer.sendTransaction(quote.approval);
  await approvalTx.wait();
}

// 3. send the quoted transaction
const buyTx = await signer.sendTransaction(quote.transactionRequest);
await buyTx.wait();

// 4. keep polling the status of the quoted transaction until it * returns a success or failure status
const status = await getBuyWithCryptoStatus({
  clientId: "YOUR_CLIENT_ID",
  transactionHash: transactionResult.hash,
});
```

For more information, check out the [pay documentation](https://portal.thirdweb.com/connect/pay/buy-with-crypto) for purchases with crypto
