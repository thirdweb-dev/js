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
  const activeChain = Ethereum;
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedChains={[activeChain]}
      clientId="your-client-id"
      supportedWallets={[
        localWallet(),
        walletConnect({
          projectId: "your-wallet-connect-project-id", // optional, but we recommend you get your own for production
        }),
      ]}
    >
      <AppInner />
    </ThirdwebProvider>
  );
};
```
