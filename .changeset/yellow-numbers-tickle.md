---
"@thirdweb-dev/react": patch
---

Add `detailsModalFooter` prop on `<ConnectWallet />` component to allow rendering a custom UI at the bottom of the details modal.

```tsx
<ConnectWallet
  detailsModalFooter={(props) => {
    const { close } = props;
    return <div> .... </div>;
  }}
/>
```
