---
"@thirdweb-dev/react-native": patch
---

Adding walletConnect as a supportedWallet in React Native

```javascript
import {
  localWallet,
  ThirdwebProvider,
  walletConnect,
} from "@thirdweb-dev/react-native";
import { Ethereum } from "@thirdweb-dev/chains";

const App = () => {
  const activeWallet = Ethereum;
  return (
    <ThirdwebProvider
      activeChain={activeWallet}
      supportedChains={[activeWallet]}
      clientId="your-client-id"
      supportedWallets={[localWallet(), walletConnect()]}
    >
      <AppInner />
    </ThirdwebProvider>
  );
};
```
