---
"thirdweb": patch
---

Fix: in-app wallet email/phone OTP login (`sendOtp`/`verifyOtp`) now routes through `getClientFetch` instead of the global `fetch`. Previously these calls never attached the SDK's platform headers, so on React Native the `x-bundle-id` header was never sent — making it impossible to use email/phone OTP login with a Bundle ID access restriction configured on the client ID, since the backend rejects requests missing that header with a 401.
