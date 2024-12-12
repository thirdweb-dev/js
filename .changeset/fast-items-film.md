---
"thirdweb": minor
---

Adds a defaultSmsCountryCode configuration option to In-App and Ecosystem Wallets

```ts
createWallet("inApp", {
    auth: {
      options: [
        "email",
        "phone",
      ],
      mode: "redirect",
      defaultSmsCountryCode: "IN", // Default country code for SMS
    },
  }),
  ```
