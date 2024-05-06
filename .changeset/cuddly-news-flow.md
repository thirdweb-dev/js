---
"thirdweb": patch
---

New `accountAbtraction` prop for `inAppWallet()`

You can now convert an inAppWallet to a smart account simply by passing the `accountAbstraction` prop.

Requires `chain: Chain` and `sponsorGas: true | false`.

Note: beware that when toggling this flag on and off, you will get a different address (admin EOA vs smart account).
