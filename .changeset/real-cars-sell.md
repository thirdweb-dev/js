---
"thirdweb": minor
---

Add SiteLink component for creating wallet-aware links between thirdweb-enabled sites. This component automatically adds wallet connection parameters to the target URL when a wallet is connected, enabling seamless wallet state sharing between sites.

Example:
```tsx
import { SiteLink } from "thirdweb/react";

function App() {
  return (
    <SiteLink 
      href="https://thirdweb.com" 
      client={thirdwebClient} 
      ecosystem={{ id: "ecosystem.thirdweb" }}
    >
      Visit thirdweb.com with connected wallet
    </SiteLink>
  );
}
```
