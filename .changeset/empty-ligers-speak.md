---
"@thirdweb-dev/sdk": patch
---

Adds new `clientId` / `secretKey` option to access thirdweb's services

You can create a *free* `clientId` / `secretKey` pair [on the thirdweb Dashboard](https://thirdweb.com/dashboard)

```javascript
// if used on the frontend pass the `clientId`
const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "ethereum", {
    clientId: 'your-thirdweb-client-id'
})

// if used on the backend pass the `secretKey`
const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "ethereum", {
    secretKey: 'your-thirdweb-secret-key'
})
```