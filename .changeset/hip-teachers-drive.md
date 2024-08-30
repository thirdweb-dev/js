---
"thirdweb": minor
---

Add NFT prebuilt components
```tsx
import { getContract } from "thirdweb";
import { NFT } from "thirdweb/react";

const contract = getContract({
  address: "0x...",
  chain: ethereum,
  client: yourThirdwebClient,
});

<NFT contract={contract} tokenId={0n}>
  <Suspense fallback={"Loading media..."}>
    <NFT.Media />
  </Suspense>
</NFT>
```