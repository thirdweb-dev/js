---
"thirdweb": patch
---

Fixed x402 payment retries for Request-owned bodies by reserving a bounded-body retry copy before the first fetch and releasing unused copies.

Preserve explicit referrer options when retrying on newer Node runtimes.
