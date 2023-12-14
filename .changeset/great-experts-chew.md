---
"@thirdweb-dev/sdk": patch
---

Fix error when fetching data on `vite-node` environment by setting a global variable `TW_SKIP_FETCH_SETUP` to `true`. Fixes https://github.com/thirdweb-dev/js/issues/2002

Setting this flag sets `skipFetchSetup` to `true` in [ethers ConnectionInfo](https://docs.ethers.org/v5/api/utils/web/#ConnectionInfo)

```ts
// set this global variable
globalThis.TW_SKIP_FETCH_SETUP = true;

// use the thirdweb sdk...
```
