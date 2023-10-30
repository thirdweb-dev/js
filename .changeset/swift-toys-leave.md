---
"@thirdweb-dev/react-native": minor
---

New API to configure authentication options on `embeddedWallet`

```ts
// default - google sign in is enabled
embeddedWallet();

// this is same as
embeddedWallet({
  auth: {
    options: ["email"],
  },
});

// add google sign in
embeddedWallet({
  auth: {
    options: ["email", "google"],
    redirectUrl: "your_app://deeplink",
  },
});
```
