---
"thirdweb": minor
---

Adds basic EIP-5792 support for wallets with functions `getCapabilities`, `sendCalls`, `showCallsStatus`, `getCallsStatus`.

## Example Usage

### `getCapabilities`

Returns the capabilities of the wallet according to EIP-5792.

```ts
import { getCapabilities } from "thirdweb/wallets/eip5792";

const capabilities = await getCapabilities({ wallet });
```

### `sendCalls`

Sends the given calls to the wallet for execution, and attempts to fallback to normal execution if the wallet does not support EIP-5792.

```ts
import { sendCalls } from "thirdweb/wallets/eip5792";

const transfer1 = transfer({
  contract: USDC_CONTRACT,
  amount: 5000,
  to: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
});

const transfer2 = transfer({
  contract: USDT_CONTRACT,
  amount: 1000,
  to: "0x33d9B8BEfE81027E2C859EDc84F5636cbb202Ed6",
});

const bundleId = await sendCalls({
  wallet,
  client,
  calls: [transfer1, transfer2],
});
```

### `showCallsStatus`

Requests the wallet to show the status of a given bundle ID.

```ts
import { showCallsStatus } from "thirdweb/wallets/eip5792";

await showCallsStatus({ wallet, bundleId });
```

### `getCallsStatus`

Returns the status of the given bundle ID and the transaction receipts if completed.

```ts
import { getCallsStatus } from "thirdweb/wallets/eip5792";

const status = await getCallsStatus({ wallet, bundleId });
```
