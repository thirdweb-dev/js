---
"@thirdweb-dev/storage": minor
---

Adds new `clientId` / `secretKey` option to access thirdweb's services

You can create a *free* `clientId` / `secretKey` pair [on the thirdweb Dashboard](https://thirdweb.com/dashboard)

```javascript
// if used on the frontend pass the `clientId`
const storage = new ThirdwebStorage({
    clientId: 'your-client-id'
})

// if used on the backend pass the `secretKey`
const storage = new ThirdwebStorage({
    secretKey: 'your-secret-key'
})

```