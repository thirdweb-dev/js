---
"thirdweb": patch
---

Add util function: parseAbiParams

```ts
import { parseAbiParams } from "thirdweb/utils";

const example1 = parseAbiParams(
  ["address", "uint256"],
  ["0x.....", "1200000"]
); // result: ["0x......", 1200000n]
```
