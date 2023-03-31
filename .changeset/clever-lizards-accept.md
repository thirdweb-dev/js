---
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": patch
---

Fix wallet autoconnect issues

### Fixes

- infinite loading spinner on connect wallet button when wallet is locked or connection to app is closed
- network switch popup on page load when wallet is connected to different network than it was previously connected
- removed autoconnect timeout - don't need it anymore
