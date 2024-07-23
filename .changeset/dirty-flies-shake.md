---
"thirdweb": patch
---

handle `null` value of `effectiveGasPrice` in `sendTransaction`  method of `toEthersSigner` adapter that throws error when trying to convert to BigNumber. This is causing issue in XDC Network (chain Id 50) and XDC Apothem testnet (chain id 51)
