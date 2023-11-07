---
"@thirdweb-dev/react": patch
---

Add `hideSwitchToPersonalWallet` prop on `ConnectWallet` component to hide the "switch to Personal wallet" option in the ConnectWallet dropdown which is shown when wallet is connected to either Smart Wallet or Safe

```tsx
<ConnectWallet hideSwitchToPersonalWallet={true} > // default: false
```
