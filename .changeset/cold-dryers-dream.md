---
"@thirdweb-dev/react-native": patch
---

Custom JWT support in React Native

Enables passing a custom JWT to the embeddedWallet:

```javascript
import { embeddedWallet, useConnect } from "@thirdweb-dev/react-native";
import { Button } from "react-native";
import React from "react";

const AppInner = () => {
  const connect = useConnect();

  const triggerConnect = async () => {
    connect(embeddedWallet(), {
      loginType: "custom_jwt_auth",
      password: "strong-encryption-key",
      jwt: "your-jwt",
    });
  };

  return <Button title={"Connect with custom JWT"} onPress={triggerConnect} />;
};
```
