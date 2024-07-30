---
"thirdweb": minor
---

Add CreateDirectListing button for Marketplace v3
```tsx
import { CreateDirectListingButton } from "thirdweb/react";

<CreateDirectListingButton
  contractAddress="0x..." // contract address for the marketplace-v3
  chain={...} // the chain which the marketplace contract is deployed on

  // These props below are the same props for `createListing`
  // to get the full list, check the docs link above
  tokenId={0n}
  assetContractAddress="0x..." // The NFT contract address whose NFT(s) you want to sell
  pricePerToken={"0.1"} // sell for 0.1 <native token>
>
  Sell NFT
</CreateDirectListingButton>
```