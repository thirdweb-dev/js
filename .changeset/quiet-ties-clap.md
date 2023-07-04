---
"@thirdweb-dev/storage": patch
---

Switch over to the new `ipfs.thirdweb-storage.com` public gateway.
Better fallback logic for if a gateway is down.
Faster loading of files from the default gateway by skipping a roundtrip to redirect.
