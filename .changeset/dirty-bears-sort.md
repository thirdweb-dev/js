---
"thirdweb": patch
---

Do not subscribe to `session_request_sent` event when using `walletConnect` because that is already handled when connecting with official Modal
