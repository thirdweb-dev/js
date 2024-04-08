---
"@thirdweb-dev/wallets": minor
---

Adds Login with SMS in EmbeddedWallet.

Note that the `phoneNumber` requires the `+` symbol along with the IsoCountry code before the actual phone number.

For a list of supported country code, you can use the `supportedSmsCountries` object which contains a list of all support country information.

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
