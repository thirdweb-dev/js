---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react": patch
---

Improved `useSmartWallet()` hook

Example with metamask:

```ts
const { connect } = useSmartWallet(metamaskWallet(), {
  factoryAddress: factoryAddress,
  gasless: true,
});

const onClick = async () => {
  // nothing to do here, all handled internally
  await connect();
};
```

```ts
Example with localWallet:

const { connect } = useSmartWallet(localWallet(), {
    factoryAddress: factoryAddress,
    gasless: true,
});

const onClick = async () => {
    // function to 'load' the local wallet before using it
    await connect({
        connectPersonalWallet: async (w) => {
            await w.generate();
            await w.connect();
        }
    });
}
```

```ts
Example with embeddedWallet:

const { connect } = useSmartWallet(embeddedWallet(), {
    factoryAddress: factoryAddress,
    gasless: true,
});

const onClick = async () => {
    // function to 'auth' the embedded wallet before using it
    await connect({
        connectPersonalWallet: async (w) => {
            const authResult = await w.authenticate({ strategy: "google" });
            await w.connect({ authResult });
        }
    });
}
```
