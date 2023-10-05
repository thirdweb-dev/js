---
"@thirdweb-dev/react-core": patch
---

Better `useWallet()` API to obtain specific wallet instances.

```
const smartWallet = useWallet("smartWallet"); // returns a SmartWallet instance
const embeddedWallet = useWallet("embeddedWallet"); // returns a EmbeddedWallet instance
```
