---
"thirdweb": patch
---

Fixed a bug where passing in --ci in publish, release or deploy would still open the url and crash during runtime. Now it won't open the url if --ci is passed in.
