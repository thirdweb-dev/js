---
"@thirdweb-dev/wallets": patch
---

feat: add apple auth to embedded wallet.

To enable simply pass in `apple` as the strategy

```
const wallet = new EmbeddedWallet({
  chain: Ethereum, //  chain to connect to
  clientId: "YOUR_CLIENT_ID", // client ID
});

const authResult = await wallet.authenticate({
  strategy: "apple",
});

```
