---
"thirdweb": patch
---

Fixes inconsistent block numbers when fetching events.

`getContractEvents` will now properly handle `blockRange` interaction with `fromBlock` and `toBlock` given they are both inclusive (i.e. it will only return logs for the number of blocks specified in `blockRange`).
