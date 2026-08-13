---
"thirdweb": patch
---

Fix: `EIP1193.toProvider()`'s `removeListener` is no longer a no-op. Previously, `removeListener` discarded the unsubscribe function returned by `wallet.subscribe()`, so listeners registered via `provider.on(...)` (e.g. `accountsChanged`, `chainChanged`, `disconnect`) could never actually be detached — they kept firing after callers (such as wagmi connectors) believed they had unsubscribed. `removeListener` now tracks and invokes the correct unsubscribe function per `(event, listener)` pair.
