---
"@thirdweb-dev/react-native": patch
---

Enables Google Sign In for embeddedWallet in React Native

```javascript
<ThirdwebProvider
  activeChain={activeChain}
  clientId={"your-client-id"}
  supportedWallets={[
    embeddedWallet({
      oauthOptions: {
        redirectUrl: "deepLinkToYourApp://",
      },
    }),
  ]}
>
  <App />
</ThirdwebProvider>
```
