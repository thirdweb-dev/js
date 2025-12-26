---
"@workspace/dashboard": patch
"@workspace/portal": patch
---

[Dashboard] Add transaction hash to checkout widget iframe success/failed events

The checkout widget iframe now returns transaction hashes in both success and error events via postMessage. This allows developers to track on-chain transactions associated with payments made through the widget.

**Success Event:**
```js
{
  source: "checkout-widget",
  type: "success",
  transactions: [
    { chainId: 8453, transactionHash: "0x..." }
  ]
}
```

**Error Event:**
```js
{
  source: "checkout-widget",
  type: "error",
  message: "Error message",
  transactions: [
    { chainId: 8453, transactionHash: "0x..." }
  ]
}
```

The transactions array contains all on-chain transactions that were executed as part of the payment flow, including any cross-chain swaps or transfers.
