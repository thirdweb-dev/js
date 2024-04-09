---
"@thirdweb-dev/react-core": minor
---

Adds "buy with crypto" Hooks, Here's an example of how you can use it to build a UI for Swapping tokens

```tsx
function Component() {
  const signer = useSigner();
  // step 1: get a quote for swapping tokens
  const quoteQuery = useBuyWithCryptoQuote(swapParams);

  const [buyTxHash, setBuyTxHash] = useState<string | undefined>();
  const statusQuery = useBuyWithCryptoStatus(
    buyTxHash
      ? {
          clientId: "YOUR_CLIENT_ID",
          transactionHash: buyTxHash,
        }
      : undefined,
  );

  async function handleBuyWithCrypto() {
    if (!quoteQuery.data || !signer) {
      return;
    }

    // if approval is required
    if (quoteQuery.data.approval) {
      const approveTx = await signer.sendTransaction(quoteQuery.data.approval);
      await approveTx.wait();
    }

    // send the transaction to buy crypto
    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
    const buyTx = await signer.sendTransaction(
      quoteQuery.data.transactionRequest,
    );
    await buyTx.wait();

    // set buyTx.transactionHash to poll the status of the swap transaction
    setBuyTxHash(buyTx.hash);
  }

  if (statusQuery.data) {
    console.log("swap status:", statusQuery.data);
  }

  return <button onClick={handleBuyWithCrypto}>Swap</button>;
}
```

For more information, check out the [pay documentation](https://portal.thirdweb.com/connect/pay/buy-with-crypto) for purchases with crypto
