---
"@thirdweb-dev/wagmi-adapter": major
---

Wagmi connector for in-app wallets

You can now connect to an in-app wallet in your wagmi applications.

```ts
import { http, createConfig } from "wagmi";
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    inAppWalletConnector({
      clientId: "...",
      strategy: "google",
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});
```
