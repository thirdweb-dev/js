---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/wallets": patch
---

[RN/Wallets] Fix Coinbase wallet connection rejection error

Unhandled Rejections: We were rethrowing an error in an async function (connect) without any catch block to handle it. We were getting an Unhandled Promise Rejection, which lead to a crash in React Native when rejecting a connection from the Coinbase Wallet.
