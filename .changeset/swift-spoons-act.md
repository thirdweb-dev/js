---
"thirdweb": minor
---

Get NFTs by a wallet address.
```ts
import { createThirdwebClient, getNFTsByOwner } from "thirdweb";

const client = createThirdwebClient({ clientId: "..." });
const nfts = await getNFTsByOwner({
 client,
 owner: "0x...",
 pageSize: 20,
 page: 1
});
```

---

Get NFTs by collection.
```ts
import { createThirdwebClient, defineChain, getNFTsByCollection, getContract } from "thirdweb";

const client = createThirdwebClient({ clientId: "..." });
const contract = getContract({
 address: "0x...",
 chain: defineChain(1)
});
const nfts = await getNFTsByCollection({
 contract,
 groupBy: ["ownerAddress"],
});
```

---

Get latest block number for a chain.
```ts
import { createThirdwebClient, defineChain, getLatestBlockNumber } from "thirdweb";

const client = createThirdwebClient({ clientId: "..." });
const { latestBlockNumber } = await getLatestBlockNumber({
 client,
 chain: defineChain(1)
});
```

---

Get events for a contract.
```ts
import { createThirdwebClient, getEvents, defineChain, getContract } from "thirdweb";

const startDate = new Date(Date.now() - 48*60*60_000);
const endDate = new Date();
const contract = getContract({
 address: "0x...",
 client,
 chain: defineChain(1)
});
const events = await getEvents({
 contract,
 startDate,
 endDate,
 pageSize: 20,
 page: 1
});
```

---

Get transactions for a contract.
```ts
import { createThirdwebClient, defineChain, getContractTransactions } from "thirdweb";

const client = createThirdwebClient({ clientId: "..." });
const contract = getContract({
 chain: defineChain(1),
 address: "0x..."
});

const block = await getContractTransactions({
 contract,
 pageSize: 20,
 page: 1
});
```

---

Get data for a single block.
```ts
import { createThirdwebClient, getBlock, defineChain } from "thirdweb";

const client = createThirdwebClient({ clientId: "..." });
const { block } = await getBlock({
 client,
 blockNumber: 9662167n,
 chain: defineChain(1)
});
```


