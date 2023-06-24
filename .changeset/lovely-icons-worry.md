---
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

[React] Add Rainbow Wallet (implementing the WalletConnect wallet)

```javascript
import { ThirdwebProvider, rainbowWallet } from "@thirdweb-dev/react";

const activeChain = "ethereum";

<ThirdwebProvider
  activeChain={activeChain}
  supportedWallets={[rainbowWallet()]}
>
  <App />
</ThirdwebProvider>;
```
