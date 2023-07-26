---
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

[Wallets/React] Add Blocto Wallet

```javascript
import { ThirdwebProvider, bloctoWallet } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

<ThirdwebProvider
  activeChain={Polygon}
  supportedWallets={[bloctoWallet()]}
>
  <App />
</ThirdwebProvider>;
```
