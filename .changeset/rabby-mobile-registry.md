---
"thirdweb": patch
---

Fix Rabby connections on mobile and in-modal QR on desktop by refreshing its stale wallet registry entry.

The generated entry for `io.rabby` recorded no iOS app, no Android app and no deep link, even though the WalletConnect registry has published all three for some time. As a result Rabby had no mobile hand-off available and was excluded from `WCSupportedWalletIds`, so mobile users could not reach the Rabby app and desktop users were routed onto the generic external-connect fallback instead of the in-modal WalletConnect QR screen.
