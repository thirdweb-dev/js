---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

[Core,React,RN,Wallets] Allow for wallets to be created without props where possible

You can now create wallets without having to worry about it's params. We provide sensible defaults.

```
const w = new WalletConnectV1();
  w.connect();

const w1 = new WalletConnect();
w1.connect();

const cb = new CoinbaseWallet()
w1.connect();

const safe = new SafeWallet();

const device = new DeviceBrowserWallet();
```
