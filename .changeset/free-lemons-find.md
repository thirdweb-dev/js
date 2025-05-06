---
"thirdweb": minor
---

feat(bridge): Add chains endpoint to retrieve Universal Bridge supported chains

```typescript
import { Bridge } from "thirdweb";

const chains = await Bridge.chains({
  client: thirdwebClient,
});
```

Returned chains include chain information such as chainId, name, icon, and nativeCurrency details.
