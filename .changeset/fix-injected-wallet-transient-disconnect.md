---
"thirdweb": patch
---

Fix: injected wallets (e.g. MetaMask) no longer fire a spurious `"disconnect"` event for transient EIP-1193 error code 1013 ("disconnected, will reconnect"). Previously, MetaMask's temporary disconnect during chain changes or RPC hiccups would trigger the thirdweb `disconnect` subscriber and tear down wallet state, causing unexpected logouts. The `onDisconnect` handler now ignores code-1013 errors and lets MetaMask reconnect automatically.

Additionally, the `WalletEmitterEvents["disconnect"]` type is updated from `never` to `WalletDisconnectError | undefined`, so `disconnect` subscribers can inspect the underlying EIP-1193 error code and message when they need to distinguish disconnect causes.
