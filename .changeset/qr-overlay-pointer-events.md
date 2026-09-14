---
"thirdweb": patch
---

Keep the WalletConnect QR overlay usable when it is opened from inside another modal, and stop overlays stacking.

The vanilla `createQROverlay` did not declare `pointer-events` on its root. Because the overlay is appended to `document.body`, and modal libraries commonly set `pointer-events: none` there while a dialog is open, the overlay inherited that value and became unclickable — visible at `z-index: 9999`, but with clicks passing through to the dialog behind it. It now sets `pointer-events: auto` explicitly.

Separately, each connect attempt only tracked the overlay it created, so an abandoned attempt — or a pairing that expired and re-emitted its URI — left its overlay in the DOM and the next attempt stacked another on top. Overlays are now tagged and any stale one is removed before a new one is appended.
