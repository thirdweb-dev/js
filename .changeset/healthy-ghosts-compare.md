---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/wallets": patch
---

[ReactNative] Add support for signing in with email/phone using magic sdk

Devs can now add a new supportedWallet:

```javascript
import { Goerli } from '@thirdweb-dev/chains';
import { ThirdwebProvider, magicWallet } from '@thirdweb-dev/react-native';

<ThirdwebProvider
    activeChain={Goerli}
    supportedWallets={[
    magicWallet({
        apiKey: 'magic_api_key',
    }),
]}>
```
