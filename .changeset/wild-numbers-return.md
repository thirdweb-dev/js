---
"thirdweb": minor
---

Add prebuilt component: StakeERC1155
```tsx
import { StakeERC1155Button } from "thirdweb/react";

<StakeERC1155Button
  contractAddress="0x..." // the StakeERC1155 contract address
  chain={...} // the chain which the stake contract is deployed on
  client={...} // thirdweb Client
  tokenId={0n} // the ID of the NFT (Edition) you want to stake
  amount={100n} // amount to stake
>
  Stake NFT
</StakeERC1155Button>
```
