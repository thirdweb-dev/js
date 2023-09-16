---
"@thirdweb-dev/react-native": patch
---

Improved ConnectWallet UX/DevX :)

1. Devs can now pass a `recommended` field to `supportedWallets` to recommend wallets to users.

When recommending a wallet, this wallet will show up at the top of the wallets list.

```javascript
import { metamaskWallet, ThirdwebProvider } from "@thirdweb-dev/react-native";

<ThirdwebProvider
  clientId="your-client-id"
  supportedWallets={[
    metamaskWallet({
      recommended: true,
    }),
  ]}
>
  <App />
</ThirdwebProvider>;
```

2. Better theme customization

You can now more easily customize the theme of the ConnectWallet component:

```javascript
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";

<ConnectWallet
  theme={darkTheme({
    colors: {
      textPrimary: "yellow",
      textSecondary: "blue",
    },
  })}
  buttonTitle="Enter web3"
  modalTitle="Sign in"
/>;
```

Note that you can still pass `light` or `dark` if you want to use one of the predefined thems :)

3. You can now pass your Privacy Policy and Terms of Service urls, they will show up
   at the bottom of the modal:

```javascript
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";

<ConnectWallet
  privacyPolicyUrl="https://your-privacy-policy"
  termsOfServiceUrl="https://your-terms-of-service"
/>;
```

4. Fixed a bug when you only specify an email wallet. In this case the app shouldn't auto connect, it should show the email field.
