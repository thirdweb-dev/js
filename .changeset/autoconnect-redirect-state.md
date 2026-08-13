---
"thirdweb": minor
---

Redirect-based in-app wallet logins now include and verify a one-time `state` value before `AutoConnect` consumes auth material returned in the URL, tying the returned token back to a flow the page actually started. Added a `readUrlToken` option to `AutoConnect` / `useAutoConnect` to opt out of reading wallet auth material from the URL entirely.
