---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Improve customization of buttons background and text colors

You can now pass custom background and text colors without having to create the full theme object. Alternatively, you can complete customize the theme:

```ConnectWallet button
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react-native';

<ConnectWallet theme={darkTheme({
   buttonBackgroundColor: '#new-color',
   buttonTextColor: '#another-color'
})}
/>
```

```Web3Button
import { Web3Button, lightTheme } from '@thirdweb-dev/react-native';

<Web3Button theme={lightTheme({
   buttonBackgroundColor: '#new-color',
   buttonTextColor: '#another-color'
})}
/>
```

Customizing theme beyond the button:

```ConnectWallet button
import { ConnectWallet, darkTheme } from '@thirdweb-dev/react-native';

const darkThemeCustom = darkTheme();

<ConnectWallet
    theme={{
    ...darkThemeCustom,
    colors: {
        ...darkThemeCustom.colors,
        backgroundHighlight: 'blue',
    },
    }}
/>
```
