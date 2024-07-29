---
"thirdweb": minor
---

Add prebuilt component: BuyDirectListingButton for Marketplace v3
```tsx
import { BuyDirectListingButton } from "thirdweb/react";

<BuyDirectListingButton
  contractAddress="0x..." // contract address of the marketplace v3
  chain={...} // the chain which the marketplace contract is deployed on
  client={...} // thirdweb client
  listingId={100n} // the listingId or the item you want to buy
  quantity={1n} // optional - see the docs to learn more
>
  Buy NFT
</BuyDirectListingButton>
```