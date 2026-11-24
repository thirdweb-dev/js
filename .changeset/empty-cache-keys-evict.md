---
"thirdweb": patch
---

Fixed LRU cache eviction when an empty string is the oldest key, keeping SDK validation caches within their configured size.
