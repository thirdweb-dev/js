---
"@thirdweb-dev/react-native": patch
---

Adds localization for the React Native SDK

You can now pass a Locale object to the ThirdwebProvider with your translations:

```javascript
import { ThirdwebProvicer, en } from @thirdweb-dev/react-native;

<ThirdwebProvider locale={{
    ...your-translated-strings
}}>
    <App />
</ThirdwebProvider>
```
