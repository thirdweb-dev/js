---
"@thirdweb-dev/wallets": minor
---

1. Adds new `clientId` / `secretKey` option to access thirdweb's services

You can create a *free* `clientId` / `secretKey` pair [on the thirdweb Dashboard](https://thirdweb.com/dashboard)

```javascript
// For wallets used on the client-side (i.e. react, react-native) you should
// pass a `clientId`
const metamaskWallet = new MetaMaskWallet({
    clientId: 'your-client-id'
})

// For wallets used on the backend-side (i.e. node, express) you should
// pass a `secretKey`
const localWallet = new LocalWallet({
    secretKey: 'your-secret-key'
})
```

2. Paper wallet's `clientId` is renamed to `paperClientId`. 

The `clientId` option is reserved for thirdweb's `clientId``

```javascript
const paperWallet = new PaperWallet({
    clientId: 'your-thirdweb-client-id',
    paperClientId: 'your-paper-client-id',
})
```
