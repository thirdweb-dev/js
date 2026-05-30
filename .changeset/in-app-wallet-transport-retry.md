---
"thirdweb": patch
---

Retry SDK and in-app wallet auth requests on transient network failures

Requests now automatically retry (with jittered exponential backoff) when they fail at the network layer before any HTTP response is received — for example a `TypeError: Network request failed` on React Native. Received HTTP responses and aborted/timed-out requests are never retried, so this does not duplicate side effects such as sending a verification code.
