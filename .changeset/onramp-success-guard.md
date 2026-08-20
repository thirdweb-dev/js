---
"thirdweb": patch
---

Fixed Universal Bridge onramp checkout incorrectly reporting success when the onramp did not complete. A failed onramp now surfaces the error instead of a false success, and retrying a failed onramp prepares a fresh payment session rather than replaying the expired one (post-onramp transaction failures still retry in place, so completed onramps are never charged twice).
