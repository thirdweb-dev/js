---
"@thirdweb-dev/react": patch
---

New API to configure authentication options on `embeddedWallet`

```ts
// default - google sign in is enabled
embeddedWallet();

// this is same as
embeddedWallet({
  authOptions: {
    providers: ["email", "google"],
  },
});

// only email
embeddedWallet({
  authOptions: {
    providers: ["email"],
  },
});

// only google sign in
embeddedWallet({
  authOptions: {
    providers: ["google"],
  },
});
```
