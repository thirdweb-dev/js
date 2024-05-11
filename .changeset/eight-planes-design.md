---
"thirdweb": minor
---

Adds basic EIP-5792 support for wallets with functions `getCapabilities`, `sendCalls`, `showCallsStatus`, `getCallsStatus`.

## Example Usage

### `getCapabilities`

Returns the capabilities of the wallet according to EIP-5792.

```ts
const capabilities = await getCapabilities({ wallet });
```

### `sendCalls`

Sends the given calls to the wallet for execution, and attempts to fallback to normal execution if the wallet does not support EIP-5792.

```ts
const bundleId = await sendCalls({
   wallet,
   client,
   calls: [{ to: ..., value: ... }, { to: ..., value: ... }],
});
```

### `showCallsStatus`

Requests the wallet to show the status of a given bundle ID.

```ts
await showCallsStatus({ wallet, bundleId });
```

### `getCallsStatus`

Returns the status of the given bundle ID and the transaction receipts if completed.

```ts
const status = await getCallsStatus({ wallet, bundleId });
```
