---
"thirdweb": patch
---

Add fallback mechanism to usePaymentMethods hook for getOwnedTokens failures

When getOwnedTokens batches fail in the usePaymentMethods hook, the system now falls back to getting native token balances for each chain using getWalletBalance. This ensures users can still access their native tokens as payment methods even when the insight API is experiencing issues, providing a more resilient user experience.

The fallback mechanism:
- Catches getOwnedTokens failures and logs warnings
- Falls back to native balance fetching using getWalletBalance for each chain
- Transforms results to match the expected format
- Continues normal processing flow seamlessly