---
"thirdweb": minor
---

Add `useConnectModal` hook that allows you to open the Connect UI in a Modal to prompt the user to connect wallet.

```tsx
import { createThirdwebClient } from "thirdweb";
import { useConnectModal } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "<your_client_id>",
});

function Example() {
  const { connect, isConnecting } = useConnectModal();

  async function handleConnect() {
    const wallet = await connect({ client }); // opens the connect modal
    console.log("connected to", wallet);
  }

  return <button onClick={handleConnect}> Connect </button>;
}
```
