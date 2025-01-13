---
"thirdweb": patch
---

Add `isValidENSName` utility function for checking if a string is a valid ENS name. It does not check if the name is actually registered, it only checks if the string is in a valid format.

```ts
import { isValidENSName } from "thirdweb/utils";

isValidENSName("thirdweb.eth"); // true
isValidENSName("foo.bar.com"); // true
isValidENSName("foo"); // false
```
