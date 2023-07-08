---
"@thirdweb-dev/react-native": patch
---

SDK improvements:

1. You can now pass an `extraRows` prop to the ConnectWallet button. This will render the `extraRows` at the bottom of the connected wallet details modal.

```javascript
import {
  BaseButton,
  Box,
  ConnectWallet,
  Text,
} from "@thirdweb-dev/react-native";

const extraRows = () => {
  return (
    <Box>
      <Text variant="bodySmallSecondary" textAlign="center" mt="sm">
        Extra option
      </Text>
    </Box>
  );
};

<ConnectWallet theme={"dark"} extraRows={extraRows} />;
```

2. You can now import a local wallet by a mnemoic as well.

When creating a Local/Guest Wallet the import wallet modal accepts both a privateKey or a mnemonic. This makes it easier for users to import their wallets into your app
