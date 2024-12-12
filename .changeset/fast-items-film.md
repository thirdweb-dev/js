---
"thirdweb": minor
---

Adds a defaultSmsCountryCode configuration option to In-App and Ecosystem Wallets

```ts
createWallet("inApp", {
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "email",
        "passkey",
        "phone",
        "farcaster",
        "line",
      ],
      mode: "redirect",
      passkeyDomain: getDomain(),
      defaultSmsCountryCode: "AF",
    },
  }),
  ```
