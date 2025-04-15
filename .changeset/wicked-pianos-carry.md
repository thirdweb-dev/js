---
"thirdweb": minor
---

Expose getOwnedTokens, getOwnedNFTs and getTransaction functions

You can now use Insight, our in-house indexer directly from the SDK with a simple API:

## Get Owned ERC20 tokens

```ts
import { Insight } from "thirdweb";

const tokens = await Insight.getOwnedTokens({
  client,
  ownerAddress,
  chains: [base, polygon, arbitrum],
});
```

## Get Owned NFTs (ERC721 and ERC1155)

```ts
import { Insight } from "thirdweb";

const nfts = await Insight.getOwnedNFTs({
  client,
  ownerAddress,
  chains: [sepolia],
});
```

## Get Transactions for a given wallet address

```ts
import { Insight } from "thirdweb";

const transactions = await Insight.getTransactions({
  client,
  walletAddress,
  chains: [sepolia],
});
```

All functions come with extra query filters for more granular queries, refer to the documentation for more details.
