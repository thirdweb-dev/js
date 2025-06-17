---
"thirdweb": minor
---

Adds new components BuyWidget, CheckoutWidget, and TransactionWidget

## BuyWidget
A component that allows users to purchase tokens or NFTs directly within your application.

### Example:
```tsx
import { BuyWidget } from "thirdweb/react";

function App() {
  return (
    <BuyWidget
      client={client}
      chain={chain}
      tokenAddress="0x..." // Token or NFT contract address
      recipient="0x..." // Optional: recipient address
      theme="light" // Optional: "light" or "dark"
    />
  );
}
```

## CheckoutWidget
A comprehensive checkout experience for purchasing digital assets with multiple payment options.

### Example:
```tsx
import { CheckoutWidget } from "thirdweb/react";

function App() {
  return (
    <CheckoutWidget
      client={client}
      chain={chain}
      items={[
        {
          tokenAddress: "0x...",
          tokenId: "1", // For NFTs
          quantity: "1"
        }
      ]}
      onSuccess={(result) => console.log("Purchase successful:", result)}
      theme="dark" // Optional: "light" or "dark"
    />
  );
}
```

## TransactionWidget
A widget for executing arbitrary blockchain transactions with a user-friendly interface.

### Example:
```tsx
import { TransactionWidget } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";

function App() {
  const transaction = prepareContractCall({
    contract: myContract,
    method: "transfer",
    params: [recipientAddress, amount]
  });

  return (
    <TransactionWidget
      client={client}
      transaction={transaction}
      onSuccess={(result) => console.log("Transaction successful:", result)}
      onError={(error) => console.error("Transaction failed:", error)}
      theme="light" // Optional: "light" or "dark"
    />
  );
}
```
