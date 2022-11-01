---
"@thirdweb-dev/sdk": minor
---

### Breaking changes:

1. claim conditions had some changes to support the new drop contracts:
- `maxClaimablePerTransaction` is now named `maxClaimablePerWallet`
- `maxQuantity` is now named `maxClaimable`

2. signature minting now requires a `to` address to be set for security purposees

### Main Changes:

- Support for new optimized Drop contracts
- Support for new claim conditions with overrides
- Don't allow zero address recipient on signature minting
