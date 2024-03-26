---
"@thirdweb-dev/wallets": minor
---

feat: add phone number verification to embedded wallets

Usage:

```typescript
const embeddedWalletSdk = new EmbeddedWalletConnector({
  clientId: "YOUR_THIRDWEB_CLIENT_ID",
  // ...
});

// phone number needs to have the country code as prefix
await embeddedWalletSdk.sendVerificationSms({ phoneNumber: "+11234567890" });

const authResult = await embeddedWalletSdk.authenticate({
  strategy: "phone_number_verification",
  verificationCode: "123456",
});

const walletAddress = await embeddedWalletSdk.connect({
  authResult,
});
const signer = await embeddedWalletSdk.getSigner();
```
