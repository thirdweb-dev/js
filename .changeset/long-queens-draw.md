---
"thirdweb": minor
---

Added new deployment utility functions to help manage infrastructure contracts and initialization:

- `getInitializeTransaction`: Prepare initialization transaction for contract deployment
- `getOrDeployInfraForPublishedContract`: Get or deploy required infrastructure for published contracts

```typescript
import { 
  getInitializeTransaction,
  getOrDeployInfraForPublishedContract
} from "thirdweb";

// Get initialization transaction
const initTx = await getInitializeTransaction({
  client,
  chain,
  account,
  implementationContract,
  deployMetadata,
  initializeParams: {
    name: "My Contract",
    symbol: "CNTRCT" 
  }
});

// Get or deploy infrastructure
const infra = await getOrDeployInfraForPublishedContract({
  chain,
  client,
  account,
  contractId: "MyContract",
  constructorParams: params
});
```
