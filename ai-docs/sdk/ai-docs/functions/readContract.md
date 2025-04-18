# readContract

## <!--

title: readContract
category: function

---

-->

## Description

`readContract` performs a stateless **eth_call** on a contract function and returns the decoded result. It's the read‑only counterpart to `prepareContractCall`/`sendTransaction` and is fully type‑safe when you provide a Solidity signature or ABI fragment.

The helper auto‑resolves ABI, encodes params, fetches data via the SDK's RPC client, then decodes outputs. It is also the underlying primitive for the React hook `useReadContract`.

## Usage

```ts no‑lint
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const contract = getContract({
  client,
  chain: sepolia,
  address: "0xNFT",
});

const tokenURI = await readContract({
  contract,
  method: "function tokenURI(uint256) view returns (string)",
  params: [1n],
});
console.log(tokenURI);
```

## Signature

```ts
function readContract<TAbi, TMethod>(
  options: ReadContractOptions
): Promise<ReadContractResult>;
```

Key `ReadContractOptions` fields:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract` | `ThirdwebContract` | ✅ | Target contract |
| `method` | `string` \| `AbiFunction` \| async resolver | ✅ | Function selector |
| `params` | array | — | Arguments for the call |
| `from` | `string` | — | Optional caller address |

`ReadContractResult` automatically flattens single‑value returns and respects ABI output types.

## Advanced: resolveMethod helper

If you only know the name, combine with `resolveMethod` to fetch the ABI dynamically:

```ts
import { resolveMethod } from "thirdweb";

await readContract({
  contract,
  method: resolveMethod("symbol"),
});
```

## Related

- `useReadContract` React hook
- `prepareContractCall`, `sendTransaction`
- `resolveMethod`
