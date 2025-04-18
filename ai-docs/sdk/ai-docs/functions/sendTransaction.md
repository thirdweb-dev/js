# sendTransaction

## <!--

title: sendTransaction
category: function

---

-->

## Description

`sendTransaction` broadcasts a **PreparedTransaction** (or extension‑generated transaction) to the blockchain using a given `Account`. It automatically handles decorators, gasless relaying (Engine/OpenZeppelin/Biconomy), ZkSync‑EIP‑712 paths, and records the tx in the SDK's transaction store.

Use it after preparing a transaction with `prepareContractCall` / `prepareTransaction`, or when working with write extensions.

## Usage

```ts no‑lint
import { sendTransaction, prepareContractCall, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const contract = getContract({ address: "0x…", chain: sepolia, client });

const tx = prepareContractCall({
  contract,
  method: "function transfer(address,uint256)",
  params: ["0xRecipient", 1n * 10n ** 18n],
});

const result = await sendTransaction({ account, transaction: tx });
console.log("hash", result.transactionHash);
```

### Gasless with thirdweb Engine

```ts
await sendTransaction({
  account,
  transaction: tx,
  gasless: {
    provider: "engine",
    relayerUrl: "https://engine.thirdweb.com/relayer/…",
    relayerForwarderAddress: "0xForwarder",
  },
});
```

## Signature

```ts
function sendTransaction(
  options: SendTransactionOptions
): Promise<WaitForReceiptOptions>;
```

Where `SendTransactionOptions` =
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account` | `Account` | ✅ | Wallet/signing account to submit the tx |
| `transaction` | `PreparedTransaction<any>` | ✅ | Transaction data (prepared) |
| `gasless` | `GaslessOptions` | — | Enable and configure gasless relaying |

The promise resolves to `WaitForReceiptOptions` which can be fed into `waitForReceipt` or inspected for the `transactionHash`.

## Related

- `prepareContractCall`, `prepareTransaction`
- `waitForReceipt`, `estimateGas`, `simulateTransaction`
- Gasless types: `GaslessOptions`, `EngineOptions`, `OpenZeppelinOptions`, `BiconomyOptions`
- Account abstraction (`SmartWallet`)
