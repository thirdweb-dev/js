---
"thirdweb": minor
---

Added `onDisconnect` option in `useWalletDetailsModal`'s `open` method to add a callback when the user disconnects the wallet by clicking the disconnect button in the wallet details modal.

```tsx
import { useWalletDetailsModal } from "thirdweb/react";

function Example() {
  const detailsModal = useWalletDetailsModal();

  return (
    <button
      onClick={() => {
        detailsModal.open({
          client,
          onDisconnect: ({ wallet, account }) => {
            console.log("disconnected", wallet, account);
          },
        });
      }}
    >
      Show wallet details
    </button>
  );
}
```

`onDisconnect` prop of `ConnectButton` now gets called with the disconnected `wallet` and `account` as arguments

```tsx
<ConnectButton
  onDisconnect={({ wallet, account }) => {
    console.log("disconnected", wallet, account);
  }}
/>
```
