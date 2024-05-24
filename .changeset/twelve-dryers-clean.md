---
"thirdweb": minor
---

WalletConnect in React Native + useAutoConnect hook

## Support WalletConnect compatible wallets in React Native

You can now connect any of the 300+ WalletConnect compatible mobile wallets from react native.

```ts
import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const { connect, isConnecting } = useConnect();

const connectMetamask = async () => {
    await connect(async () => {
        const wallet = createWallet("io.metamask");
        await wallet.connect({
            client,
            chain,
        });
        return wallet;
    });
};
```

## Exposed `useAutoConnect` hook

You can now use a hook to trigger autoconnecting to the last connected wallet

```ts
import { useAutoConnect } from "thirdweb/react";

const { data: autoConnected, isLoading } = useAutoConnect({
    client,
    accountAbstraction,
    wallets,
    onConnect,
    timeout,
});
```