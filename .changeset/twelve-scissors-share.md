---
"@thirdweb-dev/service-utils": patch
---

expose domain and bundle Id validation logic

```typescript
import { authorizeDomain, authorizeBundleId } from "@thirdweb-dev/service-utils
const isValidDomain = authorizeDomain({ domains, origin });
const isValidBundleId = authorizeBundleId({ bundleId, bundleIds });
```
