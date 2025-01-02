---
"thirdweb": patch
---

- Add onClose callback to Connect Details modal

```tsx
<ConnectButton
  detailsModal={{
    onClose: (screen: string) => {
      // The last screen name that was being shown when user closed the modal
      console.log({ screen });
    }
  }}
/>
```

- Small fix for ChainIcon: Always resolve IPFS URI

- Improve test coverage