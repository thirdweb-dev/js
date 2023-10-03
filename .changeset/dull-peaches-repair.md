---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
---

`WalletConfig.connectUI`` props updated:

- `close` and `open` removed - wallet can no longer "close" the Modal
- `hide` and `show` added to only allow hiding and showing the Modal
- `connected` added - use this instead of `close` when wallet is connected and Modal is safe to close.
