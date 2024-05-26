---
"thirdweb": minor
---

Show in-app wallet users an option to export their private key. Enabled by default.

### Usage

To hide the private key export:

```tsx
import { inAppWallet } from "thirdweb/wallets";
const wallet = inAppWallet({
  hidePrivateKeyExport: true,
});
```
