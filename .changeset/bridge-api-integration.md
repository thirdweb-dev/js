---
"thirdweb": minor
---

Add React hook for Bridge API with multi-step route support

- Added `useBuyPrepare` hook that directly uses the Bridge API's `Buy.prepare()` function
- This hook supports multi-step routes (e.g., Token A → Token B → Token C) which the legacy `getBuyWithCryptoQuote` does not support
- Updated internal UI components to use the new hook while maintaining backward compatibility
- The new hook returns the full Bridge quote structure with a `steps` array containing all route steps and their transactions
- Each step can have multiple transactions (approval and swap) that need to be executed sequentially
- Exported from the React module as `useBuyPrepare` with `UseBuyPrepareParams` type

This change lays the foundation for supporting complex multi-hop swaps in the PayEmbed UI, though the UI currently only handles single-step routes through an adapter.