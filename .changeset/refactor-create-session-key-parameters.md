---
"thirdweb": patch
---

**Refactor createSessionKey function to remove contract parameter**

- Remove `contract` input parameter from `createSessionKey` function in `thirdweb/wallets/in-app`
- Function now recreates contract internally using `account.address` with auto-resolved ABI  
- Updated function signature to take `client` and `chain` directly instead of extending `BaseTransactionOptions`
- Updated related session key tests to match new function signature
- Simplified implementation while maintaining all existing functionality