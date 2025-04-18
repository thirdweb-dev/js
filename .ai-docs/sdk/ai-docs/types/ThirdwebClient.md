# ThirdwebClient

## <!--

title: ThirdwebClient (type)
category: type

---

-->

## Description

The **ThirdwebClient** is a lightweight, immutable object returned by `createThirdwebClient`. It keeps track of your project credentials (client‑ID and/or secret‑key) plus optional configuration for RPC batching and IPFS storage. Most SDK functions require a `client` parameter so they can route requests through thirdweb's infra.

Because it is a **plain object** (not a class instance), it can be safely `JSON.stringify`‑ed, serialised between server and browser, or stored in a React context.

## Shape

```ts
interface ThirdwebClient {
  /** Public client identifier (always present) */
  readonly clientId: string;

  /** Private secret‑key, only present when created server‑side */
  readonly secretKey: string | undefined;

  /** Optional client‑wide configuration */
  readonly config?: {
    rpc?: {
      fetch?: FetchConfig;
      maxBatchSize?: number;
      batchTimeoutMs?: number;
    };
    storage?: {
      fetch?: FetchConfig;
      gatewayUrl?: string;
    };
  };
}

interface FetchConfig {
  requestTimeoutMs?: number;
  keepalive?: boolean;
  headers?: HeadersInit;
}
```

## Usage

```ts no‑lint
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ clientId: "myAppId" });

// Pass it into any SDK helper
import { eth_getBalance } from "thirdweb";

const balance = await eth_getBalance({
  client,
  address: "0x1234...",
  chain: 1,
});
```

### React / Context example

```tsx no‑lint
import { createContext, useContext } from "react";
import { createThirdwebClient } from "thirdweb";

const ClientCtx = createContext<ThirdwebClient | undefined>(undefined);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const client = createThirdwebClient({ clientId: "myApp" });
  return <ClientCtx.Provider value={client}>{children}</ClientCtx.Provider>;
};

export const useClient = () => {
  const ctx = useContext(ClientCtx);
  if (!ctx) throw new Error("ClientProvider missing");
  return ctx;
};
```

## Related

- [`createThirdwebClient`](../functions/createThirdwebClient.md)
- [Portal docs – Client concept](https://portal.thirdweb.com/typescript/v5/client)
