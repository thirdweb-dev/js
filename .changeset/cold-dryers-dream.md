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
} from '@thirdweb-dev/react-native';
import {Button} from 'react-native';
import React from 'react';

const App = () => {
  return (
    <ThirdwebProvider
      supportedWallets={[
        embeddedWallet({
          custom_auth: true, // when true, it will not display a UI
        }),
      ]}>
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const createInstance = useCreateWalletInstance();
  const setConnectedWallet = useSetConnectedWallet();

  const triggerConnect = async () => {
    const embeddedWalletConfig = embeddedWallet();

    if (embeddedWalletConfig) {
      const instance = createInstance(embeddedWalletConfig);

      if (instance) {
        await (instance as EmbeddedWallet).connect({
          loginType: 'custom_jwt_auth',
          encryptionKey: 'hello',
          jwtToken: 'customJwt' || '',
        });
        setConnectedWallet(instance); // this sets the active wallet on the provider enabling all thirdweb hooks
      }
    }
  };

  return <Button title={'Connect with custom JWT'} onPress={triggerConnect} />;
};


```
