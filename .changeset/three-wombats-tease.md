---
"thirdweb": minor
---

Add `useWalletDetailsModal` hook to open Wallet Details Modal without using `<ConnectButton />` component

```tsx
import { createThirdwebClient } from "thirdweb";
import { useWalletDetailsModal } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "<your_client_id>",
});

function Example() {
  const { open } = useWalletDetailsModal();

  function handleClick() {
    open({ client, theme: "light" });
  }

  return <button onClick={handleClick}> Show Wallet Details </button>;
}
```
