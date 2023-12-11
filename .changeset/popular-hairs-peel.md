---
"@thirdweb-dev/wallets": patch
---

Fix assertWindowEthereum - actually check if `window.ethereum` is truthy or not instead of just checking `"ethereum" in window`
