---
"@thirdweb-dev/react-native": patch
---

Custom JWT support in React Native

Enables passing a custom JWT to the embeddedWallet:

```javascript
import {
  EmbeddedWallet,
  embeddedWallet,
  ThirdwebProvider,
  useCreateWalletInstance,
  useSetConnectedWallet,
} from "@thirdweb-dev/react-native";
import { Button } from "react-native";
import React from "react";

const App = () => {
  return (
    <ThirdwebProvider
      supportedWallets={[
        embeddedWallet({
          custom_auth: true, // when true, it will not display a UI
        }),
      ]}
    >
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const connect = useConnect();

  const triggerConnect = async () => {
    connect(embeddedWallet(), {
      loginType: "custom_jwt_auth",
      encryptionKey: "strong-encryption-key",
      jwtToken: "your-jwt-token",
    });
  };

  return <Button title={"Connect with custom JWT"} onPress={triggerConnect} />;
};
```
