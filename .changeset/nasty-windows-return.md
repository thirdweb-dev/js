---
"thirdweb": minor
---

Support for modular contracts

# Deploy and Interact with modular contracts programmatically

### Deploy a modular contract

```ts
import {
  ClaimableERC721,
  BatchMetadataERC721,
  deployModularContract,
} from "thirdweb/modules";

const deployed = deployModularContract({
   client,
   chain,
   account,
   core: "ERC721",
   params: {
     name: "My Modular NFT Contract",
   },
   modules: [
     ClaimableERC721.module({
        primarySaleRecipient: ...,
     }),
     BatchMetadataERC721.module(),
   ],
});
```

### Interact with a modular contract

```ts
import { ClaimableERC721 } from "thirdweb/modules";

const contract = getContract({
  client,
  chain,
  address,
});

const transaction = ClaimableERC721.mint({
  contract,
  to: account.address,
  quantity: 1,
});

await sendTransaction({
  transaction,
  account,
});
```
