---
"@thirdweb-dev/react-native": patch
---

Adds Google sign in to embeddedWallet in React Native

You need to add the `react-native-inappbrowser-reborn` package to your app, then you can do:

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
