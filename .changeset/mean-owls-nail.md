---
"thirdweb": minor
---

Adds parseAvatarRecord and parseNftUri utilities

```ts
import { parseAvatarRecord } from "thirdweb/extensions/ens";
import { parseNftUri } from "thirdweb/extensions/common";

const avatarUrl = await parseAvatarRecord({
  client,
  uri: "...",
});

const nftUri = await parseNftUri({
  client,
  uri: "...",
});
```
