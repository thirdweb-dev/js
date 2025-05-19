---
"thirdweb": minor
---

Adds Bridge.Transfer module for direct token transfers:

```typescript
import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";

const quote = await Bridge.Transfer.prepare({
  chainId: 1,
  tokenAddress: NATIVE_TOKEN_ADDRESS,
  amount: toWei("0.01"),
  sender: "0x...",
  receiver: "0x...",
  client: thirdwebClient,
});
```

This will return a quote that might look like:
```typescript
{
  originAmount: 10000026098875381n,
  destinationAmount: 10000000000000000n,
  blockNumber: 22026509n,
  timestamp: 1741730936680,
  estimatedExecutionTimeMs: 1000
  steps: [
    {
      originToken: {
        chainId: 1,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        priceUsd: 2000,
        iconUri: "https://..."
      },
      destinationToken: {
        chainId: 1,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        priceUsd: 2000,
        iconUri: "https://..."
      },
      originAmount: 10000026098875381n,
      destinationAmount: 10000000000000000n,
      estimatedExecutionTimeMs: 1000
      transactions: [
        {
          action: "approval",
          id: "0x",
          to: "0x...",
          data: "0x...",
          chainId: 1,
          type: "eip1559"
        },
        {
          action: "transfer",
          to: "0x...",
          value: 10000026098875381n,
          data: "0x...",
          chainId: 1,
          type: "eip1559"
        }
      ]
    }
  ],
  expiration: 1741730936680,
  intent: {
    chainId: 1,
    tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount: 10000000000000000n,
    sender: "0x...",
    receiver: "0x..."
  }
}
```

## Sending the transactions
The `transactions` array is a series of [ox](https://oxlib.sh) EIP-1559 transactions that must be executed one after the other in order to fulfill the complete route. There are a few things to keep in mind when executing these transactions:
 - Approvals will have the `approval` action specified. You can perform approvals with `sendAndConfirmTransaction`, then proceed to the next transaction.
 - All transactions are assumed to be executed by the `sender` address, regardless of which chain they are on. The final transaction will use the `receiver` as the recipient address.
 - If an `expiration` timestamp is provided, all transactions must be executed before that time to guarantee successful execution at the specified price.

NOTE: To get the status of each non-approval transaction, use `Bridge.status` rather than checking for transaction inclusion. This function will ensure full completion of the transfer.

You can include arbitrary data to be included on any webhooks and status responses with the `purchaseData` option:

```ts
const quote = await Bridge.Transfer.prepare({
  chainId: 1,
  tokenAddress: NATIVE_TOKEN_ADDRESS,
  amount: toWei("0.01"),
  sender: "0x...",
  receiver: "0x...",
  purchaseData: {
    reference: "payment-123",
    metadata: {
      note: "Transfer to Alice"
    }
  },
  client: thirdwebClient,
});
```

## Fees
There may be fees associated with the transfer. These fees are paid by the `feePayer` address, which defaults to the `sender` address. You can specify a different address with the `feePayer` option. If you do not specify an option or explicitly specify `sender`, the fees will be added to the input amount. If you specify the `receiver` as the fee payer the fees will be subtracted from the destination amount.

For example, if you were to request a transfer with `feePayer` set to `receiver`:
```typescript
const quote = await Bridge.Transfer.prepare({
  chainId: 1,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  amount: 100_000_000n, // 100 USDC
  sender: "0x...",
  receiver: "0x...",
  feePayer: "receiver",
  client: thirdwebClient,
});
```

The returned quote might look like:
```typescript
{
  originAmount: 100_000_000n, // 100 USDC
  destinationAmount: 99_970_000n, // 99.97 USDC
  ...
}
```

If you were to request a transfer with `feePayer` set to `sender`:
```typescript
const quote = await Bridge.Transfer.prepare({
  chainId: 1,
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  amount: 100_000_000n, // 100 USDC
  sender: "0x...",
  receiver: "0x...",
  feePayer: "sender",
  client: thirdwebClient,
});
```

The returned quote might look like:
```typescript
{
  originAmount: 100_030_000n, // 100.03 USDC
  destinationAmount: 100_000_000n, // 100 USDC
  ...
}
```
