---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react": patch
---

Remove signer from ThirdwebProvider as it is not being used

The idea of the React/RN ThirdwebProvider is to provider support for wallets. If devs want to pass their own signer they can directly use ThirdwebSDKProvider
