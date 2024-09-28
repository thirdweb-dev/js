---
"thirdweb": minor
---

Add Pack extensions
### Deploy Pack
```ts
import { deployPackContract } from "thirdweb/extensions/deploy";

const packAddress = await deployPackContract({
  account,
  client,
  chain,
  params: {
    name: "Pack contract name",
    symbol: "PACK1155",
  },
});
```

### Create a Pack
```ts
import { createPack } from "thirdweb/extensions/pack";

const transaction = createPack({
  contract: packContract,
  client,
  recipient: "0x...",
  tokenOwner: "0x...",
  packMetadata: {
    name: "Pack #1",
    image: "image-of-pack-1",
  },
  openStartTimestamp: new Date(),
  erc20Rewards: [
    {
      contractAddress: "0x...",
      quantityPerReward: 1,
      totalRewards: 1,
    },
  ],
  erc721Rewards: [
    {
      contractAddress: "0x...",
      tokenId: 0n,
    },
  ],
  erc1155Rewards: [
    {
      contractAddress: "0x...",
      tokenId: 0n,
      quantityPerReward: 1,
      totalRewards: 1,
    },
  ],
});
```