---
"@thirdweb-dev/storage": patch
"@thirdweb-dev/sdk": patch
"@thirdweb-dev/unity-js-bridge": patch
---

Passes API key to thirdweb storage ipfs uploader

If you want to use thirdweb's storage upload services you need to pass an API key.
You can grab one from: https://thirdweb.com/dashboard/settings

If using ThirdwebStorage directly:

```javascript
new ThirdwebStorage({
    apiKey: <yourApiKey>,
});
```
