---
"thirdweb": minor
---

Add 2 new Pay functions: convertFiatToCrypto and convertCryptoToFiat

Examples:

### Convert fiat (USD) to crypto
```ts
import { convertFiatToCrypto } from "thirdweb/pay";
import { ethereum } from "thirdweb/chains";

// Convert 2 cents to ETH
const result = await convertFiatToCrypto({
  from: "USD",
  // the token address. For native token, use NATIVE_TOKEN_ADDRESS
  to: "0x...",
  // the chain (of the chain where the token belong to)
  chain: ethereum,
  // 2 cents
  fromAmount: 0.02,
});
// Result: 0.0000057 (a number)
```

### Convert crypto to fiat (USD)

```ts
import { convertCryptoToFiat } from "thirdweb/pay";

// Get Ethereum price
const result = convertCryptoToFiat({
  fromTokenAddress: NATIVE_TOKEN_ADDRESS,
  to: "USD",
  chain: ethereum,
  fromAmount: 1,
});

// Result: 3404.11 (number)
```