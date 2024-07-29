---
"thirdweb": minor
---

Adds useChainMetadata to retrieve metadata for a chain such as name, icon, available faucets, block explorers, etc.

```jsx
import { useChainMetadata } from "thirdweb/react";

const { data: chainMetadata } = useChainMetadata(defineChain(11155111));

console.log("Name:", chainMetadata.name); // Sepolia
console.log("Faucets:", chainMetadata.faucets); // ["https://thirdweb.com/sepolia/faucet"]
console.log("Explorers:", chainMetadata.explorers); // ["https://sepolia.etherscan.io/"]
```
