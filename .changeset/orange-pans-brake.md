---
"@thirdweb-dev/react-native": patch
---

Improved ConnectWallet design :)

Devs can now pass a `recommended` field in most wallets to recommend wallets to users.

When recommending a wallet, this wallet will show up at the top of the wallets list.

```javascript
import { metamaskWallet, ThirdwebProvider } from "@thirdweb-dev/react-native";

<ThirdwebProvider
  clientId="your-client-id"
  supportedWallets={[
    metamaskWallet({
      recommended: true,
    }),
  ]}
>
  <App />
</ThirdwebProvider>;
```
