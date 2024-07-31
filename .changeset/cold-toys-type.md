---
"thirdweb": minor
---

Add prebuilt component: StakeERC721Button
```tsx
import { StakeERC721Button } from "thirdweb/react";

<StakeERC721Button
  contractAddress="0x..." // the StakeERC721 contract address
  chain={...} // the chain which the stake contract is deployed on
  client={...} // thirdweb Client
  tokenIds={[0n, 1n, 2n, ...]} // the IDs of the NFTs you want to stake
>
  Stake NFT
</StakeERC721Button>
```