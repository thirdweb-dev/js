# ERC20 Extension

## <!--

title: ERC20 Extension
category: extension

---

-->

## Description

The **ERC‑20 extension** wraps fungible‑token standards with ergonomic read/write helpers plus drop, signature‑mint, and WETH utilities. Combined with `ThirdwebContract` it lets you query balances, mint, transfer, approve, claim, and listen for Transfer events with minimal boilerplate.

Like other extensions, functions are exported at `thirdweb/extensions/erc20` so tree‑shaking keeps bundles small.

## Import Cheatsheet

```ts
import {
  // Reads
  getBalance,
  totalSupply,
  allowance,
  // Writes
  transfer,
  mintTo,
  approve,
  burn,
} from "thirdweb/extensions/erc20";
```

## Common Use‑cases

### 1. Query token metadata & balance

```ts
const meta = await getCurrencyMetadata({ contract });
const bal = await getBalance({ contract, wallet: myAddress });
```

### 2. Mint tokens to a wallet

```ts no‑lint
const tx = mintTo({ contract, to: treasury, amountWei: toWei("1000") });
await sendAndConfirmTransaction({ account: admin, transaction: tx });
```

### 3. Approve spender & call other contract

```ts
await sendTransaction({
  account: myAccount,
  transaction: approve({ contract, spender: router, amountWei: MAX_UINT256 }),
});
```

### 4. Claim from an ERC20 Drop

```ts
const tx = claimTo({ contract, to: user, quantity: "50" });
await sendAndConfirmTransaction({ account: userAccount, transaction: tx });
```

### 5. Wrap / Unwrap ETH (WETH)

```ts
await sendAndConfirmTransaction({
  account,
  transaction: deposit({ contract, amountWei: toWei("1") }),
});
await sendAndConfirmTransaction({
  account,
  transaction: withdraw({ contract, amountWei: toWei("0.5") }),
});
```

## Key Helpers Table

| Category | Helper                 | Purpose                                       |
| -------- | ---------------------- | --------------------------------------------- |
| Read     | `getBalance`           | Returns `GetBalanceResult` (value + decimals) |
| Read     | `totalSupply`          | Total minted tokens                           |
| Read     | `allowance`            | Allowance between owner & spender             |
| Write    | `transfer`             | Standard ERC‑20 transfer                      |
| Write    | `transferBatch`        | Batch send to multiple recipients             |
| Write    | `mintTo`               | Mint to address (if contract supports)        |
| Write    | `burn`, `burnFrom`     | Reduce supply                                 |
| Approval | `approve`              | Approve spender amount                        |
| Drop     | `claimTo`              | Claim from active drop phase                  |
| Drop     | `setClaimConditions`   | Admin set phases                              |
| WETH     | `deposit` / `withdraw` | Wrap & unwrap native ETH                      |

## Events

```ts
import { transferEvent } from "thirdweb/extensions/erc20";

const { data } = useContractEvents({
  contract,
  events: [transferEvent({ from })],
});
```

## Related

- ERC‑721 & ERC‑1155 extensions
- Drop helpers guide
- React hooks for balances & transfers (future task)
