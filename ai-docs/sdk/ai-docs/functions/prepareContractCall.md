# prepareContractCall

## <!--

title: prepareContractCall
category: function

---

-->

## Description

`prepareContractCall` builds a **PreparedTransaction** object for invoking a smart‑contract function. It resolves the ABI signature, encodes parameters, and lets you optionally set gas values, value, or ERC‑20 transfer metadata – all without sending anything to the network.

The returned object can be:

- Estimated (`estimateGas`, `estimateGasCost`)
- Simulated (`simulateTransaction`)
- Sent (`sendTransaction`, `sendAndConfirmTransaction`)
- Fed into UI components (e.g. `TransactionButton`, `PayEmbed`)

## Usage

```ts no‑lint
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

const contract = getContract({
  client,
  chain: sepolia,
  address: "0xToken",
  abi: ["function transfer(address to, uint256 value)"],
});

const tx = prepareContractCall({
  contract,
  method: "transfer",
  params: ["0xReceiver", 1n * 10n ** 18n],
});

const receipt = await sendAndConfirmTransaction({ client, transaction: tx });
```

## Signature

```ts
function prepareContractCall<TAbi, TMethod>(
  options: PrepareContractCallOptions
): PreparedTransaction;
```

### PrepareContractCallOptions (high‑level)

| Field              | Type                                                                | Required | Description                                                                          |
| ------------------ | ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `contract`         | `ThirdwebContract`                                                  | ✅       | Contract instance (includes chain & client)                                          |
| `method`           | `string`                                                            | ✅       | Method selector: human‑readable string, full `AbiFunction` object, or async resolver |
| `params`           | `unknown[]`                                                         | depends  | Arguments for the method (ordered)                                                   |
| Gas / value fields | `maxFeePerGas`, `maxPriorityFeePerGas`, `value`, `erc20Value`, etc. | —        | Override transaction costs                                                           |
| Extra              | `extraCallData`                                                     | —        | Hex‑encoded additional calldata appended after params                                |

(For the exhaustive generic definition see the TypeScript type in `packages/thirdweb/src/transaction/prepare-contract-call.ts`.)

## Advanced Examples

### Specify explicit gas values

```ts
const tx = prepareContractCall({
  contract,
  method: "transfer",
  params: [to, value],
  maxFeePerGas: 30n,
  maxPriorityFeePerGas: 1n,
});
```

### ERC‑20 value semantics

```ts
const tx = prepareContractCall({
  contract,
  method: "payWithCoin",
  params: [],
  erc20Value: {
    tokenAddress: USDC,
    amountWei: toWei("10"),
  },
});
```

### Using full ABI function object

```ts
const tx = prepareContractCall({
  contract,
  method: {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  params: [to, value],
});
```

## Related

- `prepareTransaction` – lower‑level primitive
- `sendTransaction`, `sendAndConfirmTransaction`
- `simulateTransaction`, `estimateGas`, `estimateGasCost`
- `TransactionButton` UI component
