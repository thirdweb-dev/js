# Checkout Widget iframe - Transaction Hash Feature

## Summary
Added transaction hash information to the checkout widget iframe's success and error events. This allows developers to track on-chain transactions associated with payments made through the widget.

## Changes Made

### 1. Updated CheckoutWidgetEmbed Component
**File:** `apps/dashboard/src/app/bridge/checkout-widget/CheckoutWidgetEmbed.client.tsx`

#### Success Event Handler
- Extracts transaction hashes from the `data.statuses` array returned by the `CheckoutWidget` component
- Each status contains a `transactions` array with `chainId` and `transactionHash` fields
- Sends the transaction data to the parent window via `postMessage`

```typescript
onSuccess={(data) => {
  const transactionHashes = data.statuses.flatMap((status) => {
    return status.transactions.map((tx) => ({
      chainId: tx.chainId,
      transactionHash: tx.transactionHash,
    }));
  });

  sendMessageToParent({
    source: "checkout-widget",
    type: "success",
    transactions: transactionHashes,
  });
}}
```

#### Error Event Handler
- Extracts transaction hashes from the `quote.steps` if available
- This captures any partial transactions that may have occurred before the error
- Useful for debugging and tracking failed payment attempts

```typescript
onError={(error, quote) => {
  const transactionHashes =
    quote?.steps?.flatMap((step) => {
      return (
        step.transactions?.map((tx) => ({
          chainId: tx.chainId,
          transactionHash: tx.transactionHash,
        })) || []
      );
    }) || [];

  sendMessageToParent({
    source: "checkout-widget",
    type: "error",
    message: error.message,
    transactions: transactionHashes,
  });
}}
```

### 2. Updated Documentation
**File:** `apps/portal/src/app/bridge/checkout-widget/iframe/page.mdx`

- Added examples showing how to access transaction hashes from both success and error events
- Included comments explaining the structure of the transactions array
- Noted that error events may contain partial transaction data

### 3. Created Example HTML File
**File:** `apps/dashboard/src/app/bridge/checkout-widget/TRANSACTION_HASH_EXAMPLE.html`

- Demonstrates a complete working example of the iframe integration
- Shows real-time event logging with transaction hash display
- Includes example code for sending transaction data to a backend API

### 4. Added Changeset
**File:** `.changeset/checkout-widget-transaction-hash.md`

- Documents the change for the release notes
- Includes example event structures for both success and error cases

## Event Structure

### Success Event
```javascript
{
  source: "checkout-widget",
  type: "success",
  transactions: [
    {
      chainId: 8453,
      transactionHash: "0x1234567890abcdef..."
    },
    // ... more transactions if cross-chain
  ]
}
```

### Error Event
```javascript
{
  source: "checkout-widget",
  type: "error",
  message: "Payment failed",
  transactions: [
    {
      chainId: 8453,
      transactionHash: "0x1234567890abcdef..."
    },
    // ... partial transactions if any
  ]
}
```

## Use Cases

1. **Transaction Tracking**: Store transaction hashes in your database for order fulfillment and customer support
2. **Analytics**: Track payment success rates and analyze failed transactions
3. **Webhooks**: Send transaction data to third-party services for order processing
4. **Customer Notifications**: Include transaction links in confirmation emails
5. **Debugging**: Investigate failed payments by examining partial transaction data

## Technical Details

### Data Source
The transaction hashes come from two sources:

1. **Success Events**: From `CompletedStatusResult[]` which includes:
   - `Status` type (for buy/sell/transfer operations)
   - `OnrampStatus.Result` type (for fiat onramp operations)

2. **Error Events**: From `BridgePrepareResult.steps[].transactions[]` which contains:
   - Prepared transaction data from the quote
   - May include transactions that were executed before the error occurred

### Type Safety
The implementation uses TypeScript types from the thirdweb SDK:
- `CompletedStatusResult` - Union type for completed statuses
- `Status` - Bridge status with transaction details
- `OnrampStatus.Result` - Onramp status with transaction details
- `BridgePrepareResult` - Quote preparation result with steps

## Testing
To test the changes:

1. Open `TRANSACTION_HASH_EXAMPLE.html` in a browser
2. Complete a payment through the widget
3. Observe the transaction hashes in the events log
4. Test error scenarios by using invalid payment methods or insufficient funds

## Related Issues
- Addresses request from Slack thread in #engineering channel
- Requested by Yash Joisar on 12/22/2025
- Follows the pattern established by the bridge widget iframe
