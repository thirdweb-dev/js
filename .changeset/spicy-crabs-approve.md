---
"@thirdweb-dev/react-native-compat": patch
"@thirdweb-dev/react-native": patch
---

Adds EmbeddedWallet (email) to React Native

You can now do:

```javascript
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react-native";

<ThirdwebProvider
  clientId="your-client-id"
  supportedWallets={[embeddedWallet()]}
>
  <App />
</ThirdwebProvider>;
```

To use the `embeddedWallet` you need to add the following dependencies to your project:

- `"amazon-cognito-identity-js": "^6.3.3"`
- react-native-quick-base64
- react-native-quick-crypto

  - There's an open issue on RN > 0.72: https://github.com/margelo/react-native-quick-crypto/issues/186 which you can [fix by](https://github.com/margelo/react-native-quick-crypto/issues/186#issuecomment-1663666739) adding the following to your `android/app/build.gradle` file:

    ```
    packagingOptions {
        pickFirst 'lib/x86/libcrypto.so'
        pickFirst 'lib/x86_64/libcrypto.so'
        pickFirst 'lib/armeabi-v7a/libcrypto.so'
        pickFirst 'lib/arm64-v8a/libcrypto.so'
    }
    ```

  - When building the iOS app in release mode for RN 0.71 you need to enable the OpenSSL framework in XCode. There are several solutions for this here:
    - https://github.com/margelo/react-native-quick-crypto/issues/121#issuecomment-1369924076
    - https://github.com/margelo/react-native-quick-crypto/issues/121#issuecomment-1537576444

- react-native-aes-gcm-crypto
  - This package requires minSdkVersion = 26 on Android
