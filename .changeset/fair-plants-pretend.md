---
"thirdweb": minor
---
The Connected-details button now shows USD value next to the token balance.

### Breaking change to the AccountBalance
The formatFn props now takes in an object of type `AccountBalanceInfo`. The old `formatFn` was inflexible because it only allowed you to format the balance value.
With this new version, you have access to both the balance and symbol.
```tsx
import { AccountBalance, type AccountBalanceInfo } from "thirdweb/react";

<AccountBalance 
  // Show the symbol in lowercase, before the balance
  formatFn={(props: AccountBalanceInfo) => `${props.symbol.toLowerCase()} ${props.balance}`}
/>
```

AccountBalance now supports showing the token balance in fiat value (only USD supported at the moment)
```tsx
<AccountBalance 
  showBalanceInFiat="USD"
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

### ConnectButton also supports displaying balance in fiat since it uses AccountBalance internally
```tsx
<ConnectButton
  // Show USD value on the button
  detailsButton={{
    showBalanceInFiat: "USD",
  }}

  // Show USD value on the modal
  detailsModal={{
    showBalanceInFiat: "USD",
  }}
/>
```

### Export utils functions: 
formatNumber: Round up a number to a certain decimal place
```tsx
import { formatNumber } from "thirdweb/utils";
const value = formatNumber(12.1214141, 1); // 12.1
```

shortenLargeNumber: Shorten the string for large value. Mainly used for the AccountBalance's `formatFn`
```tsx
import { shortenLargeNumber } from "thirdweb/utils";
const numStr = shortenLargeNumber(1_000_000_000)
```

### Fix to ConnectButton
The social image of the Details button now display correctly for non-square image.

### Massive test coverage improvement for the Connected-button components