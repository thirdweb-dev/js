---
"@thirdweb-dev/react": patch
---

add `useSetWalletModalConfig` hook to customize the ConnectWallet Modal to programmatically open the modal without using the `ConnectWallet` component along with `useSetIsWalletModalOpen`

```tsx
import {
  useSetWalletModalConfig,
  useSetIsWalletModalOpen,
} from "@thirdweb-dev/react";

function Example() {
  const setWalletModalConfig = useSetWalletModalConfig();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  return (
    <button
      onClick={() => {
        // customize the modal
        setWalletModalConfig({
          modalSize: "wide",
          theme: "light",
        });
        // open the modal
        setIsWalletModalOpen(true);
      }}
    >
      open connect modal
    </button>
  );
}
```
