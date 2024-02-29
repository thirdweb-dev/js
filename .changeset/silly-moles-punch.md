---
"@thirdweb-dev/react": patch
---

Remove unnecessary ConnectModal auto opening.

This also fixes the issue where Connect Modal opens on page load when `ThirdwebProvider` is dynamically imported and rendered in the app.
