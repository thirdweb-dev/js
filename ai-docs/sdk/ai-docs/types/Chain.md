# Chain Type

## <!--

title: Chain
category: type

---

-->

## Description

`Chain` represents an EVM blockchain configuration used by the SDK to construct RPC URLs, block‑explorer links, faucet info, and more. It is a **readonly object** that extends `ChainOptions` with a required `rpc` URL string.

A `Chain` can be one of the **built‑in presets** (e.g. `polygon`, `sepolia`) or a custom chain you define via `defineChain`.

## Shape (simplified)

```ts
export type Chain = Readonly<{
  id: number; // chain ID (required)
  name?: string; // display name
  rpc: string; // primary RPC URL
  icon?: { url: string; width: number; height: number; format: string };
  nativeCurrency?: {
    name?: string;
    symbol?: string;
    decimals?: number;
  };
  blockExplorers?: { name: string; url: string; apiUrl?: string }[];
  testnet?: true;
}>;
```

(See `packages/thirdweb/src/chains/types.ts` for the exhaustive interface.)

## Built‑in Imports

```ts
import { polygon, optimism, base, sepolia } from "thirdweb/chains";
```

## Defining a Custom Chain

```ts
import { defineChain } from "thirdweb/chains";

export const myTestnet = defineChain({
  id: 1337,
  name: "My Localnet",
  rpc: "http://localhost:8545",
  testnet: true,
});
```

## Usage

`Chain` objects are passed into many helpers:

```ts
getContract({ client, chain: polygon, address });

await eth_getBalance({ client, chain: myTestnet, address });
```

## Related

- `defineChain` helper
- Wallet `switchChain` method
