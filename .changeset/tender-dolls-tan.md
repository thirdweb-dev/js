---
"thirdweb": minor
---

Added session keys to smart wallet options

You can now pass a `sessionKey` to the `smartWallet` options function to immediately add a session key to the smart wallet upon connection.

This is great in combination with an engine backend wallet! Let's you act on behalf of the user from your backend, making executing transactions as easy as a REST API call. Also unblocks automations, like renewing a subscription, or paying for a service.

```ts
const wallet = smartWallet({
  sessionKey: {
    address: "0x...", // the session key address (ex: engine backend wallet)
    permissions: {
      approvedTargets: ["0x..."], // allowed contract addresses (or * for all)
      nativeTokenLimitPerTransaction: 0.1, // max spend per transaction in ETH
      permissionEndTimestamp: new Date(Date.now() + 1000 * 60 * 60), // expiration date
    },
  },
});

// this will connect the user wallet and add the session key if not already added
await wallet.connect({
  client: TEST_CLIENT,
  personalAccount,
});
```

You can also pass the `sessionKey` to the `ConnectButton`, `ConnectEmbed` components and `useConnect` hook.

```tsx
<ConnectButton
  client={client}
  accountAbstraction={{
    chain,
    sponsorGas: true,
    sessionKey: {
      address: "0x...",
      permissions: {
        approvedTargets: "*",
      },
    },
  }}
/>
```

Also works for the `inAppWallet` `smartAccount` option!

```ts
const wallet = inAppWallet({
  smartAccount: {
    chain,
    sponsorGas: true,
    sessionKey: {
      address: "0x...",
      permissions: {
        approvedTargets: "*",
      },
    },
  },
});
```
