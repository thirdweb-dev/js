---
"thirdweb": minor
---

Remove Pack extensions from ERC1155 export path

All Pack extensions should be imported from "thirdweb/extensions/pack". Everything else remains unchanged.
```ts
// Old
import { openPack } from "thirdweb/extensions/erc1155";

// New
import { openPack } from "thirdweb/extensions/pack";
```
