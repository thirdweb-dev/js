---
"@thirdweb-dev/react": patch
---

Add prop `switchNetworkBtnTitle` to `ConnectWallet` and `Web3Button` components to allow changing the "Switch Network" label on the button which is displayed when user needs to switch the network in the connected wallet.

```tsx
<ConnectWallet switchNetworkBtnTitle="Switch Chain" />
```

```tsx
<Web3Button
  switchNetworkBtnTitle="Switch Chain"
  contractAddress="0x..."
  action={someAction}
/>
```
