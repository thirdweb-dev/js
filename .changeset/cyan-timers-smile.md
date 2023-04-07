---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/auth": patch
---

[RN] Adds Auth to React Native

- Adds an optional `secureStorage` to authConfig
- Adds `expo-secure-store` to store the JWT token securely in React Native, passing a default value
- Stores the token in secure storage to be accessed by subsequent calls
- Returns the token in `useLogin` to be used by the user

How I tested:

- Tested in Android/iOS/Web

Usage:

```
<ThirdwebProvider
      activeChain="ethereum"
      supportedWallets={[metamaskWallet(), rainbowWallet()]}
      authConfig={{
        domain: https://your-domain.com,
        authUrl: '/api/auth',
      }}>
      <AppInner />
    </ThirdwebProvider>
```

```
const { login } = useLogin();
const { logout } = useLogout();
const { user, isLoggedIn } = useUser();
...

const token = await login();
```
