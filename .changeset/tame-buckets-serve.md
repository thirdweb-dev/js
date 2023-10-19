---
"@thirdweb-dev/wallets": minor
---

feat (wallets): Add support for user managed encryption key login flows for embedded wallets in all flows except Google Login

feat (wallets): Expose `EmbeddedWallet.sendEmailOtp({ email })` to allow for the initiation of the headless email flow.

Finish the flow by calling the following on the cloud hosted encryption key

```
EmbeddedWallet.connect({
    loginType: "headless_email_otp_verification",
    email,
    otp
})
```

On the user managed encryption key flow

```
EmbeddedWallet.connect({
    loginType: "headless_email_otp_verification",
    email,
    otp,
    encryptionKey
})
```

The `encryptionKey` field is needed if `isNewUser` is `true` or `isNewDevice` is `true` for users on the `recoveryShareManagement === USER_MANAGED`.

To verify the OTP first without supplying the encryption key, you can call `.connect` with all the field without the encryption key. If you see an error message containing `Your OTP code is invalid or expired` then the OTP was invalid. Otherwise, you'd see `Missing encryption key for user`. In which case you can proceed to call the same function with all the same params but this time after prompting the user for the `encryptionKey`.

feat (react): Add support for user managed encryption code flows for embedded wallets in thirdweb connect.
