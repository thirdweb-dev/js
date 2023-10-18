---
"@thirdweb-dev/wallets": minor
"@thirdweb-dev/react": minor
---

feat (wallets): Add support for user managed recovery code login flows for embedded wallets in all flows except Google Login

feat (wallets): Expose `EmbeddedWallet.sendEmailOtp({ email })` to allow for the initiation of the headless email flow.

Finish the flow by calling the following on the cloud hosted recovery flow

```
EmbeddedWallet.connect({
    loginType: "headless_email_otp_verification",
    email,
    otp
})
```

On the user managed recovery code flow

```
EmbeddedWallet.connect({
    loginType: "headless_email_otp_verification",
    email,
    otp,
    recoveryCode
})
```

The `recoveryCode` field is needed if `isNewUser` is `true` or `isNewDevice` is `true` for users on the `recoveryShareManagement === USER_MANAGED`.

To verify the OTP first without supplying the recovery code, you can call `.connect` with all the field without the recovery code. If you see an error message containing `Your OTP code is invalid or expired` then the OTP was invalid. Otherwise, you'd see `Missing recovery code for user`. In which case you can proceed to call the same function with all the same params but this time after prompting the user for the `recoveryCode`.

feat (react): Add support for user managed recovery code flows for embedded wallets in thirdweb connect.
