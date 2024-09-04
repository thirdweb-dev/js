---
"thirdweb": patch
---

Add props for hiding "Send", "Receive" and "Send" buttons in Connect Details Modal UI for `ConnectButton` component. By default, all buttons are visible in the modal.

```tsx
<ConnectButton
  detailsModal={{
    hideSendFunds: false,
    hideReceiveFunds: true,
    hideBuyFunds: false,
  }}
/>
```
