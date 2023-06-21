---
"@thirdweb-dev/wallets": patch
---

[Wallets] Fix switchChain in WCV2 connector

WCV2 `blockExplorerUrls` field receives an array of urls but we were passing an array of blockExplorer objects, so adding a new chain was failing, hence switching chains was failing
