---
"thirdweb": minor
---
The Connected-details button now shows USD value next to the token balance.

### Breaking change to the AccountBalance
AccountBalance now supports showing the token balance in fiat value (only USD supported at the moment)
```tsx
<AccountBalance 
  showInFiat="USD"
/>
```

The `formatFn` prop now takes in an object of type `AccountBalanceInfo` and outputs a string
```tsx
import { AccountBalance, type AccountBalanceInfo } from "thirdweb/react";

<AccountBalance 
  formatFn={(props: AccountBalanceInfo) => `${props.balance}---${props.symbol.toLowerCase()}`}
/>

// Result: 11.12---eth
```

### Export util functions: 
formatNumber: Round up a number to a certain decimal place
```tsx
import { formatNumber } from "thirdweb/utils";
const value = formatNumber(12.1214141, 1); // 12.1
```

shortenLargeNumber: Shorten the string for large value
```tsx
import { shortenLargeNumber } from "thirdweb/utils";
const numStr = shortenLargeNumber(1_000_000_000, )
```