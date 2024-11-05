---
"thirdweb": minor
---

Added new `SiteEmbed` React component for embedding thirdweb-supported sites with seamless wallet connection support.

The component allows you to embed other thirdweb-enabled sites while maintaining wallet connection state, supporting both in-app and ecosystem wallets.

Example usage:
```tsx
import { SiteEmbed } from "thirdweb/react";

<SiteEmbed 
  src="https://thirdweb.com" 
  client={client}
  ecosystem={ecosystem}
/>
```

Note: Embedded sites must include `<AutoConnect />` and support frame-ancestors in their Content Security Policy.
