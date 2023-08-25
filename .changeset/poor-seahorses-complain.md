---
"@thirdweb-dev/react-native": patch
---

Adds switchToActiveChain prop to the ConnectWallet button.

When set to true it will show a "Switch Network" button if the wallet
is connected to a different chain than the `activeChain` provided in `ThirdwebProvider`

**Note:** IF you support multiple networks in your app this prop should
be set to `false` to allow users to switch between networks.

Usage:

```javascript
<ConnectWallet switchToActiveChain={true} />
```
