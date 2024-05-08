---
"thirdweb": patch
---

Fixes inconsistent block numbers when fetching events.

Prevents errors from inconsistent `eth_blockNumber` return values, `fromBlock` now waits for the latest block in `getContractEvents` to catch up if within a reasonable range.

`getContractEvents` will now properly handle `blockRange` interaction with `fromBlock` and `toBlock` given they are both inclusive (i.e. it will only return logs for the number of blocks specified in `blockRange`).
