---
"thirdweb": minor
---

Adds a new `Bridge` module to the thirdweb SDK to access the Universal Bridge.

## Features

### Buy & Sell Operations

The Bridge module makes it easy to buy and sell tokens across chains:

- `Bridge.Buy` - For specifying the destination amount you want to receive
- `Bridge.Sell` - For specifying the origin amount you want to send

Each operation provides two functions:
1. `quote` - Get an estimate without connecting a wallet
2. `prepare` - Get a finalized quote with transaction data

#### Buy Example

```typescript
import { Bridge, toWei, NATIVE_TOKEN_ADDRESS } from "thirdweb";

// First, get a quote to see approximately how much you'll pay
const buyQuote = await Bridge.Buy.quote({
  originChainId: 1, // Ethereum
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  destinationChainId: 10, // Optimism
  destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
  buyAmountWei: toWei("0.01"), // I want to receive 0.01 ETH on Optimism
  client: thirdwebClient,
});

console.log(`To get ${buyQuote.destinationAmount} wei on destination chain, you need to pay ${buyQuote.originAmount} wei`);

// When ready to execute, prepare the transaction
const preparedBuy = await Bridge.Buy.prepare({
  originChainId: 1,
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  destinationChainId: 10,
  destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
  buyAmountWei: toWei("0.01"),
  sender: "0x...", // Your wallet address
  receiver: "0x...", // Recipient address (can be the same as sender)
  client: thirdwebClient,
});

// The prepared quote contains the transactions you need to execute
console.log(`Transactions to execute: ${preparedBuy.transactions.length}`);
```

#### Sell Example

```typescript
import { Bridge, toWei } from "thirdweb";

// First, get a quote to see approximately how much you'll receive
const sellQuote = await Bridge.Sell.quote({
  originChainId: 1, // Ethereum
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  destinationChainId: 10, // Optimism
  destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
  sellAmountWei: toWei("0.01"), // I want to sell 0.01 ETH from Ethereum
  client: thirdwebClient,
});

console.log(`If you send ${sellQuote.originAmount} wei, you'll receive approximately ${sellQuote.destinationAmount} wei`);

// When ready to execute, prepare the transaction
const preparedSell = await Bridge.Sell.prepare({
  originChainId: 1,
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  destinationChainId: 10,
  destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
  sellAmountWei: toWei("0.01"),
  sender: "0x...", // Your wallet address
  receiver: "0x...", // Recipient address (can be the same as sender)
  client: thirdwebClient,
});

// Execute the transactions in sequence
for (const tx of preparedSell.transactions) {
  // Send the transaction using your wallet
  // Wait for it to be mined
}
```

### Bridge Routes

You can discover available bridge routes using the `routes` function:

```typescript
import { Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";

// Get all available routes
const allRoutes = await Bridge.routes({
  client: thirdwebClient,
});

// Filter routes for a specific token or chain
const filteredRoutes = await Bridge.routes({
  originChainId: 1, // From Ethereum
  originTokenAddress: NATIVE_TOKEN_ADDRESS,
  destinationChainId: 10, // To Optimism
  client: thirdwebClient,
});

// Paginate through routes
const paginatedRoutes = await Bridge.routes({
  limit: 10,
  offset: 0,
  client: thirdwebClient,
});
```

### Bridge Transaction Status

After executing bridge transactions, you can check their status:

```typescript
import { Bridge } from "thirdweb";

// Check the status of a bridge transaction
const bridgeStatus = await Bridge.status({
  transactionHash: "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
  chainId: 8453, // The chain ID where the transaction was initiated
  client: thirdwebClient,
});

// The status will be one of: "COMPLETED", "PENDING", "FAILED", or "NOT_FOUND"
if (bridgeStatus.status === "completed") {
  console.log(`
    Bridge completed!
    Sent: ${bridgeStatus.originAmount} wei on chain ${bridgeStatus.originChainId}
    Received: ${bridgeStatus.destinationAmount} wei on chain ${bridgeStatus.destinationChainId}
  `);
} else if (bridgeStatus.status === "pending") {
  console.log("Bridge transaction is still pending...");
} else {
  console.log("Bridge transaction failed");
}
```

## Error Handling

The Bridge module provides consistent error handling with descriptive error messages:

```typescript
try {
  await Bridge.Buy.quote({
    // ...params
  });
} catch (error) {
  // Errors will have the format: "ErrorCode | Error message details"
  console.error(error.message); // e.g. "AmountTooHigh | The provided amount is too high for the requested route."
}
```

## Types

The Bridge module exports the following TypeScript types:

- `Route` - Describes a bridge route between chains and tokens
- `Status` - Represents the status of a bridge transaction
- `Quote` - Contains quote information for a bridge transaction
- `PreparedQuote` - Extends Quote with transaction data

## Integration

The Bridge module is accessible as a top-level export:

```typescript
import { Bridge } from "thirdweb";
```

Use `Bridge.Buy`, `Bridge.Sell`, `Bridge.routes`, and `Bridge.status` to access the corresponding functionality.
