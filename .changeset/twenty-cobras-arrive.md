---
"thirdweb": minor
---

Add ClaimButton for claiming tokens from all thirdweb Drop contracts

Higher level abstraction to claim tokens from all thirdweb Drop contracts

```tsx
import { ClaimButton } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";

<ClaimButton
  contractAddress="0x..."
  chain={ethereum}
  client={client}
  claimParams={{
    type: "ERC721",
    quantity: 1n,
  }}
>
  Claim now
</ClaimButton>
```
