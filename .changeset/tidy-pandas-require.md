---
"@thirdweb-dev/insight": patch
"@thirdweb-dev/engine": patch
"@thirdweb-dev/api": patch
"@thirdweb-dev/service-utils": patch
---

Fix missing `tslib` runtime dependency so the CommonJS builds can be required. The CJS output emits `require("tslib")` (via `importHelpers`), but `tslib` was only a devDependency (or missing entirely), so requiring the published packages failed with `Cannot find module 'tslib'`.
