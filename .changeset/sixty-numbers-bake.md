---
"@thirdweb-dev/react": patch
---

feat: add apple auth to embedded wallet

```
<ThirdwebProvider
  supportedWallets={[
    embeddedWallet({
      auth: {
        options: ["google", "email", "apple"], // <- new apple option!
      }
    })
  ]}
>
```
