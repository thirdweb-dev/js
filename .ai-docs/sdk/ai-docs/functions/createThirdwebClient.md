# createThirdwebClient

## <!--

title: createThirdwebClient
category: function

---

-->

## Description

Factory helper that instantiates a `ThirdwebClient` object. It validates your credentials (client ID or secret key), normalises configuration, and returns an immutable client that is passed into almost every SDK call.

- Use `clientId` when running **in the browser** or distributing a public app.
- Use `secretKey` when running **in secure server environments** where the key can be kept private.

## Usage

```ts no‑lint
import { createThirdwebClient } from "thirdweb";

// 1️⃣ Public / browser
const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID", // get it from https://thirdweb.com/dashboard
});

// 2️⃣ Server / backend
const serverClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

// 3️⃣ Advanced – custom RPC batching & IPFS gateway
const customClient = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
  config: {
    rpc: {
      maxBatchSize: 50,
      batchTimeoutMs: 10,
    },
    storage: {
      gatewayUrl: "https://mycustom.cdn/ipfs/",
    },
  },
});
```

## Signature

```ts
function createThirdwebClient(
  options: CreateThirdwebClientOptions
): ThirdwebClient;
```

| Option                      | Type          | Required                                                | Description                                                                             |
| --------------------------- | ------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `clientId`                  | `string`      | One of `clientId` **or** `secretKey` must be provided.  | Public key used on the client side to identify your application.                        |
| `secretKey`                 | `string`      | One of `clientId` **or** `secretKey` must be provided.  | Private key used on secure servers to unlock elevated rate‑limits and write operations. |
| `config.rpc.fetch`          | `FetchConfig` | No                                                      | Overrides for the internal fetch used by the RPC client.                                |
| `config.rpc.maxBatchSize`   | `number`      | No (default `100`)                                      | Maximum JSON‑RPC requests to batch.                                                     |
| `config.rpc.batchTimeoutMs` | `number`      | No                                                      | Milliseconds to wait before sending a batch.                                            |
| `config.storage.fetch`      | `FetchConfig` | No                                                      | Overrides for IPFS gateway requests.                                                    |
| `config.storage.gatewayUrl` | `string`      | No (default `https://<clientId>.ipfscdn.io/ipfs/<cid>`) | Custom gateway URL.                                                                     |

`FetchConfig` = `{ requestTimeoutMs?: number; keepalive?: boolean; headers?: HeadersInit }`

## Example

```ts no‑lint
import { createThirdwebClient, defineChain, eth_blockNumber } from "thirdweb";

const client = createThirdwebClient({ clientId: "demo" });

const sepolia = defineChain({ id: 11155111, rpc: "https://rpc.sepolia.org" });

const blockNumber = await eth_blockNumber({ client, chain: sepolia });
console.log("Latest block:", blockNumber);
```

## Related

- [`ThirdwebClient` type](../types/ThirdwebClient.md)
- [Portal docs – Creating a Client](https://portal.thirdweb.com/typescript/v5/client)
