---
"@thirdweb-dev/react-native": patch
---

Allow switching between supported chains in the React Native Wallet Details' modal

- You can now enable showing a modal to switch between the supported chains defined in your ThirdwebProvider

```javascript
<NetworkButton chain={chain} enableSwitchModal={true} />
```

- You can also use the `NetworkButton` to switch to the chain represented on it:

```javascript
<NetworkButton
  chain={chain}
  switchChainOnPress={true}
  onChainSwitched={onChainSwitched}
/>
```
