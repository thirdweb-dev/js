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
      // if this is true AND oauthOptions is not set we set it to false internally
      email: true,
      // if this is set we enable Sign in with Google
      oauthOptions: {
        redirectUrl: "test15app://",
        providers: ["google"],
      },
    }),
  ]}
>
  <App />
</ThirdwebProvider>
```
