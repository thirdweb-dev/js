---
"@thirdweb-dev/service-utils": patch
---

Treat domain and bundle-id allowlists as a union: a request presenting both an unlisted origin and a valid bundle id (e.g. a webview or in-app browser) is now authorized by the bundle match instead of being rejected on the origin check.
