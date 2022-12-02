---
"@thirdweb-dev/sdk": patch
---

[EVM] - providers are now re-used if the constructor options are identical leading to better batching, also introduced an additional max batch size param (250 by default)
