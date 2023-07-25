---
"@thirdweb-dev/react-native": patch
---

Extend the thirdweb SDK and pass the correct React Native storage

```javascript
import { ThirdwebSDK } from "@thirdweb-dev/react-native";

const newSdk = new ThirdwebSDK("mumbai");
const resp = await newSdk.storage.upload({ foo: "bar" });
```
