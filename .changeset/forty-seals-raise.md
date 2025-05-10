---
"thirdweb": minor
---

Breaking change: EIP-5792 support

We've significantly improved our EIP-5792 apis, which come with some breaking changes:

### New Functions Added

1. **`useSendAndConfirmCalls`**

   - Description: Hook to send and wait for confirmation of EIP-5792 calls
   - Returns: React Query mutation object with transaction receipts
   - Example:

   ```tsx
   const { mutate: sendAndConfirmCalls, data: result } =
     useSendAndConfirmCalls();
   await sendAndConfirmCalls({
     client,
     calls: [tx1, tx2],
   });
   console.log("Transaction hash:", result.receipts?.[0]?.transactionHash);
   ```

2. **`useWaitForCallsReceipt`**
   - Description: Hook to wait for the receipt of EIP-5792 calls, perfect for splitting submitting the call and waiting for receipt
   - Returns: React Query object with call receipts
   - Example:
   ```tsx
   const { mutate: sendCalls, data: result } = useSendCalls();
   const { data: receipt, isLoading } = useWaitForCallsReceipt(result);
   ```

### Breaking Changes

#### `useSendCalls` Changes

**Before**

```tsx
// mutation returns id a string
const sendCalls = useSendCalls({ client });
```

**After**

```tsx
// no longer needs client
// mutation returns an object with id
const sendCalls = useSendCalls();
```

Waiting for call receipts is now done separately, via the `useWaitForCallsReceipt`.

**Before**

```tsx
const { mutate: sendCalls, data: receipt } = useSendCalls({
  client,
  waitForBundle: true,
});
```

**After**

```tsx
const { mutate: sendCalls, data: result } = useSendCalls();
const { data: receipt, isLoading } = useWaitForCallsReceipt(result);
```

You can also use the helper `useSendAndConfirmCalls` to combine both submitting and waiting for confirmation.

```tsx
const { mutate: sendAndConfirmCalls, data: receipt } = useSendAndConfirmCalls();
```

#### `sendCalls` Changes

**Before**:

```tsx
// Old output type
type SendCallsResult = string;
```

**After**:

```tsx
// New output type
type SendCallsResult = {
  id: string;
  client: ThirdwebClient;
  chain: Chain;
  wallet: Wallet;
};
```
