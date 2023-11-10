---
"@thirdweb-dev/react-native": patch
---

Adds Apple as a social sign in option for EmbeddedWallet

You can now do:

```typescript
embeddedWallet({
    auth: {
    options: ['apple'],
    redirectUrl: 'your-apps-redirect-url://',
    },
}),
```
