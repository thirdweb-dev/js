---
"@thirdweb-dev/react": minor
---

New API to configure authentication options on `embeddedWallet`

```ts
// default - google sign in is enabled
embeddedWallet();

// this is same as
embeddedWallet({
  auth: {
    options: ["email", "google"],
  },
});

// only email
embeddedWallet({
  auth: {
    options: ["email"],
  },
});

// only google sign in
embeddedWallet({
  auth: {
    options: ["google"],
  },
});
```
