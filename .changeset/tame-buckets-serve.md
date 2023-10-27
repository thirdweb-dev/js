---
"@thirdweb-dev/wallets": minor
---

# New Embedded Wallet API:

### Headless Email authentication

```ts
// send verification email
await embeddedWallet.sendVerificationEmail({
  email,
});

// verify email
const authResult = embeddedWallet.authenticate({
  strategy: "email_verification",
  verificationCode: code,
});

// connect
const walletAddress = embeddedWallet.connect({
  authResult,
});
```

### Google sign in authentication

```ts
// prompt google sign in
const authResult = embeddedWallet.authenticate({
  strategy: "google",
});

// connect
const walletAddress = embeddedWallet.connect({
  authResult,
});
```

### iframe based authentication

```ts
// open iframe to sign in
const authResult = embeddedWallet.authenticate({
  strategy: "iframe",
});

// connect
const walletAddress = embeddedWallet.connect({
  authResult,
});
```

### Custom Auth (JWT)

```ts
// authenticate with any JWT system
const jwt = await yourLogin();

// verify JWT
const authResult = embeddedWallet.authenticate({
  strategy: "jwt",
  jwt,
});

// connect
const walletAddress = embeddedWallet.connect({
  authResult,
});
```
