---
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

[Wallets/React] Add Trust Wallet

```javascript
import { ThirdwebProvider, trustWallet } from "@thirdweb-dev/react";

const activeChain = "mumbai";

<ThirdwebProvider
  activeChain={activeChain}
  autoSwitch={true}
  supportedWallets={[trustWallet()]}
>
  <App />
</ThirdwebProvider>;
```
