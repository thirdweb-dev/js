---
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

'[Wallets/React] Adds Frame as a supported wallet.'

You can now use Frame by adding `frameWallet()` in the ThirdwebProvider's `supportedWallets` prop.

```javascript
import {
  ThirdwebProvider,
  localWallet,
  frameWallet,
} from "@thirdweb-dev/react";

<ThirdwebProvider
  activeChain={activeChain}
  supportedWallets={[frameWallet(), localWallet()]}
>
  <App />
</ThirdwebProvider>;
```
