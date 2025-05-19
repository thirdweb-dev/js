---
"thirdweb": patch
---

Added Bridge.Onramp.prepare and Bridge.Onramp.status functions

## Bridge.Onramp.prepare

Prepares an onramp transaction, returning a link from the specified provider to onramp to the specified token.

```typescript
import { Bridge } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { NATIVE_TOKEN_ADDRESS, toWei } from "thirdweb/utils";

const preparedOnramp = await Bridge.Onramp.prepare({
  client: thirdwebClient,
  onramp: "stripe",
  chainId: ethereum.id,
  tokenAddress: NATIVE_TOKEN_ADDRESS,
  receiver: "0x...", // receiver's address
  amount: toWei("10"), // 10 of the destination token
  // Optional params:
  // sender: "0x...", // sender's address
  // onrampTokenAddress: NATIVE_TOKEN_ADDRESS, // token to initially onramp to
  // onrampChainId: 1, // chain to initially onramp to
  // currency: "USD",
  // maxSteps: 2,
  // purchaseData: { customId: "123" }
});

console.log(preparedOnramp.link); // URL to redirect the user to
console.log(preparedOnramp.currencyAmount); // Price in fiat currency
```

## Bridge.Onramp.status

Retrieves the status of an Onramp session created via Bridge.Onramp.prepare.

```typescript
import { Bridge } from "thirdweb";

const onrampStatus = await Bridge.Onramp.status({
  id: "022218cc-96af-4291-b90c-dadcb47571ec",
  client: thirdwebClient,
});

// Possible results:
// {
//   status: "CREATED",
//   transactions: [],
//   purchaseData: {
//     orderId: "abc-123",
//   },
// }
//
// or
// {
//   status: "PENDING",
//   transactions: [],
//   purchaseData: {
//     orderId: "abc-123",
//   },
// }
//
// or
// {
//   status: "COMPLETED",
//   transactions: [
//     {
//       chainId: 1,
//       transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
//     },
//   ],
//   purchaseData: {
//     orderId: "abc-123",
//   },
// }
```
