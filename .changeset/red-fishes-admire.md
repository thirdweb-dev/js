---
"@thirdweb-dev/unity-js-bridge": patch
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/chains": patch
"@thirdweb-dev/sdk": patch
---

Allow devs to "cherry-pick" chains from the chains package to avoid importing ALL the chains in some environments which reduces our
@thirdweb-dev/react-native package by 35% of its size

Before:

```javascript
import { defaultChains, Ethereum } from "@thirdweb-devs/chains"; // imports the full package = ~670kb
```

After:

```javascript
import Ethereum from "@thirdweb-devs/chains/chains/Ethereum"; // only imports the Ethereum chain
```

```javascript
import { defaultChains } from "@thirdweb-devs/chains/utils"; // only imports the defaultChains = ~10kb
```
