---
"thirdweb": minor
---

Introducing `engineAccount()` for backend usage

You can now use `engineAccount()` on the backend to create an account that can send transactions via your engine instance.

This lets you use the full catalog of thirdweb SDK functions and extensions on the backend, with the performance, reliability, and monitoring of your engine instance.

```ts
// get your engine url, auth token, and wallet address from your engine instance on the dashboard
const engine = engineAccount({
  engineUrl: process.env.ENGINE_URL,
  authToken: process.env.ENGINE_AUTH_TOKEN,
  walletAddress: process.env.ENGINE_WALLET_ADDRESS,
});

// Now you can use engineAcc to send transactions, deploy contracts, etc.
// For example, you can prepare extension functions:
const tx = await claimTo({
  contract: getContract({ client, chain, address: "0x..." }),
  to: "0x...",
  tokenId: 0n,
  quantity: 1n,
});

// And then send the transaction via engine
// this will automatically wait for the transaction to be mined and return the transaction hash
const result = await sendTransaction({
  account: engine, // forward the transaction to your engine instance
  transaction: tx,
});

console.log(result.transactionHash);
```
