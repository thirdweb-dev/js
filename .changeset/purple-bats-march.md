---
"thirdweb": patch
---

Use insight for erc821/getNFT, erc721/getNFTs and erc721/getOwnedNFTs

Standard ERC721 getNFT, getNFTs and getOwnedNFTs now use insight, our in house indexer by default. If indexer is not availbale, will fallback to RPC.

You can also use the indexer directly using the Insight API:

for an entire collection

```ts
import { Insight } from "thirdweb";

const events = await Insight.getContractNFTs({
  client,
  chains: [sepolia],
  contractAddress: "0x1234567890123456789012345678901234567890",
});
```

or for a single NFT

```ts
import { Insight } from "thirdweb";

const events = await Insight.getNFT({
  client,
  chains: [sepolia],
  contractAddress: "0x1234567890123456789012345678901234567890",
  tokenId: 1n,
});
```
