---
"thirdweb": minor
---

Add support for deep-linking to Metamask app instead of using WalletConnect on mobile devices when using Connect UI (`ConnectButton` / `ConnectEmbed`) components.

```ts
<ConnectButton
  client={client}
  wallets={[
    createWallet("io.metamask", {
      preferDeepLink: true,
    }),
  ]}
/>
```
