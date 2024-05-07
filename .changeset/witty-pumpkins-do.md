---
"thirdweb": patch
---

Fixes inconsistent block numbers when fetching events.

Prevents errors from inconsistent `eth_blockNumber` return values, `fromBlock` now reverts back to "latest" when greater than the latest block.

`getContractEvents` will now properly handle `blockRange` interaction with `fromBlock` and `toBlock` given they are both inclusive (i.e. it will only return logs for the number of blocks specified in `blockRange`).
