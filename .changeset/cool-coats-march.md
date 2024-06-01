---
"thirdweb": minor
---

Adds headless functions for creating and managing a WalletConnect session with a connected wallet

### `createWalletConnectClient`

```ts
import { createWalletConnectClient } from "thirdweb/wallets/wallet-connect";

createWalletConnectClient({
  client: client,
  wallet: wallet,
  onConnect: (session: any) => {
    alert("Connected");
  },
  onDisconnect: (session: any) => {
    alert("Disconnected");
  },
});
```

### `createWalletConnectSession`

```ts
import { createWalletConnectSession } from "thirdweb/wallets/wallet-connect";

createWalletConnectSession({
  walletConnectClient: wcClient,
  uri: "wc:...",
});
```

### `getWalletConnectSessions`

```ts
import {
  getWalletConnectSession,
  type WalletConnectSession,
} from "thirdweb/wallets/wallet-connect";

const sessions: WalletConnectSession[] = await getWalletConnectSessions();
```

### `disconnectWalletConnectClient`

```ts
import { disconnectWalletConnectClient } from "thirdweb/wallets/wallet-connect";

disconnectWalletConnectClient({ session, walletConnectClient: wcClient });
```
