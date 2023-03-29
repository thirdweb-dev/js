---
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/wallets": patch
---

[Wallets] Add autoconnect capabilities

- You can now call `.autoConnect` on your wallets and it will check if the wallet is connected. If it's not, it will not trigger the connect flow
