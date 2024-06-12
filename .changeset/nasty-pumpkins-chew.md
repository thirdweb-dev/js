---
"thirdweb": patch
---

Fix in-app wallet sending another verification code on window focus when using ConnectEmbed.

Fix the underlying issue of `useAutoConnect` running again on window focus.

Add `refetchOnWindowFocus: false` on few more `useQuery` instances to avoid unnecessary refetches
