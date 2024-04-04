---
"@thirdweb-dev/react-core": patch
---

feat: introduces hooks for buyWithCrypto from v5.

Here's how you might use it in a basic swap UI.

```ts
function Component() {
  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
  const signer = useSigner();
  const [buyTxHash, setBuyTxHash] = useState<string | undefined>();
  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyTxHash ? {
    clientId: "YOUR_CLIENT_ID",
    transactionHash: buyTxHash,
  }: undefined);

  async function handleBuyWithCrypto() {
    if (!buyWithCryptoQuoteQuery.data || !signer) {
      return;
    }

    // if approval is required
    if (buyWithCryptoQuoteQuery.data.approval) {
      const approveTx = await signer.sendTransaction(buyWithCryptoQuoteQuery.data.approval);
    }

    // send the transaction to buy crypto
    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
    const buyTx = await signer.sendTransaction(buyWithCryptoQuoteQuery.data.transactionRequest);

    // set buyTx.transactionHash to poll the status of the swap transaction
    setBuyTxHash(buyTx.hash);
  }

  if (buyWithCryptoStatusQuery.data) {
    console.log('buyWithCryptoStatusQuery.data', buyWithCryptoStatusQuery.data)
  }
    return <button onClick={handleBuyWithCrypto}>Swap</button>
 }
```

For more information, check out the [pay documentation](https://portal.thirdweb.com/connect/pay/buy-with-crypto) for purchases with crypto
